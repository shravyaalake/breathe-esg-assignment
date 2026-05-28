from django.conf import settings
from django.db import models

from tenants.models import Tenant


class AuditLog(models.Model):
    ACTION_CHOICES = [
        ("RAW_RECORD_CREATED", "Raw Record Created"),
        ("NORMALIZED_ACTIVITY_CREATED", "Normalized Activity Created"),
        ("ROW_EDITED", "Row Edited"),
        ("ROW_APPROVED", "Row Approved"),
        ("ROW_REJECTED", "Row Rejected"),
        ("ROW_LOCKED", "Row Locked"),
    ]

    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name="audit_logs"
    )

    entity_type = models.CharField(max_length=100)
    entity_id = models.PositiveIntegerField()

    action = models.CharField(
        max_length=50,
        choices=ACTION_CHOICES
    )

    old_value = models.JSONField(
        null=True,
        blank=True
    )

    new_value = models.JSONField(
        null=True,
        blank=True
    )

    performed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.entity_type} - {self.action}"