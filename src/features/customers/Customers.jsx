import { useEffect, useMemo, useState } from "react";
import { customersApi } from "../../api/mockApi";
import { toast } from "react-toastify";
import FormField from "../../components/common/FormField";
import { getCustomerErrors } from "../../utils/validation";

const initialForm = {
  name: "",
  mobile: "",
  email: "",
  projectName: "",
  eventStatus: "Waiting",
  assignedBooth: "",
  remarks: "",
};

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const response = await customersApi.list();
      setCustomers(response.data);
      setError("");
    } catch (err) {
      setError(err.message || "Unable to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSearch = `${customer.name} ${customer.mobile}`.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || customer.eventStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [customers, searchTerm, statusFilter]);

  const handleOpenCreate = () => {
    setEditingCustomerId(null);
    setForm(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (customer) => {
    setEditingCustomerId(customer.id);
    setForm({
      name: customer.name,
      mobile: customer.mobile,
      email: customer.email,
      projectName: customer.projectName,
      eventStatus: customer.eventStatus,
      assignedBooth: customer.assignedBooth || "",
      remarks: customer.remarks || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = getCustomerErrors(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please fix the highlighted form fields");
      return;
    }

    try {
      if (editingCustomerId) {
        await customersApi.update(editingCustomerId, form);
        toast.success("Customer updated");
      } else {
        await customersApi.create(form);
        toast.success("Customer created");
      }

      setIsModalOpen(false);
      loadCustomers();
    } catch (err) {
      toast.error(err.message || "Save failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer?")) return;

    try {
      await customersApi.remove(id);
      toast.success("Customer removed");
      loadCustomers();
    } catch (err) {
      toast.error(err.message || "Delete failed");
    }
  };

  return (
    <div className="page-card">
      <div className="section-header">
        <div>
          <p className="eyebrow">Customer management</p>
          <h1>Customers</h1>
        </div>
        <button className="primary-btn" onClick={handleOpenCreate}>
          Add customer
        </button>
      </div>

      <div className="toolbar">
        <input
          className="field"
          placeholder="Search by name or mobile"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <select className="field" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          <option value="All">All statuses</option>
          <option value="Waiting">Waiting</option>
          <option value="Checked-In">Checked-In</option>
          <option value="Assigned">Assigned</option>
          <option value="In Discussion">In Discussion</option>
          <option value="Completed">Completed</option>
          <option value="Not Interested">Not Interested</option>
          <option value="Follow-Up Required">Follow-Up Required</option>
        </select>
      </div>

      {loading ? <p>Loading customers…</p> : null}
      {error ? <p className="error-text">{error}</p> : null}

      {!loading && !error ? (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Project</th>
                <th>QR</th>
                <th>Status</th>
                <th>Booth</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.name}</td>
                  <td>{customer.mobile}</td>
                  <td>{customer.email}</td>
                  <td>{customer.projectName}</td>
                  <td>{customer.qrCode}</td>
                  <td>{customer.eventStatus}</td>
                  <td>{customer.assignedBooth || "—"}</td>
                  <td>
                    <div className="action-group">
                      <button className="link-btn" onClick={() => setSelectedCustomer(customer)}>
                        View
                      </button>
                      <button className="link-btn" onClick={() => handleOpenEdit(customer)}>
                        Edit
                      </button>
                      <button className="link-btn danger" onClick={() => handleDelete(customer.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {isModalOpen ? (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <h3>{editingCustomerId ? "Edit customer" : "Create customer"}</h3>
            <form onSubmit={handleSubmit} className="form-grid">
              <FormField label="Customer name" placeholder="Customer name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} error={errors.name} />
              <FormField label="Mobile number" placeholder="Mobile number" value={form.mobile} onChange={(event) => setForm({ ...form, mobile: event.target.value })} error={errors.mobile} />
              <FormField label="Email" type="email" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} error={errors.email} />
              <FormField label="Project name" placeholder="Project name" value={form.projectName} onChange={(event) => setForm({ ...form, projectName: event.target.value })} error={errors.projectName} />
              <FormField label="Status" as="select" value={form.eventStatus} onChange={(event) => setForm({ ...form, eventStatus: event.target.value })} options={[{ value: "Waiting", label: "Waiting" }, { value: "Checked-In", label: "Checked-In" }, { value: "Assigned", label: "Assigned" }, { value: "In Discussion", label: "In Discussion" }, { value: "Completed", label: "Completed" }, { value: "Not Interested", label: "Not Interested" }, { value: "Follow-Up Required", label: "Follow-Up Required" }]} />
              <FormField label="Assigned booth" placeholder="Assigned booth" value={form.assignedBooth} onChange={(event) => setForm({ ...form, assignedBooth: event.target.value })} />
              <FormField label="Remarks" as="textarea" placeholder="Remarks" value={form.remarks} onChange={(event) => setForm({ ...form, remarks: event.target.value })} />
              <div className="modal-actions">
                <button type="button" className="secondary-btn" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {selectedCustomer ? (
        <div className="modal-backdrop" onClick={() => setSelectedCustomer(null)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <h3>{selectedCustomer.name}</h3>
            <p><strong>Mobile:</strong> {selectedCustomer.mobile}</p>
            <p><strong>Email:</strong> {selectedCustomer.email}</p>
            <p><strong>Project:</strong> {selectedCustomer.projectName}</p>
            <p><strong>Status:</strong> {selectedCustomer.eventStatus}</p>
            <p><strong>Booth:</strong> {selectedCustomer.assignedBooth || "—"}</p>
            <p><strong>Remarks:</strong> {selectedCustomer.remarks || "—"}</p>
            <div className="modal-actions">
              <button className="secondary-btn" onClick={() => setSelectedCustomer(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Customers;
