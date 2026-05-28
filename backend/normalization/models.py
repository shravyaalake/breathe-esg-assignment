
from django.conf import settings
from django.db import models

from tenants.models import Tenant, Facility
from sources.models import SourceSystem
from ingestion.models import IngestionBatch, RawRecord


class NormalizedActivity(models.Model):
    SCOPE_CHOICES = [
        ("SCOPE_1", "Scope 1"),
        ("SCOPE_2", "Scope 2"),
        ("SCOPE_3", "Scope 3"),
    ]

    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("APPROVED", "Approved"),
        ("REJECTED", "Rejected"),
        ("LOCKED", "Locked"),
    ]

    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="normalized_activities")
    raw_record = models.OneToOneField(RawRecord, on_delete=models.CASCADE, related_name="normalized_activity")
    ingestion_batch = models.ForeignKey(IngestionBatch, on_delete=models.CASCADE, related_name="normalized_activities")
    source_system = models.ForeignKey(SourceSystem, on_delete=models.CASCADE, related_name="normalized_activities")

    facility = models.ForeignKey(Facility, on_delete=models.SET_NULL, null=True, blank=True)

    activity_type = models.CharField(max_length=100)
    scope_category = models.CharField(max_length=20, choices=SCOPE_CHOICES)

    activity_date = models.DateField(null=True, blank=True)
    period_start = models.DateField(null=True, blank=True)
    period_end = models.DateField(null=True, blank=True)

    quantity_original = models.DecimalField(max_digits=14, decimal_places=3, null=True, blank=True)
    unit_original = models.CharField(max_length=50, blank=True)

    quantity_normalized = models.DecimalField(max_digits=14, decimal_places=3, null=True, blank=True)
    unit_normalized = models.CharField(max_length=50, blank=True)

    emission_factor = models.DecimalField(max_digits=12, decimal_places=6, null=True, blank=True)
    co2e = models.DecimalField(max_digits=14, decimal_places=3, null=True, blank=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="PENDING")
    flags = models.JSONField(default=list, blank=True)

    is_locked = models.BooleanField(default=False)

    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    approved_at = models.DateTimeField(null=True, blank=True)
    locked_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.activity_type} - {self.scope_category} - {self.status}"