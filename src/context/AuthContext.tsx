import { signInRequest } from "@/services/auth";
import { createContext, useState, useEffect } from "react";
import { setCookie, parseCookies, destroyCookie } from 'nookies'
import { api } from "@/services/api";

type SignInData = {
  username: string,
  password: string
}

export type User = {
  IDPESSOA: string,
  TOKEN: string
}

type AuthContextType = {
  user: User | null,
  isAuthenticated: boolean,
  signIn: (data: SignInData) => Promise<string>
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }: any) {

  const [user, setUser] = useState<User | null>(null)

  const isAuthenticated = !!user;

  async function signIn({ username, password }: SignInData): Promise<string> {
    const response = await signInRequest({
      username,
      password
    })

    if (!response) { return '' }
    const token = response.token

    destroyCookie(null, 'nextauth.tokenuno')
    const ctx = parseCookies(null)
    setCookie(ctx, 'nextauth.tokenuno', token, {
      maxAge: 60 * 60 * 24 * 7
    })

    setUser(user)

    api.defaults.headers['Authorization'] = `Bearer ${token}`

    return token
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn }}>
      {children}
    </AuthContext.Provider>
  )
}
