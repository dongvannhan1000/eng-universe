import { http } from "@/lib/http";
import type {
  LoginRequest,
  AuthResponse,
  RegisterRequest,
  ForgotPasswordRequest,
  User,
} from "../types";

export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const url = "/auth/login";

  const res = await http.post(url, credentials);

  // Controller trả về { message: 'Login successful', user: result.user }
  // Access token được set trong cookie HTTP-only nên không nằm trong response body.
  // Tuy nhiên, nếu AuthResponse trong type của bạn có chứa { user: User } thì sẽ khớp.
  if (res.status >= 400) {
    // Backend controller trả về 401 Unauthorized nếu login thất bại (do LocalAuthGuard)
    const error = res.data || { message: "Login failed" };
    throw new Error(error.message || "Login failed");
  }

  // Giả định AuthResponse là type của res.data (vd: { message: string, user: User })
  return res.data as AuthResponse;
}

export async function register(data: RegisterRequest): Promise<{ message: string }> {
  const url = "/auth/register";

  const res = await http.post(url, data);

  if (res.status >= 400) {
    // Backend controller có thể trả về 409 Conflict (Username already exists)
    const error = res.data || { message: "Registration failed" };
    throw new Error(error.message || "Registration failed");
  }

  // Backend service trả về { message: 'User registered successfully' }
  return res.data as { message: string };
}

export async function forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
  const url = "/auth/forgot-password";

  const res = await http.post(url, data);

  if (res.status >= 400) {
    const error = res.data || { message: "Request failed" };
    throw new Error(error.message || "Request failed");
  }

  // Backend service trả về { message: 'If the email exists, a reset link will be sent' }
  return res.data as { message: string };
}

export async function getCurrentUser(): Promise<User> {
  const url = "/auth/profile";

  const res = await http.get(url);

  if (res.status >= 400) {
    throw new Error(`Failed to fetch user: ${res.status} ${res.statusText}`);
  }

  // Backend controller trả về (req as any).user (là object User)
  return res.data as User;
}

export async function resetPassword(
  token: string,
  newPassword: string,
): Promise<{ message: string }> {
  const url = "/auth/reset-password";

  // DTO backend mong muốn: { token: string, newPassword: string }
  const data = { token, newPassword };

  const res = await http.post(url, data);

  if (res.status >= 400) {
    // Backend service có thể trả về 401 Unauthorized (Invalid or expired reset token)
    const error = res.data || { message: "Password reset failed" };
    throw new Error(error.message || "Password reset failed");
  }

  // Backend service trả về { message: 'Password reset successfully' }
  return res.data as { message: string };
}

export async function logout(): Promise<void> {
  const url = "/auth/logout";
  await http.post(url);
}
