import { useEffect, useMemo, useState } from "react";
import { boothAssignmentsApi, customersApi } from "../../api/mockApi";
import { toast } from "react-toastify";

const initialForm = {
  customerId: "",
  boothNumber: "",
  salesManagerName: "",
  status: "Assigned",
};

const boothOptions = ["A-01", "A-02", "A-03", "A-04", "B-10", "B-11", "B-12"];

function BoothAssignment() {
  const [assignments, setAssignments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [editingAssignmentId, setEditingAssignmentId] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [assignmentsResponse, customersResponse] = await Promise.all([
        boothAssignmentsApi.list(),
        customersApi.list(),
      ]);
      setAssignments(assignmentsResponse.data);
      setCustomers(customersResponse.data);
    } catch (err) {
      toast.error(err.message || "Unable to load booth data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const checkedInCustomers = useMemo(() => {
    return customers.filter((customer) => customer.eventStatus === "Checked-In");
  }, [customers]);

  const availableBooths = useMemo(() => {
    return boothOptions.filter((booth) => !assignments.some((assignment) => assignment.boothNumber === booth && assignment.status !== "Cancelled" && assignment.id !== editingAssignmentId));
  }, [assignments, editingAssignmentId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const boothTaken = assignments.some((assignment) => assignment.boothNumber === form.boothNumber && assignment.status !== "Cancelled" && assignment.id !== editingAssignmentId);

    if (boothTaken) {
      toast.error("That booth is already active for another customer");
      return;
    }

    try {
      const payload = {
        customerId: Number(form.customerId),
        customerName: customers.find((customer) => customer.id === Number(form.customerId))?.name || "",
        boothNumber: form.boothNumber,
        salesManagerName: form.salesManagerName,
        status: form.status,
      };

      if (editingAssignmentId) {
        await boothAssignmentsApi.update(editingAssignmentId, payload);
        toast.success("Assignment updated");
      } else {
        await boothAssignmentsApi.create(payload);
        toast.success("Booth assigned");
      }

      setForm(initialForm);
      setEditingAssignmentId(null);
      loadData();
    } catch (err) {
      toast.error(err.message || "Assignment failed");
    }
  };

  const handleEditAssignment = (assignment) => {
    setEditingAssignmentId(assignment.id);
    setForm({
      customerId: String(assignment.customerId),
      boothNumber: assignment.boothNumber,
      salesManagerName: assignment.salesManagerName,
      status: assignment.status,
    });
  };

  const handleCancelAssignment = async (id) => {
    try {
      await boothAssignmentsApi.update(id, { status: "Cancelled" });
      toast.success("Assignment cancelled");
      loadData();
    } catch (err) {
      toast.error(err.message || "Cancel failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await boothAssignmentsApi.remove(id);
      toast.success("Assignment removed");
      loadData();
    } catch (err) {
      toast.error(err.message || "Delete failed");
    }
  };

  return (
    <div className="page-card">
      <div className="section-header">
        <div>
          <p className="eyebrow">Booth allocation</p>
          <h1>Booth Assignments</h1>
        </div>
      </div>

      <div className="grid-layout">
        <div className="card-panel">
          <h3>Assign a booth</h3>
          <form onSubmit={handleSubmit} className="form-grid">
            <select className="field" required value={form.customerId} onChange={(event) => setForm({ ...form, customerId: event.target.value })}>
              <option value="">Select customer</option>
              {checkedInCustomers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
            <select className="field" required value={form.boothNumber} onChange={(event) => setForm({ ...form, boothNumber: event.target.value })}>
              <option value="">Select booth</option>
              {availableBooths.map((booth) => (
                <option key={booth} value={booth}>
                  {booth}
                </option>
              ))}
            </select>
            <input className="field" required placeholder="Sales manager name" value={form.salesManagerName} onChange={(event) => setForm({ ...form, salesManagerName: event.target.value })} />
            <select className="field" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
              <option value="Waiting">Waiting</option>
              <option value="Assigned">Assigned</option>
              <option value="In Discussion">In Discussion</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <div className="toolbar">
              <button className="primary-btn" type="submit">
                {editingAssignmentId ? "Update assignment" : "Save assignment"}
              </button>
              {editingAssignmentId ? (
                <button className="secondary-btn" type="button" onClick={() => { setForm(initialForm); setEditingAssignmentId(null); }}>
                  Reset
                </button>
              ) : null}
            </div>
            <p><strong>Available booths:</strong> {availableBooths.join(", ") || "No open booths"}</p>
          </form>
        </div>

        <div className="card-panel">
          <h3>Active assignments</h3>
          {loading ? <p>Loading…</p> : null}
          {!loading && assignments.length === 0 ? <p>No booth assignments yet.</p> : null}
          <div className="stack-list">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="detail-card">
                <div>
                  <strong>{assignment.customerName}</strong>
                  <p>Booth {assignment.boothNumber}</p>
                  <p>{assignment.salesManagerName}</p>
                  <p>Status: {assignment.status}</p>
                </div>
                <div className="action-group">
                  <button className="link-btn" onClick={() => handleEditAssignment(assignment)}>
                    Edit
                  </button>
                  <button className="link-btn" onClick={() => handleCancelAssignment(assignment.id)}>
                    Cancel
                  </button>
                  <button className="link-btn danger" onClick={() => handleDelete(assignment.id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BoothAssignment;
