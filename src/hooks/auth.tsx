import { useState, useEffect, createContext, useContext } from "react";
import { Session, User } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import supabase from "@/utils/supabase-browser"; // import your Supabase client

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthUser = User & {
  user_metadata: Database["public"]["Tables"]["profiles"]["Row"];
};

interface AuthContextProps {
  user: AuthUser | null;
  status: AuthStatus;
  profile: Database["public"]["Tables"]["profiles"]["Row"] | null;
  signOut: () => Promise<void>;
}

const initialContext: AuthContextProps = {
  user: null,
  profile: null,
  status: "loading",
  signOut: async () => {},
};

const authUserContext = createContext<AuthContextProps>(initialContext);

const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  const authStateChanged = async (event: string, session: Session | null) => {
    const authState = session?.user;

    if (!authState) {
      setUser(null);
      setStatus("unauthenticated");
      return;
    }

    const profile = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authState.id)
      .single();

    if (profile.error) {
      console.error("Error getting profile:", profile.error.message);
      return;
    }

    if (!profile.data) {
      console.error("No profile found for user:", authState.id);
      return;
    }

    authState.user_metadata = profile.data;

    setStatus("loading");
    setUser(authState);
    setStatus("authenticated");
  };

  const clear = () => {
    setUser(null);
    setStatus("unauthenticated");
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error.message);
      return;
    }

    clear();
  };

  useEffect(() => {
    const subscription = supabase.auth.onAuthStateChange(authStateChanged);
    return () => {
      subscription.data?.subscription.unsubscribe();
    };
  }, []);

  return {
    user: user as AuthUser,
    profile:
      user?.user_metadata as Database["public"]["Tables"]["profiles"]["Row"],
    status,
    signOut,
  };
};

export function AuthUserProvider({ children }: { children: React.ReactNode }) {
  const auth = useSupabaseAuth();
  return (
    <authUserContext.Provider value={auth}>{children}</authUserContext.Provider>
  );
}

export const useAuth = () => useContext(authUserContext);
