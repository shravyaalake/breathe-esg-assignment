from rest_framework import serializers


class FacilityEmissionSerializer(serializers.Serializer):
    facility_name = serializers.CharField()
    facility_code = serializers.CharField()
    co2e = serializers.DecimalField(max_digits=14, decimal_places=3)


class ScopeEmissionSerializer(serializers.Serializer):
    scope_category = serializers.CharField()
    co2e = serializers.DecimalField(max_digits=14, decimal_places=3)


class MonthlyTrendSerializer(serializers.Serializer):
    month = serializers.CharField()
    co2e = serializers.DecimalField(max_digits=14, decimal_places=3)

class ScopeBreakdownSerializer(serializers.Serializer):
    scope_1 = serializers.DecimalField(
        max_digits=14,
        decimal_places=3
    )
    scope_2 = serializers.DecimalField(
        max_digits=14,
        decimal_places=3
    )
    scope_3 = serializers.DecimalField(
        max_digits=14,
        decimal_places=3
    )


class FacilityBreakdownSerializer(serializers.Serializer):
    facility = serializers.CharField()
    co2e = serializers.DecimalField(
        max_digits=14,
        decimal_places=3
    )


class DashboardSummarySerializer(serializers.Serializer):
    total_co2e = serializers.DecimalField(
        max_digits=14,
        decimal_places=3
    )

    scope_breakdown = ScopeBreakdownSerializer()

    facility_breakdown = FacilityBreakdownSerializer(
        many=True
    )