import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../features/auth/Login";
import Dashboard from "../features/dashboard/Dashboard";
import ProtectedRoute from "../components/common/ProtectedRoute";
import Layout from "../components/common/Layout";
import Customers from "../features/customers/Customers";
import QrScannerPage from "../features/qrScanner/QrScannerPage";
import BoothAssignment from "../features/boothAssignment/BoothAssignment";
import StatusUpdates from "../features/statusUpdates/StatusUpdates";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/qr-scanner" element={<QrScannerPage />} />
        <Route path="/booth-assignments" element={<BoothAssignment />} />
        <Route path="/status-updates" element={<StatusUpdates />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;