from django.contrib import admin
from .models import NormalizedActivity


@admin.register(NormalizedActivity)
class NormalizedActivityAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "activity_type",
        "scope_category",
        "facility",
        "quantity_normalized",
        "unit_normalized",
        "co2e",
        "status",
        "activity_date",
    )

    list_filter = (
        "scope_category",
        "activity_type",
        "status",
    )

    search_fields = (
        "activity_type",
    )