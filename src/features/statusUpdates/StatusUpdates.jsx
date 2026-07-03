import { useEffect, useState } from "react";
import { customerStatusApi, customersApi } from "../../api/mockApi";
import { toast } from "react-toastify";

function StatusUpdates() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [status, setStatus] = useState("Waiting");
  const [remarks, setRemarks] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const response = await customersApi.list();
        setCustomers(response.data);
      } catch (err) {
        toast.error(err.message || "Unable to load customers");
      }
    };

    loadCustomers();
  }, []);

  const handleCustomerChange = async (event) => {
    const customerId = event.target.value;
    setSelectedCustomerId(customerId);

    if (!customerId) {
      setHistory([]);
      return;
    }

    try {
      const response = await customerStatusApi.getHistory(customerId);
      setHistory(response.data);
    } catch (err) {
      toast.error(err.message || "Unable to load status history");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      await customerStatusApi.create(selectedCustomerId, {
        status,
        remarks,
        followUpDate,
      });
      toast.success("Status updated");
      const response = await customerStatusApi.getHistory(selectedCustomerId);
      setHistory(response.data);
      setRemarks("");
      setFollowUpDate("");
    } catch (err) {
      toast.error(err.message || "Status update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-card">
      <div className="section-header">
        <div>
          <p className="eyebrow">Status updates</p>
          <h1>Customer Status</h1>
        </div>
      </div>

      <div className="grid-layout">
        <div className="card-panel">
          <h3>Update status</h3>
          <form onSubmit={handleSubmit} className="form-grid">
            <select className="field" required value={selectedCustomerId} onChange={handleCustomerChange}>
              <option value="">Select customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
            <select className="field" value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="Waiting">Waiting</option>
              <option value="Checked-In">Checked-In</option>
              <option value="Assigned">Assigned</option>
              <option value="In Discussion">In Discussion</option>
              <option value="Completed">Completed</option>
              <option value="Not Interested">Not Interested</option>
              <option value="Follow-Up Required">Follow-Up Required</option>
            </select>
            <textarea className="field" placeholder="Remarks" value={remarks} onChange={(event) => setRemarks(event.target.value)} />
            {status === "Follow-Up Required" ? (
              <input className="field" type="date" value={followUpDate} onChange={(event) => setFollowUpDate(event.target.value)} />
            ) : null}
            <button className="primary-btn" type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update status"}
            </button>
          </form>
        </div>

        <div className="card-panel">
          <h3>Status history</h3>
          {history.length === 0 ? <p>Select a customer to view history.</p> : null}
          <div className="stack-list">
            {history.map((entry, index) => (
              <div key={`${entry.changedAt}-${index}`} className="detail-card">
                <strong>{entry.status}</strong>
                <p>{entry.remarks}</p>
                <p>{entry.changedAt}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatusUpdates;
