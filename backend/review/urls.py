from django.urls import path

from .views import (
    ActivityListView,
    ApproveActivityView,
    RejectActivityView,
    LockActivityView,
)

urlpatterns = [
    path(
        "activities/",
        ActivityListView.as_view(),
        name="activity-list",
    ),

    path(
        "activities/<int:pk>/approve/",
        ApproveActivityView.as_view(),
        name="approve-activity",
    ),

    path(
        "activities/<int:pk>/reject/",
        RejectActivityView.as_view(),
        name="reject-activity",
    ),

    path(
        "activities/<int:pk>/lock/",
        LockActivityView.as_view(),
        name="lock-activity",
    ),
]