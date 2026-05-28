from django.conf import settings
from django.db import models

from tenants.models import Tenant
from sources.models import SourceSystem


class IngestionBatch(models.Model):
    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("PROCESSING", "Processing"),
        ("COMPLETED", "Completed"),
        ("FAILED", "Failed"),
    ]

    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="ingestion_batches")
    source_system = models.ForeignKey(SourceSystem, on_delete=models.CASCADE, related_name="ingestion_batches")

    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="uploaded_batches"
    )

    file_name = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="PENDING")

    records_total = models.PositiveIntegerField(default=0)
    records_success = models.PositiveIntegerField(default=0)
    records_failed = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.file_name} - {self.status}"


class RawRecord(models.Model):
    PARSE_STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("PARSED", "Parsed"),
        ("FAILED", "Failed"),
    ]

    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="raw_records")
    ingestion_batch = models.ForeignKey(IngestionBatch, on_delete=models.CASCADE, related_name="raw_records")
    source_system = models.ForeignKey(SourceSystem, on_delete=models.CASCADE, related_name="raw_records")

    row_number = models.PositiveIntegerField()
    raw_payload = models.JSONField()
    parse_status = models.CharField(max_length=20, choices=PARSE_STATUS_CHOICES, default="PENDING")
    parse_error = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("ingestion_batch", "row_number")

    def __str__(self):
        return f"Batch {self.ingestion_batch_id} Row {self.row_number}"