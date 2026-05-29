import { useState } from "react";
import { uploadCsv } from "../api/ingestionApi";
import { useNavigate } from "react-router-dom";

function CsvUpload() {
  const [tenantId, setTenantId] = useState("1");
  const [sourceSystemId, setSourceSystemId] = useState("1");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!tenantId || !sourceSystemId || !file) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await uploadCsv({
        tenantId,
        sourceSystemId,
        file,
      });

      setMessage(
        response.message ||
          "CSV uploaded successfully. New activities are ready for review."
      );
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      setIsSuccess(false);
      setMessage(error.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: "24px" }}>CSV Upload</h1>

      <div style={cardStyle}>
        <div style={infoBoxStyle}>
          <strong>Demo upload instructions</strong>
          <p style={{ margin: "8px 0 0" }}>
            The deployed backend automatically seeds demo master data after every
            redeploy. Use Tenant ID <strong>1</strong> and Source System ID{" "}
            <strong>1</strong> for the sample SAP procurement CSV.
          </p>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Tenant ID</label>
          <input
            type="number"
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
            style={inputStyle}
          />
          <small>Use 1 for ABC Manufacturing Ltd.</small>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Source System ID</label>
          <input
            type="number"
            value={sourceSystemId}
            onChange={(e) => setSourceSystemId(e.target.value)}
            style={inputStyle}
          />
          <small>Use 1 for SAP Procurement Export.</small>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label>CSV File</label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
            style={inputStyle}
          />
        </div>

        <button onClick={handleUpload} disabled={loading} style={buttonStyle}>
          {loading ? "Uploading..." : "Upload CSV"}
        </button>

        {message && (
          <p
            style={{
              marginTop: "20px",
              fontWeight: "600",
              color: isSuccess ? "#166534" : "#dc2626",
            }}
          >
            {message}
          </p>
        )}

        {isSuccess && (
          <div style={{ marginTop: "20px" }}>
            <button onClick={() => navigate("/review")} style={reviewButtonStyle}>
              Go to Activity Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const cardStyle = {
  background: "white",
  padding: "32px",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
  maxWidth: "700px",
};

const infoBoxStyle = {
  background: "#ecfdf5",
  border: "1px solid #a7f3d0",
  padding: "14px",
  borderRadius: "10px",
  marginBottom: "24px",
  color: "#065f46",
};

const inputStyle = {
  width: "100%",
  marginTop: "8px",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
};

const buttonStyle = {
  background: "#0f766e",
  color: "white",
  border: "none",
  padding: "12px 24px",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "16px",
};

const reviewButtonStyle = {
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "10px 18px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

export default CsvUpload;