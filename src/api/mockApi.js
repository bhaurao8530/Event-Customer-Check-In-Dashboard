const STORAGE_KEY = "event-checkin-dashboard-data";

const seedCustomers = [
  {
    id: 1,
    name: "Aarav Singh",
    mobile: "9876543210",
    email: "aarav@example.com",
    projectName: "Summit Expo",
    qrCode: "EQ-1001",
    eventStatus: "Assigned",
    assignedBooth: "B-12",
    qrUsed: false,
    remarks: "VIP guest",
    history: [
      { status: "Assigned", remarks: "Registered", changedAt: "2026-06-20" },
      { status: "Assigned", remarks: "Scanned at entrance", changedAt: "2026-06-21" },
    ],
  },
  {
    id: 2,
    name: "Mia Chen",
    mobile: "9123456780",
    email: "mia@example.com",
    projectName: "Launch Day",
    qrCode: "EQ-1002",
    eventStatus: "Waiting",
    assignedBooth: "A-04",
    qrUsed: true,
    remarks: "Needs follow-up",
    history: [
      { status: "Waiting", remarks: "Initial registration", changedAt: "2026-06-18" },
      { status: "Waiting", remarks: "Checked in at desk", changedAt: "2026-06-19" },
    ],
  },
  {
    id: 3,
    name: "Daniel Brooks",
    mobile: "9012345678",
    email: "daniel@example.com",
    projectName: "Northstar Demo",
    qrCode: "EQ-1003",
    eventStatus: "In Discussion",
    assignedBooth: "",
    qrUsed: false,
    remarks: "Walk-in",
    history: [
      { status: "In Discussion", remarks: "Registered", changedAt: "2026-06-20" },
      { status: "In Discussion", remarks: "Verified at entrance", changedAt: "2026-06-21" },
    ],
  },
  {
    id: 4,
    name: "Sarah Johnson",
    mobile: "9234567890",
    email: "sarah@example.com",
    projectName: "Tech Summit",
    qrCode: "EQ-1004",
    eventStatus: "Completed",
    assignedBooth: "",
    qrUsed: false,
    remarks: "Priority attendee",
    history: [
      { status: "Completed", remarks: "Pre-registered", changedAt: "2026-06-19" },
      { status: "Completed", remarks: "Scanned QR code", changedAt: "2026-06-21" },
    ],
  },
  {
    id: 5,
    name: "Rajesh Patel",
    mobile: "9345678901",
    email: "rajesh@example.com",
    projectName: "Innovation Fair",
    qrCode: "EQ-1005",
    eventStatus: "Not Interested",
    assignedBooth: "",
    qrUsed: false,
    remarks: "Sponsor representative",
    history: [
      { status: "Not Interested", remarks: "Registered", changedAt: "2026-06-20" },
      { status: "Not Interested", remarks: "Checked in successfully", changedAt: "2026-06-21" },
    ],
  },
];

const seedAssignments = [
  {
    id: 1,
    customerId: 2,
    customerName: "Mia Chen",
    boothNumber: "A-04",
    salesManagerName: "Nina Patel",
    status: "Assigned",
  },
];

const storageState = () => {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    const initialState = {
      customers: seedCustomers,
      boothAssignments: seedAssignments,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState));
    return initialState;
  }

  return JSON.parse(raw);
};

const persistState = (nextState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
};

const wait = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

const createQrCode = () => `EQ-${Math.floor(1000 + Math.random() * 9000)}`;

export const loginApi = async (credentials) => {
  await wait();

  if (credentials.email === "admin@example.com" && credentials.password === "123456") {
    return {
      data: {
        token: "demo-token",
        user: { name: "Admin User", email: credentials.email },
      },
    };
  }

  throw new Error("Invalid email or password");
};

export const dashboardSummaryApi = async () => {
  await wait();
  const { customers } = storageState();

  const checkedIn = customers.filter((c) => c.eventStatus === "Checked-In").length;
  const waiting = customers.filter((c) => c.eventStatus === "Waiting").length;
  const assigned = customers.filter((c) => c.eventStatus === "Assigned").length;
  const completed = customers.filter((c) => c.eventStatus === "Completed").length;

  return {
    data: {
      totalCustomers: customers.length,
      checkedInCustomers: checkedIn,
      waitingCustomers: waiting,
      assignedCustomers: assigned,
      completedCustomers: completed,
      distribution: [
        { name: "Waiting", value: waiting },
        { name: "Checked-In", value: checkedIn },
        { name: "Assigned", value: assigned },
        { name: "Completed", value: completed },
      ],
    },
  };
};

export const customersApi = {
  list: async () => {
    await wait();
    return { data: storageState().customers };
  },
  get: async (id) => {
    await wait();
    const customer = storageState().customers.find((item) => item.id === Number(id));
    if (!customer) throw new Error("Customer not found");
    return { data: customer };
  },
  create: async (payload) => {
    await wait();
    const state = storageState();
    const customer = {
      ...payload,
      id: Date.now(),
      qrCode: payload.qrCode || createQrCode(),
      qrUsed: false,
      eventStatus: payload.eventStatus || "Waiting",
      assignedBooth: payload.assignedBooth || "",
      history: payload.history || [{ status: payload.eventStatus || "Waiting", remarks: payload.remarks || "Registered", changedAt: new Date().toISOString().slice(0, 10) }],
    };
    state.customers.unshift(customer);
    persistState(state);
    return { data: customer };
  },
  update: async (id, payload) => {
    await wait();
    const state = storageState();
    const index = state.customers.findIndex((item) => item.id === Number(id));
    if (index === -1) throw new Error("Customer not found");
    const existing = state.customers[index];
    const updated = {
      ...existing,
      ...payload,
      id: Number(id),
      history: payload.history || existing.history,
    };
    state.customers[index] = updated;
    persistState(state);
    return { data: updated };
  },
  remove: async (id) => {
    await wait();
    const state = storageState();
    state.customers = state.customers.filter((item) => item.id !== Number(id));
    state.boothAssignments = state.boothAssignments.filter((item) => item.customerId !== Number(id));
    persistState(state);
    return { data: { success: true } };
  },
};

export const qrVerificationApi = async (qrCode) => {
  await wait();
  const { customers } = storageState();
  const customer = customers.find((item) => item.qrCode === qrCode);

  if (!customer) {
    throw new Error("Invalid QR code");
  }

  if (customer.qrUsed) {
    throw new Error("This QR code has already been used");
  }

  return { data: { customer } };
};

export const checkInApi = async (customerId) => {
  await wait();
  const state = storageState();
  const index = state.customers.findIndex((item) => item.id === Number(customerId));
  if (index === -1) throw new Error("Customer not found");

  const customer = state.customers[index];
  customer.eventStatus = "Checked-In";
  customer.qrUsed = true;
  customer.history = [
    ...customer.history,
    { status: "Checked-In", remarks: "Checked in successfully", changedAt: new Date().toISOString().slice(0, 10) },
  ];
  state.customers[index] = customer;
  persistState(state);
  return { data: customer };
};

export const boothAssignmentsApi = {
  list: async () => {
    await wait();
    return { data: storageState().boothAssignments };
  },
  create: async (payload) => {
    await wait();
    const state = storageState();
    const assignment = {
      id: Date.now(),
      ...payload,
    };
    state.boothAssignments.push(assignment);
    persistState(state);
    return { data: assignment };
  },
  update: async (id, payload) => {
    await wait();
    const state = storageState();
    const index = state.boothAssignments.findIndex((item) => item.id === Number(id));
    if (index === -1) throw new Error("Assignment not found");
    state.boothAssignments[index] = { ...state.boothAssignments[index], ...payload };
    persistState(state);
    return { data: state.boothAssignments[index] };
  },
  remove: async (id) => {
    await wait();
    const state = storageState();
    state.boothAssignments = state.boothAssignments.filter((item) => item.id !== Number(id));
    persistState(state);
    return { data: { success: true } };
  },
};

export const customerStatusApi = {
  create: async (customerId, payload) => {
    await wait();
    const state = storageState();
    const index = state.customers.findIndex((item) => item.id === Number(customerId));
    if (index === -1) throw new Error("Customer not found");

    const customer = state.customers[index];
    customer.eventStatus = payload.status;
    customer.remarks = payload.remarks;
    customer.history = [
      ...customer.history,
      {
        status: payload.status,
        remarks: payload.remarks,
        changedAt: payload.followUpDate || new Date().toISOString().slice(0, 10),
      },
    ];
    if (payload.status === "Follow-Up Required") {
      customer.followUpDate = payload.followUpDate;
    }
    state.customers[index] = customer;
    persistState(state);
    return { data: customer };
  },
  getHistory: async (customerId) => {
    await wait();
    const customer = storageState().customers.find((item) => item.id === Number(customerId));
    if (!customer) throw new Error("Customer not found");
    return { data: customer.history };
  },
};
