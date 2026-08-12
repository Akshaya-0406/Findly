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
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined" && !isSupabaseConfigured) {
      const localSession = localStorage.getItem("findly_current_user");
      if (localSession) {
        try {
          return JSON.parse(localSession);
        } catch {
          return null;
        }
      }
    }
    return null;
  });

  const [loading, setLoading] = useState<boolean>(Boolean(isSupabaseConfigured));

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

      const { data: { subscription } } = client.auth.onAuthStateChange(async (_event, session) => {
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
    }
  }, []);

  // Login handler
  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase!.auth.signInWithPassword({ email, password });
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          return { error: "Invalid email or password. If you recently registered, check your email inbox to confirm your account first." };
        }
        return { error: error.message };
      }
      return {};
    } else {
      const users: User[] = JSON.parse(localStorage.getItem("findly_users") || "[]");
      const found = users.find((u) => u.email === email);
      if (found) {
        setUser(found);
        localStorage.setItem("findly_current_user", JSON.stringify(found));
        return {};
      }
      return { error: "User not found in local demo mode. Please Sign Up first." };
    }
  };

  // Sign up handler
  const signUp = async (name: string, email: string, password: string): Promise<{ error?: string }> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase!.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
        },
      });

      if (error) return { error: error.message };

      if (data.user) {
        await supabase!.from("profiles").insert({
          id: data.user.id,
          name,
          role: "user",
        });
      }
      return {};
    } else {
      const users: User[] = JSON.parse(localStorage.getItem("findly_users") || "[]");
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        name,
        email,
        memberSince: "Just Joined",
      };
      users.push(newUser);
      localStorage.setItem("findly_users", JSON.stringify(users));
      localStorage.setItem("findly_current_user", JSON.stringify(newUser));
      setUser(newUser);
      return {};
    }
  };

  // Sign out handler
  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase!.auth.signOut();
    } else {
      localStorage.removeItem("findly_current_user");
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isSupabase: isSupabaseConfigured,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
