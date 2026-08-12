"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types";
import { supabase, isSupabaseConfigured } from "./supabase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isSupabase: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (name: string, email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth sessions
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      const client = supabase!;
      
      const checkSession = async () => {
        try {
          const { data: { session } } = await client.auth.getSession();
          if (session?.user) {
            const { data: profile } = await client
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();

            if (profile) {
              setUser({
                id: profile.id,
                name: profile.name,
                avatarUrl: profile.avatar_url,
                memberSince: new Date(profile.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long" }),
              });
            } else {
              setUser({
                id: session.user.id,
                name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "User",
                memberSince: "New Member",
              });
            }
          } else {
            setUser(null);
          }
        } catch (e) {
          console.error("Session check error:", e);
          setUser(null);
        } finally {
          setLoading(false);
        }
      };

      checkSession();

      const { data: { subscription } } = client.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const { data: profile } = await client
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (profile) {
            setUser({
              id: profile.id,
              name: profile.name,
              avatarUrl: profile.avatar_url,
              memberSince: new Date(profile.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long" }),
            });
          } else {
            setUser({
              id: session.user.id,
              name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "User",
              memberSince: "New Member",
            });
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      if (typeof window !== "undefined") {
        const localSession = localStorage.getItem("findly_current_user");
        if (localSession) {
          setUser(JSON.parse(localSession));
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    }
  }, []);

  // Login handler
  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase!.auth.signInWithPassword({ email, password });
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          return { error: "Invalid email or password. If you recently registered, check your email inbox to confirm your account first." };
        }
        return { error: error.message };
      }
      return {};
    } else {
      if (typeof window !== "undefined") {
        const users: User[] = JSON.parse(localStorage.getItem("findly_users") || "[]");
        const matchedUser = users.find((u) => u.name.toLowerCase() === email.split("@")[0].toLowerCase() || u.id === email);
        if (!matchedUser) {
          return { error: "Invalid credentials. Create an account first." };
        }
        setUser(matchedUser);
        localStorage.setItem("findly_current_user", JSON.stringify(matchedUser));
      }
      return {};
    }
  };

  // Registration handler
  const signUp = async (name: string, email: string, password: string): Promise<{ error?: string }> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase!.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        if (error.message.includes("rate limit") || error.status === 429) {
          return { 
            error: "Supabase Email Rate Limit exceeded. Tip: In your Supabase Dashboard under Auth -> Providers -> Email, uncheck 'Confirm email' to allow instant logins!" 
          };
        }
        return { error: error.message };
      }

      if (data?.user && !data?.session) {
        return { error: "Account created! Check your email inbox to confirm your address before logging in (or uncheck 'Confirm email' in Supabase settings)." };
      }

      return {};
    } else {
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        name: name,
        memberSince: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" }),
      };

      if (typeof window !== "undefined") {
        const users: User[] = JSON.parse(localStorage.getItem("findly_users") || "[]");
        users.push(newUser);
        localStorage.setItem("findly_users", JSON.stringify(users));
        setUser(newUser);
        localStorage.setItem("findly_current_user", JSON.stringify(newUser));
      }
      return {};
    }
  };

  // Sign out handler
  const signOut = async (): Promise<void> => {
    if (isSupabaseConfigured && supabase) {
      await supabase!.auth.signOut();
    } else {
      if (typeof window !== "undefined") {
        localStorage.removeItem("findly_current_user");
      }
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isSupabase: isSupabaseConfigured, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
