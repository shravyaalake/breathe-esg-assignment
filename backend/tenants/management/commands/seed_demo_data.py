from django.core.management.base import BaseCommand
from tenants.models import Tenant, Facility
from sources.models import SourceSystem


class Command(BaseCommand):
    help = "Seed demo tenant, facilities, and source systems"

    def handle(self, *args, **options):
        tenant, _ = Tenant.objects.get_or_create(
            name="ABC Manufacturing Ltd",
            defaults={"industry": "Automotive"},
        )

        facilities = [
            ("Bengaluru Plant", "BLR01", "India", "Karnataka"),
            ("Pune Plant", "PUN01", "India", "Maharashtra"),
            ("Chennai Plant", "CHE01", "India", "Tamil Nadu"),
            ("Hyderabad Plant", "HYD01", "India", "Telangana"),
            ("Mumbai Plant", "MUM01", "India", "Maharashtra"),
            ("Delhi Plant", "DEL01", "India", "Delhi"),
        ]

        for name, code, country, region in facilities:
            Facility.objects.get_or_create(
                tenant=tenant,
                code=code,
                defaults={
                    "name": name,
                    "country": country,
                    "region": region,
                },
            )

        source_systems = [
            ("SAP Procurement Export", "SAP"),
            ("Utility Portal Export", "UTILITY_PORTAL"),
            ("Travel Platform Export", "TRAVEL_PLATFORM"),
        ]

        for name, source_type in source_systems:
            SourceSystem.objects.get_or_create(
                tenant=tenant,
                name=name,
                defaults={
                    "source_type": source_type,
                    "ingestion_method": "CSV_UPLOAD",
                    "config": {},
                    "is_active": True,
                },
            )

        self.stdout.write(
            self.style.SUCCESS("Demo data seeded successfully")
        )