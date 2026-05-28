from django.shortcuts import render

import csv
import io

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from tenants.models import Tenant
from sources.models import SourceSystem
from .models import IngestionBatch, RawRecord
from .serializers import CSVUploadSerializer
from normalization.services import normalize_sap_record


class CSVUploadView(APIView):
    def post(self, request):
        serializer = CSVUploadSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        tenant_id = serializer.validated_data["tenant_id"]
        source_system_id = serializer.validated_data["source_system_id"]
        uploaded_file = serializer.validated_data["file"]

        try:
            tenant = Tenant.objects.get(id=tenant_id)
            source_system = SourceSystem.objects.get(id=source_system_id, tenant=tenant)
        except Tenant.DoesNotExist:
            return Response({"error": "Tenant not found"}, status=status.HTTP_404_NOT_FOUND)
        except SourceSystem.DoesNotExist:
            return Response({"error": "Source system not found for this tenant"}, status=status.HTTP_404_NOT_FOUND)

        batch = IngestionBatch.objects.create(
            tenant=tenant,
            source_system=source_system,
            uploaded_by=request.user if request.user.is_authenticated else None,
            file_name=uploaded_file.name,
            status="PROCESSING",
        )

        decoded_file = uploaded_file.read().decode("utf-8-sig")
        reader = csv.DictReader(io.StringIO(decoded_file))

        total = 0

        for index, row in enumerate(reader, start=1):
            raw_record = RawRecord.objects.create(
                tenant=tenant,
                ingestion_batch=batch,
                source_system=source_system,
                row_number=index,
                raw_payload=row,
                parse_status="PENDING",
            )
            if source_system.source_type == "SAP":
                normalize_sap_record(raw_record)
            total += 1

        batch.records_total = total
        batch.status = "COMPLETED"
        batch.save()

        return Response(
            {
                "message": "CSV uploaded successfully",
                "batch_id": batch.id,
                "records_total": batch.records_total,
            },
            status=status.HTTP_201_CREATED,
        )