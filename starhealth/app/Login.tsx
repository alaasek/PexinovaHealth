import React from 'react';
import { useRouter } from 'expo-router';
import LoginForm from '../components/LoginForm';
import type { AuthView } from '../app/types';
import { AUTH_VIEWS } from '../app/types';
import { UserSession } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const router = useRouter();

  const handleNavigate = (view: AuthView) => {
    if (view === AUTH_VIEWS.FORGOT) router.push('/ForgotPswd');
    if (view === AUTH_VIEWS.SIGNUP) router.push('/signup');
  };

  const handleSuccess = async (session: UserSession) => {
    await AsyncStorage.setItem('geminiauth_session', JSON.stringify(session));
    router.replace('/home');
  };

  return <LoginForm onNavigate={handleNavigate} onSuccess={handleSuccess} />;
}

