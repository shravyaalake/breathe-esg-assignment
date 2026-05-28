# backend\review\views.py
from django.shortcuts import render

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from audit.models import AuditLog
from normalization.models import NormalizedActivity
from .serializers import (
    NormalizedActivitySerializer,
)


class ActivityListView(generics.ListAPIView):
    serializer_class = NormalizedActivitySerializer

    def get_queryset(self):
        activities = (
            NormalizedActivity.objects.all()
            .order_by("-id")
        )

        status = self.request.query_params.get("status")
        scope = self.request.query_params.get("scope")
        facility = self.request.query_params.get("facility")
        activity_type = self.request.query_params.get("activity_type")

        if status:
            activities = activities.filter(status=status)

        if scope:
            activities = activities.filter(scope_category=scope)

        if facility:
            activities = activities.filter(
                facility__name__icontains=facility
            )

        if activity_type:
            activities = activities.filter(
                activity_type__icontains=activity_type
            )

        return activities


class ApproveActivityView(APIView):

    def post(self, request, pk):
        activity = get_object_or_404(
            NormalizedActivity,
            pk=pk
        )

        old_status = activity.status
        activity.status = "Approved"
        activity.save(update_fields=["status"])

        AuditLog.objects.create(
            tenant=activity.tenant,
            entity_type="NormalizedActivity",
            entity_id=activity.id,
            action="ROW_APPROVED",
            old_value={"status": old_status},
            new_value={"status": activity.status},
            performed_by=request.user if request.user.is_authenticated else None,
        )

        return Response(
            {
                "message": "Activity approved",
                "id": activity.id,
                "status": activity.status,
            }
        )


class RejectActivityView(APIView):

    def post(self, request, pk):
        activity = get_object_or_404(
            NormalizedActivity,
            pk=pk
        )

        old_status = activity.status
        activity.status = "Rejected"
        activity.save(update_fields=["status"])

        AuditLog.objects.create(
            tenant=activity.tenant,
            entity_type="NormalizedActivity",
            entity_id=activity.id,
            action="ROW_REJECTED",
            old_value={"status": old_status},
            new_value={"status": activity.status},
            performed_by=request.user if request.user.is_authenticated else None,
)

        return Response(
            {
                "message": "Activity rejected",
                "id": activity.id,
                "status": activity.status,
            }
        )


class LockActivityView(APIView):

    def post(self, request, pk):
        activity = get_object_or_404(
            NormalizedActivity,
            pk=pk
        )

        old_status = activity.status

        activity.status = "Locked"
        activity.is_locked = True
        activity.save(update_fields=["status", "is_locked"])

        AuditLog.objects.create(
            tenant=activity.tenant,
            entity_type="NormalizedActivity",
            entity_id=activity.id,
            action="ROW_LOCKED",
            old_value={"status": old_status, "is_locked": False},
            new_value={"status": activity.status, "is_locked": True},
            performed_by=request.user if request.user.is_authenticated else None,
        )

        return Response(
            {
                "message": "Activity locked",
                "id": activity.id,
                "status": activity.status,
            }
        )