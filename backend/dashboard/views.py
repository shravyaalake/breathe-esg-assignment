from django.db.models import Sum
from django.db.models.functions import TruncMonth
from rest_framework.views import APIView
from rest_framework.response import Response

from normalization.models import NormalizedActivity
from .serializers import (
    FacilityEmissionSerializer,
    ScopeEmissionSerializer,
    MonthlyTrendSerializer,
    DashboardSummarySerializer,
)

class DashboardSummaryView(APIView):

    def get(self, request):
        activities = NormalizedActivity.objects.all()

        total_co2e = activities.aggregate(total=Sum("co2e"))["total"] or 0

        scope_1 = activities.filter(scope_category="SCOPE_1").aggregate(total=Sum("co2e"))["total"] or 0
        scope_2 = activities.filter(scope_category="SCOPE_2").aggregate(total=Sum("co2e"))["total"] or 0
        scope_3 = activities.filter(scope_category="SCOPE_3").aggregate(total=Sum("co2e"))["total"] or 0

        facilities = activities.values("facility__name").annotate(total_co2e=Sum("co2e"))

        facility_data = [
            {
                "facility": item["facility__name"] or "Unknown Facility",
                "co2e": item["total_co2e"] or 0,
            }
            for item in facilities
        ]

        data = {
            "total_co2e": total_co2e,
            "scope_breakdown": {
                "scope_1": scope_1,
                "scope_2": scope_2,
                "scope_3": scope_3,
            },
            "facility_breakdown": facility_data,
        }

        serializer = DashboardSummarySerializer(data)

        return Response(serializer.data)


class EmissionsByFacilityView(APIView):

    def get(self, request):
        data = (
            NormalizedActivity.objects
            .values("facility__name", "facility__code")
            .annotate(total_co2e=Sum("co2e"))
            .order_by("facility__name")
        )

        result = [
            {
                "facility_name": item["facility__name"] or "Unknown Facility",
                "facility_code": item["facility__code"] or "UNKNOWN",
                "co2e": item["total_co2e"] or 0,
            }
            for item in data
        ]

        serializer = FacilityEmissionSerializer(result, many=True)
        return Response(serializer.data)


class EmissionsByScopeView(APIView):

    def get(self, request):
        data = (
            NormalizedActivity.objects
            .values("scope_category")
            .annotate(total_co2e=Sum("co2e"))
            .order_by("scope_category")
        )

        result = [
            {
                "scope_category": item["scope_category"],
                "co2e": item["total_co2e"] or 0,
            }
            for item in data
        ]

        serializer = ScopeEmissionSerializer(result, many=True)
        return Response(serializer.data)


class MonthlyTrendView(APIView):

    def get(self, request):
        data = (
            NormalizedActivity.objects
            .exclude(activity_date__isnull=True)
            .annotate(month=TruncMonth("activity_date"))
            .values("month")
            .annotate(total_co2e=Sum("co2e"))
            .order_by("month")
        )

        result = [
            {
                "month": item["month"].strftime("%Y-%m"),
                "co2e": item["total_co2e"] or 0,
            }
            for item in data
        ]

        serializer = MonthlyTrendSerializer(result, many=True)
        return Response(serializer.data)