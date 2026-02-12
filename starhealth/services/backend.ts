import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthView, User, UserSession, ApiResponse } from '../app/types';


const STORAGE_KEY_USERS = 'geminiauth_users';
const STORAGE_KEY_SESSION = 'geminiauth_session';

export const mockBackend = {
  // Get all users
  getUsers: async (): Promise<User[]> => {
    const data = await AsyncStorage.getItem(STORAGE_KEY_USERS);
    return data ? JSON.parse(data) : [];
  },

  // Register a new user
  register: async (name: string, email: string, password: string): Promise<ApiResponse<User>> => {
    await new Promise(r => setTimeout(r, 1000)); // Simulate network latency
    const users = await mockBackend.getUsers();

    if (users.find(u => u.email === email)) {
      return { success: false, message: 'Email already registered.' };
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      passwordHash: Buffer.from(password).toString('base64'), // simple mock hash
      createdAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(STORAGE_KEY_USERS, JSON.stringify([...users, newUser]));
    return { success: true, message: 'Registration successful!', data: newUser };
  },

  // Login
  login: async (email: string, password: string): Promise<ApiResponse<UserSession>> => {
    await new Promise(r => setTimeout(r, 1200));
    const users = await mockBackend.getUsers();
    const user = users.find(u => u.email === email && u.passwordHash === Buffer.from(password).toString('base64'));

    if (!user) {
      return { success: false, message: 'Invalid email or password.' };
    }

    const session: UserSession = {
      user,
      token: `jwt_${Math.random().toString(36).substr(2)}`,
      loginTime: new Date().toISOString(),
    };

    await AsyncStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
    return { success: true, message: 'Login successful!', data: session };
  },

  // Get current session
  getSession: async (): Promise<UserSession | null> => {
    const data = await AsyncStorage.getItem(STORAGE_KEY_SESSION);
    return data ? JSON.parse(data) : null;
  },

  // Logout
  logout: async () => {
    await AsyncStorage.removeItem(STORAGE_KEY_SESSION);
  },
};
