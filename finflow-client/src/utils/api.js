const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('ff_token');
}

function headers() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
  };
}

export const api = {

  // ── AUTH ─────────────────────────────────────────────────────────────────
  register: (data) => fetch(`${BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json()),

  login: (data) => fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json()),

  // ── OTP ──────────────────────────────────────────────────────────────────
  verifyOTP: (data) => fetch(`${BASE}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json()),

  resendOTP: (email) => fetch(`${BASE}/auth/resend-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  }).then(r => r.json()),

  // ── TRANSACTIONS ─────────────────────────────────────────────────────────
  getTransactions: () => fetch(`${BASE}/transactions`, {
    headers: headers(),
  }).then(r => r.json()),

  createTransaction: (data) => fetch(`${BASE}/transactions`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data),
  }).then(r => r.json()),

  updateTransaction: (id, data) => fetch(`${BASE}/transactions/${id}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(data),
  }).then(r => r.json()),

  deleteTransaction: (id) => fetch(`${BASE}/transactions/${id}`, {
    method: 'DELETE',
    headers: headers(),
  }).then(r => r.json()),

  // Profile
updateProfile: (data) => fetch(`${BASE}/profile`, {
  method: 'PUT',
  headers: headers(),
  body: JSON.stringify(data),
}).then(r => r.json()),

getProfile: () => fetch(`${BASE}/profile`, {
  headers: headers(),
}).then(r => r.json()),

changePassword: (data) => fetch(`${BASE}/profile/change-password`, {
  method: 'PUT',
  headers: headers(),
  body: JSON.stringify(data),
}).then(r => r.json()),

};