import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import ActivityReview from "./pages/ActivityReview";
import CsvUpload from "./pages/CsvUpload";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/review" element={<ActivityReview />} />
          <Route path="/upload" element={<CsvUpload />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;