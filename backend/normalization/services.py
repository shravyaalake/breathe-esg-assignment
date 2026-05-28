from decimal import Decimal
from datetime import datetime

from tenants.models import Facility
from .models import NormalizedActivity

DIESEL_EMISSION_FACTOR = Decimal("2.68")  # kg CO2e per litre, simplified


def parse_date(value):
    if not value:
        return None

    for fmt in ("%Y-%m-%d", "%d-%m-%Y", "%d/%m/%Y"):
        try:
            return datetime.strptime(value, fmt).date()
        except ValueError:
            continue

    return None


def normalize_sap_record(raw_record):
    row = raw_record.raw_payload
    flags = []

    plant_code = row.get("PlantCode")
    facility = Facility.objects.filter(
        tenant=raw_record.tenant,
        code=plant_code
    ).first()

    if not facility:
        flags.append("MISSING_FACILITY")

    quantity_text = row.get("Quantity")
    unit_original = row.get("Unit", "").strip()

    try:
        quantity = Decimal(quantity_text)
    except Exception:
        quantity = None
        flags.append("INVALID_QUANTITY")

    if quantity is not None and quantity < 0:
        flags.append("NEGATIVE_QUANTITY")

    material_description = row.get("MaterialDescription", "").lower()

    activity_type = "Procurement"
    scope_category = "SCOPE_3"
    emission_factor = None
    co2e = None
    quantity_normalized = quantity
    unit_normalized = unit_original

    if "diesel" in material_description:
        activity_type = "Fuel Combustion"
        scope_category = "SCOPE_1"
        unit_normalized = "L"

        if unit_original.upper() in ["L", "LITRE", "LITER"]:
            quantity_normalized = quantity
            emission_factor = DIESEL_EMISSION_FACTOR
            co2e = quantity * emission_factor if quantity is not None else None
        else:
            flags.append("UNKNOWN_UNIT")

    activity_date = parse_date(row.get("PostingDate"))

    if not activity_date:
        flags.append("INVALID_DATE")

    normalized = NormalizedActivity.objects.create(
        tenant=raw_record.tenant,
        raw_record=raw_record,
        ingestion_batch=raw_record.ingestion_batch,
        source_system=raw_record.source_system,
        facility=facility,
        activity_type=activity_type,
        scope_category=scope_category,
        activity_date=activity_date,
        quantity_original=quantity,
        unit_original=unit_original,
        quantity_normalized=quantity_normalized,
        unit_normalized=unit_normalized,
        emission_factor=emission_factor,
        co2e=co2e,
        status="PENDING",
        flags=flags,
    )

    raw_record.parse_status = "PARSED"
    raw_record.save(update_fields=["parse_status"])

    return normalized