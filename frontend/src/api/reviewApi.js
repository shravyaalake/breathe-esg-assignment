import { apiClient } from "./apiClient";

export const getActivities = async (filters = {}) => {
  const response = await apiClient.get("/review/activities/", {
    params: filters,
  });
  return response.data;
};

export const approveActivity = async (id) => {
  const response = await apiClient.post(`/review/activities/${id}/approve/`);
  return response.data;
};

export const rejectActivity = async (id) => {
  const response = await apiClient.post(`/review/activities/${id}/reject/`);
  return response.data;
};

export const lockActivity = async (id) => {
  const response = await apiClient.post(`/review/activities/${id}/lock/`);
  return response.data;
};