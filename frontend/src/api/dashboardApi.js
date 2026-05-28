import { apiClient } from "./apiClient";

export const getDashboardSummary = async () => {
  const response = await apiClient.get("/dashboard/summary/");
  return response.data;
};

export const getEmissionsByFacility = async () => {
  const response = await apiClient.get(
    "/dashboard/emissions-by-facility/"
  );
  return response.data;
};

export const getEmissionsByScope = async () => {
  const response = await apiClient.get(
    "/dashboard/emissions-by-scope/"
  );
  return response.data;
};

export const getMonthlyTrend = async () => {
  const response = await apiClient.get(
    "/dashboard/monthly-trend/"
  );
  return response.data;
};