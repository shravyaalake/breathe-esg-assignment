from django.urls import path

from .views import (
    DashboardSummaryView,
    EmissionsByFacilityView,
    EmissionsByScopeView,
    MonthlyTrendView,
)

urlpatterns = [
    path("summary/", DashboardSummaryView.as_view(), name="dashboard-summary"),
    path("emissions-by-facility/", EmissionsByFacilityView.as_view(), name="emissions-by-facility"),
    path("emissions-by-scope/", EmissionsByScopeView.as_view(), name="emissions-by-scope"),
    path("monthly-trend/", MonthlyTrendView.as_view(), name="monthly-trend"),
]