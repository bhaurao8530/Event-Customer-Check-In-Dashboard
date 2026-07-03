import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { dashboardSummaryApi } from "../../api/mockApi";

const COLORS = ["#4f46e5", "#0ea5e9", "#f59e0b", "#10b981"];

function Dashboard() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const loadSummary = async () => {
      const response = await dashboardSummaryApi();
      setSummary(response.data);
    };

    loadSummary();
  }, []);

  if (!summary) return <div className="page-card">Loading dashboard…</div>;

  return (
    <div className="page-card">
      <div className="section-header">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>Event Dashboard</h1>
        </div>
      </div>

      <div className="summary-grid">
        <div className="summary-card">
          <h3>Total Customers</h3>
          <p>{summary.totalCustomers}</p>
        </div>
        <div className="summary-card">
          <h3>Checked-In</h3>
          <p>{summary.checkedInCustomers}</p>
        </div>
        <div className="summary-card">
          <h3>Waiting</h3>
          <p>{summary.waitingCustomers}</p>
        </div>
        <div className="summary-card">
          <h3>Assigned</h3>
          <p>{summary.assignedCustomers}</p>
        </div>
        <div className="summary-card">
          <h3>Completed</h3>
          <p>{summary.completedCustomers}</p>
        </div>
      </div>

      <div className="card-panel">
        <h3>Status distribution</h3>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={summary.distribution} dataKey="value" nameKey="name" outerRadius={90} fill="#4f46e5">
              {summary.distribution.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard;