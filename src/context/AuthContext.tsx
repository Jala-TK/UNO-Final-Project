"use client";
import { signInRequest } from "@/services/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { setCookie, parseCookies, destroyCookie } from 'nookies'

import { api } from "@/services/api";
import { getPerfil } from "@/services/authService";

type SignInData = {
  username: string,
  password: string
}

export type User = {
  username: string,
  email: string
}

type AuthContextType = {
  user: User | null,
  isAuthenticated: boolean,
  signIn: (data: SignInData) => Promise<string>
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }: any) {

  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = !!user;

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      api.defaults.headers['Authorization'] = `Bearer ${storedToken}`;
    }
  }, []);

  async function signIn({ username, password }: SignInData): Promise<string> {
    const token = await signInRequest({
      username,
      password
    })

    if (!token) { return '' }

    destroyCookie(null, 'nextauth.token.uno')
    const ctx = parseCookies(null)
    setCookie(ctx, 'nextauth.token.uno', token, {
      maxAge: 60 * 60 * 24 * 7
    })

    const userData = await getPerfil();
    if (userData != null) {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
    }

    api.defaults.headers['Authorization'] = `Bearer ${token}`

    return token
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);
