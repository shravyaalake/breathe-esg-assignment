from django.db import models
from tenants.models import Tenant

class SourceSystem(models.Model):

    SOURCE_TYPES = [
        ("SAP", "SAP"),
        ("UTILITY_PORTAL", "Utility Portal"),
        ("TRAVEL_PLATFORM", "Travel Platform"),
    ]

    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name="source_systems"
    )

    name = models.CharField(max_length=255)

    source_type = models.CharField(
        max_length=50,
        choices=SOURCE_TYPES
    )

    ingestion_method = models.CharField(
        max_length=100,
        default="CSV_UPLOAD"
    )

    config = models.JSONField(
        default=dict,
        blank=True
    )

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.source_type})"