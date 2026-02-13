//const API_BASE = "http://localhost:5000/api/auth";
import { API_URL } from "../constants/config";
export const sendCode = async (email: string) => {
  const resp = await fetch(`${API_URL}/send-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return resp.json();
};

export const verifyCode = async (email: string, code: string) => {
  const resp = await fetch(`${API_URL}/verify-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });
  return resp.json();
};

export const resetPassword = async (email: string, code: string, newPassword: string) => {
  const resp = await fetch(`${API_URL}/reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code, newPassword }),
  });
  return resp.json();
};
