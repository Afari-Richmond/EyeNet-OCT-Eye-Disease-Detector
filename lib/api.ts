import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const ACCESS_KEY = "eyenet_access_token";
const REFRESH_KEY = "eyenet_refresh_token";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(REFRESH_KEY);
}

export function setTokens(access: string, refresh: string) {
  window.localStorage.setItem(ACCESS_KEY, access);
  window.localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens() {
  window.localStorage.removeItem(ACCESS_KEY);
  window.localStorage.removeItem(REFRESH_KEY);
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000",
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (error.response?.status !== 401 || !original || original._retry) {
      throw error;
    }

    const refresh = getRefreshToken();
    if (!refresh) {
      clearTokens();
      throw error;
    }

    original._retry = true;
    try {
      const { data } = await axios.post(
        `${api.defaults.baseURL}/api/auth/refresh/`,
        { refresh }
      );
      setTokens(data.access, refresh);
      original.headers = original.headers ?? {};
      original.headers.Authorization = `Bearer ${data.access}`;
      return api(original);
    } catch (refreshError) {
      clearTokens();
      throw refreshError;
    }
  }
);

export type User = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_doctor: boolean;
};

export type Patient = {
  id: number;
  full_name: string;
  date_of_birth: string | null;
  notes: string;
  created_at: string;
};

export type Scan = {
  id: number;
  patient: number | null;
  patient_name: string | null;
  image: string | null;
  prediction: string;
  confidence: number;
  report_generated: boolean;
  created_at: string;
};

export type PredictResult =
  | { prediction: string; confidence: number; scan_id: number | null }
  | { warning: string; confidence: number };

export async function registerUser(payload: {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
}) {
  const { data } = await api.post("/api/auth/register/", payload);
  return data;
}

export async function loginUser(username: string, password: string) {
  const { data } = await api.post<{ access: string; refresh: string }>(
    "/api/auth/login/",
    { username, password }
  );
  return data;
}

export async function fetchMe() {
  const { data } = await api.get<User>("/api/auth/me/");
  return data;
}

export async function updateMe(payload: Partial<Pick<User, "first_name" | "last_name" | "email">>) {
  const { data } = await api.patch<User>("/api/auth/me/", payload);
  return data;
}

export async function logoutUser(refresh: string) {
  await api.post("/api/auth/logout/", { refresh });
}

export async function changePassword(oldPassword: string, newPassword: string) {
  const { data } = await api.post("/api/auth/change-password/", {
    old_password: oldPassword,
    new_password: newPassword,
  });
  return data;
}

export async function predictScan(file: File, patientId?: number | null) {
  const formData = new FormData();
  formData.append("image", file);
  if (patientId) formData.append("patient_id", String(patientId));
  const { data } = await api.post<PredictResult>("/api/predict-scan/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function listPatients() {
  const { data } = await api.get<Patient[]>("/api/patients/");
  return data;
}

export async function createPatient(payload: {
  full_name: string;
  date_of_birth?: string;
  notes?: string;
}) {
  const { data } = await api.post<Patient>("/api/patients/", payload);
  return data;
}

export async function listPatientScans(patientId: number) {
  const { data } = await api.get<Scan[]>(`/api/patients/${patientId}/scans/`);
  return data;
}

export async function listScans(opts?: { report_generated?: boolean }) {
  const { data } = await api.get<Scan[]>("/api/scans/", {
    params: opts,
  });
  return data;
}

export async function markReportGenerated(scanId: number) {
  const { data } = await api.patch(`/api/scans/${scanId}/`, {
    report_generated: true,
  });
  return data;
}
