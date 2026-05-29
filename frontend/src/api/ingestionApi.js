import { apiClient } from "./apiClient";

export const uploadCsv = async ({
  tenantId,
  sourceSystemId,
  file,
}) => {
  const formData = new FormData();

  formData.append("tenant_id", tenantId);
  formData.append("source_system_id", sourceSystemId);
  formData.append("file", file);

  const response = await apiClient.post(
    "/upload/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};