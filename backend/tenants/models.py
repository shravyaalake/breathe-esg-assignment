from django.db import models


class Tenant(models.Model):
    name = models.CharField(max_length=255)
    industry = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Facility(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="facilities")
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50)
    country = models.CharField(max_length=100)
    region = models.CharField(max_length=100, blank=True)

    class Meta:
        unique_together = ("tenant", "code")

    def __str__(self):
        return f"{self.name} ({self.code})"