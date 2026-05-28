import { useEffect, useState } from "react";
import {
  getActivities,
  approveActivity,
  rejectActivity,
  lockActivity,
} from "../api/reviewApi";

function ActivityReview() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    status: "",
    scope: "",
    facility: "",
    activity_type: "",
  });

  useEffect(() => {
    loadActivities();
  }, []);

  const [message, setMessage] = useState("");

  const loadActivities = async () => {
    try {
      setLoading(true);

      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== ""),
      );

      const data = await getActivities(activeFilters);
      setActivities(data);
    } catch (error) {
      console.error("Activity API error:", error);
      alert("Failed to load activities");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAction = async (activity, action) => {
    const actionMessages = {
      approve: `Approve activity "${activity.activity_type}" for ${activity.facility_name}?`,
      reject: `Reject activity "${activity.activity_type}" for ${activity.facility_name}?`,
      lock: `Lock activity "${activity.activity_type}" for ${activity.facility_name}?`,
    };

    const confirmed = window.confirm(actionMessages[action]);

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");

      if (action === "approve") {
        await approveActivity(activity.id);
        setMessage("Activity approved successfully");
      }

      if (action === "reject") {
        await rejectActivity(activity.id);
        setMessage("Activity rejected successfully");
      }

      if (action === "lock") {
        await lockActivity(activity.id);
        setMessage("Activity locked successfully");
      }

      await loadActivities();

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error("Review action error:", error);
      setMessage("Action failed. Please try again.");
    }
  };

  const resetFilters = async () => {
    const emptyFilters = {
      status: "",
      scope: "",
      facility: "",
      activity_type: "",
    };

    setFilters(emptyFilters);

    try {
      setLoading(true);
      const data = await getActivities({});
      setActivities(data);
    } catch (error) {
      console.error("Reset filter error:", error);
      alert("Failed to reset filters");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: "24px" }}>Activity Review</h1>

      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          marginBottom: "24px",
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "12px",
        }}
      >
        <select
          style={filterInputStyle}
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Locked">Locked</option>
        </select>

        <select
          style={filterInputStyle}
          name="scope"
          value={filters.scope}
          onChange={handleFilterChange}
        >
          <option value="">All Scopes</option>
          <option value="SCOPE_1">Scope 1</option>
          <option value="SCOPE_2">Scope 2</option>
          <option value="SCOPE_3">Scope 3</option>
        </select>

        <input
          style={filterInputStyle}
          name="facility"
          value={filters.facility}
          onChange={handleFilterChange}
          placeholder="Facility"
        />

        <input
          style={filterInputStyle}
          name="activity_type"
          value={filters.activity_type}
          onChange={handleFilterChange}
          placeholder="Activity type"
        />

        <button style={filterButtonStyle} onClick={loadActivities}>
          Apply Filters
        </button>
        <button style={resetButtonStyle} onClick={resetFilters}>
          Reset
        </button>
      </div>

      <div
        style={{
          background: "white",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          overflow: "hidden",
        }}
      >
        {message && (
          <div
            style={{
              background: "#ecfdf5",
              color: "#166534",
              padding: "12px 16px",
              borderRadius: "10px",
              marginBottom: "20px",
              border: "1px solid #bbf7d0",
              fontWeight: "600",
            }}
          >
            {message}
          </div>
        )}
        {loading ? (
          <p style={{ padding: "20px" }}>Loading activities...</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#f3f4f6" }}>
              <tr>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Facility</th>
                <th style={thStyle}>Activity</th>
                <th style={thStyle}>Scope</th>
                <th style={thStyle}>Quantity</th>
                <th style={thStyle}>CO₂e</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {activities.map((activity) => {
                const status = activity.status?.toUpperCase();
                return (
                  <tr
                    key={activity.id}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#f9fafb";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "white";
                    }}
                  >
                    <td style={tdStyle}>{activity.id}</td>
                    <td style={tdStyle}>{activity.activity_date}</td>
                    <td style={tdStyle}>{activity.facility_name}</td>
                    <td style={tdStyle}>{activity.activity_type}</td>
                    <td style={tdStyle}>{activity.scope_category}</td>
                    <td style={tdStyle}>
                      {activity.quantity_normalized} {activity.unit_normalized}
                    </td>
                    <td style={tdStyle}>{activity.co2e}</td>
                    <td style={tdStyle}>
                      <StatusBadge status={activity.status} />
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        {status !== "APPROVED" && status !== "LOCKED" && (
                          <button
                            style={approveBtnStyle}
                            onClick={() => handleAction(activity, "approve")}
                          >
                            Approve
                          </button>
                        )}

                        {status !== "REJECTED" && status !== "LOCKED" && (
                          <button
                            style={rejectBtnStyle}
                            onClick={() => handleAction(activity, "reject")}
                          >
                            Reject
                          </button>
                        )}

                        {status !== "LOCKED" && (
                          <button
                            style={lockBtnStyle}
                            onClick={() => handleAction(activity, "lock")}
                          >
                            Lock
                          </button>
                        )}

                        {status === "LOCKED" && (
                          <span style={{ color: "#6b7280", fontWeight: "600" }}>
                            Locked
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {activities.length === 0 && (
                <tr>
                  <td style={tdStyle} colSpan="9">
                    No activities match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    PENDING: { background: "#fef3c7", color: "#92400e" },
    APPROVED: { background: "#dcfce7", color: "#166534" },
    REJECTED: { background: "#fee2e2", color: "#991b1b" },
    LOCKED: { background: "#e0e7ff", color: "#3730a3" },
  };

  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: "600",
        ...(styles[status] || {}),
      }}
    >
      {status}
    </span>
  );
}

const thStyle = {
  textAlign: "left",
  padding: "12px",
  fontSize: "14px",
  color: "#374151",
  borderBottom: "1px solid #e5e7eb",
};

const tdStyle = {
  padding: "12px",
  fontSize: "14px",
  borderBottom: "1px solid #e5e7eb",
};

const approveBtnStyle = {
  background: "#16a34a",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "6px 12px",
  cursor: "pointer",
};

const rejectBtnStyle = {
  background: "#dc2626",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "6px 12px",
  cursor: "pointer",
};

const lockBtnStyle = {
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "6px 12px",
  cursor: "pointer",
};

const filterInputStyle = {
  padding: "8px 10px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
};

const filterButtonStyle = {
  background: "#0f766e",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "8px 12px",
  cursor: "pointer",
  fontWeight: "600",
};

const resetButtonStyle = {
  background: "#f3f4f6",
  color: "#111827",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  padding: "8px 12px",
  cursor: "pointer",
  fontWeight: "600",
};
export default ActivityReview;
