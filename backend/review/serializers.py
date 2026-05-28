from rest_framework import serializers
from normalization.models import NormalizedActivity


class NormalizedActivitySerializer(serializers.ModelSerializer):
    facility_name = serializers.CharField(
        source="facility.name",
        read_only=True
    )

    class Meta:
        model = NormalizedActivity
        fields = [
            "id",
            "activity_type",
            "scope_category",
            "facility_name",
            "quantity_normalized",
            "unit_normalized",
            "co2e",
            "status",
            "activity_date",
            "flags",
        ]


class ActivityStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = NormalizedActivity
        fields = [
            "status",
        ]