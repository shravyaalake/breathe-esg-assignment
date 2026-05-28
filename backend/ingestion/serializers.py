from rest_framework import serializers


class CSVUploadSerializer(serializers.Serializer):
    tenant_id = serializers.IntegerField()
    source_system_id = serializers.IntegerField()
    file = serializers.FileField()