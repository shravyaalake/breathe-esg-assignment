import { useState } from "react";
import { uploadCsv } from "../api/ingestionApi";
import { useNavigate } from "react-router-dom";

function CsvUpload() {
  const [tenantId, setTenantId] = useState("");
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [sourceSystemId, setSourceSystemId] =
    useState("");

  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

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
      setTenantId("");
      setSourceSystemId("");
      setFile(null);
    } catch (error) {
      console.error(error);
        setIsSuccess(false);
      setMessage(
        error.response?.data?.message ||
          "Upload failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: "24px" }}>
        CSV Upload
      </h1>

      <div
        style={{
          background: "white",
          padding: "32px",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          maxWidth: "700px",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <label>Tenant ID</label>

          <input
            type="number"
            value={tenantId}
            onChange={(e) =>
              setTenantId(e.target.value)
            }
            placeholder="Enter tenant ID"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Source System ID</label>

          <input
            type="number"
            value={sourceSystemId}
            onChange={(e) =>
              setSourceSystemId(
                e.target.value
              )
            }
            placeholder="Enter source system ID"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label>CSV File</label>

          <input
            type="file"
            accept=".csv"
            onChange={(e) =>
              setFile(e.target.files[0])
            }
            style={inputStyle}
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={loading}
          style={{
            background: "#0f766e",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          {loading
            ? "Uploading..."
            : "Upload CSV"}
        </button>

        {message && (
          <p
            style={{
              marginTop: "20px",
              fontWeight: "600",
              color: "#166534",
            }}
          >
            {message}
          </p>
        )}

        {isSuccess && (
  <div style={{ marginTop: "20px" }}>
    <button
      onClick={() => navigate("/review")}
      style={{
        background: "#2563eb",
        color: "white",
        border: "none",
        padding: "10px 18px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
      }}
    >
      Go to Activity Review
    </button>
  </div>
)}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  marginTop: "8px",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
};

export default CsvUpload;