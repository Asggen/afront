import api from "./api.config.js";

const BASE = "/auth";

export async function login({ email, password }) {
  return api.post(
    `${BASE}/login`,
    { email, password },
    { withCredentials: true }
  );
}

export async function signup({
  email,
  password,
  name,
  accountType,
  companyName,
}) {
  return api.post(
    `${BASE}/signup`,
    { email, password, name, accountType, companyName },
    { withCredentials: true }
  );
}

export async function checkSignup({ email }) {
  return api.post(`${BASE}/check`, { email }, { withCredentials: true });
}

export async function logout() {
  try {
    await api.post(`${BASE}/logout`, null, { withCredentials: true });
  } catch (e) {
    /* ignore */
  }
  try {
    localStorage.setItem("auth-event", String(Date.now()));
  } catch (e) {}
  window.dispatchEvent(new Event("auth-changed"));
  return { ok: true };
}

export default { login, signup, logout, checkSignup };
