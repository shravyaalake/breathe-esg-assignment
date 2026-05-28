import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";
import StatCard from "../components/StatCard";
import {
  getDashboardSummary,
  getEmissionsByFacility,
  getEmissionsByScope,
  getMonthlyTrend,
} from "../api/dashboardApi";

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [facilityData, setFacilityData] = useState([]);
  const [scopeData, setScopeData] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [summaryRes, facilityRes, scopeRes, trendRes] = await Promise.all([
        getDashboardSummary(),
        getEmissionsByFacility(),
        getEmissionsByScope(),
        getMonthlyTrend(),
      ]);

      setSummary(summaryRes);

      setFacilityData(
        facilityRes.map((item) => ({
          facility: item.facility_name || item.facility,
          co2e: Number(item.co2e),
        })),
      );

      setScopeData(
        scopeRes
          .map((item) => ({
            scope: item.scope_category,
            co2e: Number(item.co2e),
          }))
          .filter((item) => item.co2e > 0),
      );

      setMonthlyTrend(
        trendRes.map((item) => ({
          month: item.month,
          co2e: Number(item.co2e),
        })),
      );
    } catch (error) {
      console.error("Dashboard API error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <h2>Loading dashboard...</h2>;

  return (
    <div>
      <h1 style={{ marginBottom: "24px" }}>Dashboard</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <StatCard
          title="Total CO₂e"
          value={summary?.total_co2e}
          subtitle="kg CO₂e"
        />
        <StatCard
          title="Scope 1"
          value={summary?.scope_breakdown?.scope_1}
          subtitle="Direct emissions"
        />
        <StatCard
          title="Scope 2"
          value={summary?.scope_breakdown?.scope_2}
          subtitle="Electricity emissions"
        />
        <StatCard
          title="Scope 3"
          value={summary?.scope_breakdown?.scope_3}
          subtitle="Value chain emissions"
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          marginBottom: "24px",
        }}
      >
        <ChartCard title="Emissions by Facility">
          <ResponsiveContainer width="100%" height={340}>
            <BarChart
              data={facilityData}
              margin={{
                top: 10,
                right: 20,
                left: 10,
                bottom: 50,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="facility"
                interval={0}
                angle={-15}
                textAnchor="end"
                height={70}
              />

              <YAxis />
              <Tooltip />
              <Bar dataKey="co2e" fill="#0f766e" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Emissions by Scope">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={scopeData}
                dataKey="co2e"
                nameKey="scope"
                outerRadius={100}
                label
              >
                {scopeData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={["#0f766e", "#22c55e", "#84cc16"][index % 3]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Monthly Emissions Trend">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="co2e"
              stroke="#0f766e"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <h2 style={{ marginTop: 0, marginBottom: "16px" }}>{title}</h2>
      {children}
    </div>
  );
}

export default Dashboard;
