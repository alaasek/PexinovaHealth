import { UserSession, User, ApiResponse } from '../app/types';

const BASE_URL = 'http://192.168.1.79:5000/api/auth';
const MEDICATION_URL = 'http://192.168.1.79:5000/api/medication';

export const api = {
  login: async (email: string, password: string): Promise<ApiResponse<UserSession>> => {
    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.data?.token) {
        return {
          success: true,
          data: {
            token: data.data.token,
            email: data.data.email,
            name: data.data.name,
          },
          message: data.message || 'Login successful',
        };
      }
      return { success: false, data: null, message: data.message || 'Login failed' };
    } catch (err) {
      return { success: false, data: null, message: String(err) };
    }
  },

  register: async (
    name: string,
    email: string,
    password: string,
    dob?: string,
    disease?: string,
    medications?: { name: string; dosage?: string; time?: string; category?: string }[]
  ): Promise<any> => {
    const payload: any = { name, email, password };
    if (dob) payload.dob = dob;
    if (disease) payload.disease = disease;
    if (medications) payload.medications = medications;

    // Debug logs to help trace the request from the app
    console.log('API.register called with payload:', payload);

    try {
      const res = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      console.log('API.register fetch status', res.status);
      const json = await res.json();
      console.log('API.register response json', json);
      return json;
    } catch (err) {
      console.error('API.register fetch error', err);
      return { success: false, message: String(err) };
    }
  },

  sendCode: async (email: string) => {
    const res = await fetch(`${BASE_URL}/send-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return await res.json();
  },

  verifyCode: async (email: string, code: string) => {
    const res = await fetch(`${BASE_URL}/verify-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });
    return await res.json();
  },

  resetPassword: async (resetToken: string, newPassword: string) => {
    try {
      const res = await fetch(`${BASE_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetToken, newPassword }),
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: String(err) };
    }
  },

  updateName: async (email: string, name: string) => {
    const res = await fetch(`${BASE_URL}/update-name`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name }),
    });
    return await res.json();
  },

  updateDob: async (email: string, dob: string) => {
    const res = await fetch(`${BASE_URL}/update-dob`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, dob }),
    });
    return await res.json();
  },

  updateDisease: async (email: string, disease: string) => {
    const res = await fetch(`${BASE_URL}/update-disease`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, disease }),
    });
    return await res.json();
  },

  addMedication: async (email: string, name: string, dosage: string, time: string, category: string) => {
    const res = await fetch(`${MEDICATION_URL}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, dosage, time, category }),
    });
    return await res.json();
  },
};
