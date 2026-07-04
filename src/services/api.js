// ─── Mock API (no backend) ────────────────────────────────────────────────────
// All data lives in localStorage. Responses mirror the original axios shape
// so every call-site (response.data) keeps working without changes.

const KEYS = {
  LEAVES:      'lf_leaves',
  EXTRA_USERS: 'lf_extra_users',
  INITIALIZED: 'lf_init',
};

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── Static users ─────────────────────────────────────────────────────────────
const BASE_USERS = [
  { id: 1, name: 'Alex Johnson',   email: 'employee@rockpaperscissors.studio', password: 'Demo@123', role: 'USER',    department: 'Engineering', phone: '+1 555-0101' },
  { id: 2, name: 'Sarah Chen',     email: 'admin@rockpaperscissors.studio',    password: 'Demo@123', role: 'MANAGER', department: 'Management',  phone: '+1 555-0102' },
  { id: 3, name: 'Priya Sharma',   email: 'priya@company.com',                 password: 'pass',     role: 'USER',    department: 'Engineering', phone: '' },
  { id: 4, name: 'Rahul Gupta',    email: 'rahul@company.com',                 password: 'pass',     role: 'USER',    department: 'Engineering', phone: '' },
  { id: 5, name: 'Anita Desai',    email: 'anita@company.com',                 password: 'pass',     role: 'USER',    department: 'Product',     phone: '' },
  { id: 6, name: 'Meera Nair',     email: 'meera@company.com',                 password: 'pass',     role: 'USER',    department: 'Design',      phone: '' },
  { id: 7, name: 'Arjun Patel',    email: 'arjun@company.com',                 password: 'pass',     role: 'USER',    department: 'Analytics',   phone: '' },
];

const SEED_LEAVES = [
  // Employee (id 1) leaves
  { id: 1, userId: 1, startDate: '2026-06-02', endDate: '2026-06-04', reason: 'Annual family vacation to the coast.', leaveType: 'casual',    status: 'APPROVED', session: null,          managerComment: 'Approved. Enjoy your trip!', user: { id: 1, name: 'Alex Johnson', email: 'employee@rockpaperscissors.studio' } },
  { id: 2, userId: 1, startDate: '2026-06-20', endDate: '2026-06-20', reason: 'Doctor appointment in the morning.',  leaveType: 'HALF_DAY',  status: 'APPROVED', session: 'FIRST_HALF',  managerComment: 'Approved.',                  user: { id: 1, name: 'Alex Johnson', email: 'employee@rockpaperscissors.studio' } },
  { id: 3, userId: 1, startDate: '2026-07-15', endDate: '2026-07-17', reason: 'Attending a tech conference in SF.',  leaveType: 'privilege', status: 'PENDING',  session: null,          managerComment: null,                         user: { id: 1, name: 'Alex Johnson', email: 'employee@rockpaperscissors.studio' } },
  { id: 4, userId: 1, startDate: '2026-05-12', endDate: '2026-05-13', reason: 'Personal work commitments at home.',  leaveType: 'casual',    status: 'REJECTED', session: null,          managerComment: 'Sprint deadline conflict.',   user: { id: 1, name: 'Alex Johnson', email: 'employee@rockpaperscissors.studio' } },
  // Other employees (visible to admin)
  { id: 5, userId: 3, startDate: '2026-07-10', endDate: '2026-07-11', reason: 'Medical leave.',    leaveType: 'casual',    status: 'PENDING',  session: null, managerComment: null,            user: { id: 3, name: 'Priya Sharma', email: 'priya@company.com'  } },
  { id: 6, userId: 4, startDate: '2026-07-08', endDate: '2026-07-08', reason: 'Personal errand.',  leaveType: 'casual',    status: 'PENDING',  session: null, managerComment: null,            user: { id: 4, name: 'Rahul Gupta',  email: 'rahul@company.com'  } },
  { id: 7, userId: 5, startDate: '2026-06-25', endDate: '2026-06-27', reason: 'Holiday travel.',   leaveType: 'privilege', status: 'APPROVED', session: null, managerComment: 'Safe travels!', user: { id: 5, name: 'Anita Desai',  email: 'anita@company.com'  } },
  { id: 8, userId: 6, startDate: '2026-07-01', endDate: '2026-07-02', reason: 'Design workshop.',  leaveType: 'privilege', status: 'APPROVED', session: null, managerComment: 'Approved.',     user: { id: 6, name: 'Meera Nair',   email: 'meera@company.com'  } },
  { id: 9, userId: 7, startDate: '2026-07-20', endDate: '2026-07-21', reason: 'Family event.',     leaveType: 'casual',    status: 'PENDING',  session: null, managerComment: null,            user: { id: 7, name: 'Arjun Patel',  email: 'arjun@company.com'  } },
];

// ─── DB helpers ───────────────────────────────────────────────────────────────
function initDb() {
  if (localStorage.getItem(KEYS.INITIALIZED)) return;
  localStorage.setItem(KEYS.LEAVES,      JSON.stringify(SEED_LEAVES));
  localStorage.setItem(KEYS.EXTRA_USERS, JSON.stringify([]));
  localStorage.setItem(KEYS.INITIALIZED, '1');
}

function getLeaves() {
  initDb();
  try { return JSON.parse(localStorage.getItem(KEYS.LEAVES)) || []; } catch { return []; }
}

function saveLeaves(leaves) {
  localStorage.setItem(KEYS.LEAVES, JSON.stringify(leaves));
}

function getExtraUsers() {
  try { return JSON.parse(localStorage.getItem(KEYS.EXTRA_USERS)) || []; } catch { return []; }
}

function saveExtraUsers(users) {
  localStorage.setItem(KEYS.EXTRA_USERS, JSON.stringify(users));
}

function getAllUsers() {
  return [...BASE_USERS, ...getExtraUsers()];
}

function findUser(email) {
  return getAllUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
}

function nextLeaveId() {
  const leaves = getLeaves();
  return leaves.length > 0 ? Math.max(...leaves.map((l) => l.id)) + 1 : 1;
}

function nextUserId() {
  const users = getAllUsers();
  return users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 10;
}

function applyFilters(leaves, params = {}) {
  return leaves.filter((l) => {
    if (params.status    && l.status    !== params.status)                                                      return false;
    if (params.leaveType && l.leaveType !== params.leaveType)                                                    return false;
    if (params.userName  && !l.user?.name?.toLowerCase().includes(params.userName.toLowerCase()))               return false;
    if (params.month     && new Date(l.startDate).getMonth() + 1 !== Number(params.month))                      return false;
    if (params.year      && new Date(l.startDate).getFullYear()  !== Number(params.year))                       return false;
    if (params.startDate && new Date(l.startDate) < new Date(params.startDate))                                 return false;
    if (params.endDate   && new Date(l.endDate)   > new Date(params.endDate))                                   return false;
    return true;
  });
}

// ─── Error helper ─────────────────────────────────────────────────────────────
export const extractApiErrorMessage = (error) => {
  const data = error?.response?.data;
  if (typeof data === 'string') return data;
  if (data?.message) return data.message;
  return error?.message || 'Request failed';
};

// ─── Auth Service ─────────────────────────────────────────────────────────────
export const authService = {
  login: async (email, password) => {
    await delay(450);
    const user = findUser(email);
    if (!user || user.password !== password) {
      const err = new Error('Invalid credentials');
      err.response = { data: { message: 'Invalid email or password.' } };
      throw err;
    }
    const token = btoa(`${user.id}:${user.email}:${Date.now()}`);
    const { password: _pw, ...safeUser } = user;
    return { data: { ...safeUser, token } };
  },

  register: async (name, email, password) => {
    await delay(450);
    if (findUser(email)) {
      const err = new Error('Email already exists');
      err.response = { data: { message: 'An account with this email already exists.' } };
      throw err;
    }
    const newUser = { id: nextUserId(), name, email, password, role: 'USER', department: '', phone: '' };
    saveExtraUsers([...getExtraUsers(), newUser]);
    return { data: { message: 'Account created successfully' } };
  },
};

// ─── User Service ─────────────────────────────────────────────────────────────
export const userService = {
  applyLeave: async (leaveData) => {
    await delay(350);
    const user = getCurrentUser();
    if (!user) { const e = new Error('Unauthorized'); e.response = { status: 401 }; throw e; }
    const leaves = getLeaves();
    const newLeave = {
      id: nextLeaveId(),
      userId: user.id,
      ...leaveData,
      status: 'PENDING',
      managerComment: null,
      user: { id: user.id, name: user.name, email: user.email },
    };
    saveLeaves([...leaves, newLeave]);
    return { data: newLeave, status: 201 };
  },

  getMyLeaves: async () => {
    await delay(200);
    const user = getCurrentUser();
    if (!user) return { data: [] };
    const leaves = getLeaves().filter((l) => l.userId === user.id);
    return { data: leaves };
  },

  updateProfile: async (profileData) => {
    await delay(300);
    return { data: { message: 'Profile updated successfully' } };
  },

  changePassword: async (passwordData) => {
    await delay(350);
    return { data: { message: 'Password changed successfully' } };
  },

  forgotPassword: async (email) => {
    await delay(600);
    return { data: { message: 'Reset instructions sent' } };
  },
};

// ─── Manager Service ──────────────────────────────────────────────────────────
export const managerService = {
  getPendingLeaves: async () => {
    await delay(250);
    return { data: getLeaves().filter((l) => l.status === 'PENDING') };
  },

  getAllLeaves: async () => {
    await delay(250);
    return { data: getLeaves() };
  },

  filterLeavesEnhanced: async (params = {}) => {
    await delay(300);
    return { data: applyFilters(getLeaves(), params) };
  },

  approveLeave: async (id, comment = '') => {
    await delay(350);
    saveLeaves(getLeaves().map((l) =>
      l.id === Number(id) ? { ...l, status: 'APPROVED', managerComment: comment } : l
    ));
    return { data: { message: 'Leave approved' } };
  },

  rejectLeave: async (id, comment = '') => {
    await delay(350);
    saveLeaves(getLeaves().map((l) =>
      l.id === Number(id) ? { ...l, status: 'REJECTED', managerComment: comment } : l
    ));
    return { data: { message: 'Leave rejected' } };
  },

  getAllUsers: async () => {
    await delay(200);
    const users = getAllUsers()
      .filter((u) => u.role === 'USER')
      .map(({ password: _pw, ...u }) => u);
    return { data: users };
  },

  getUserLeaves: async (userId) => {
    await delay(200);
    return { data: getLeaves().filter((l) => l.userId === Number(userId)) };
  },

  filterUsers:           async () => ({ data: [] }),
  filterUsersEnhanced:   async () => ({ data: [] }),
  getUserStats:          async () => ({ data: {} }),
  getUserLeavesByFilter: async () => ({ data: [] }),
  getUserLeavesByStatus: async () => ({ data: [] }),
};

export default { authService, userService, managerService };
