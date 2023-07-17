"use client";

import Input from "@/components/Input";
import Image from "next/image";
import { useEffect, useState } from "react";
import supabase from "@/utils/supabase-browser";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/auth";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { toast } from "react-toastify";

export async function getServerSideProps() {
  const { data } = await supabase.auth.getSession();

  if (!data) {
    return {
      redirect: {
        destination: "/dashboard", // Redirect to the dashboard if the user is signed in
        permanent: false,
      },
    };
  }

  // Pass data to the page via props
  return {};
}

interface AuthProviderProps {
  provider: "Facebook" | "Google" | "Microsoft" | "Twitter";
  providerName: "facebook" | "google" | "azure" | "twitter";
  onClick: () => void;
}

function AuthProvider({ provider, onClick, providerName }: AuthProviderProps) {
  async function signInWithProvider() {
    //Sign in with provider using supabase
    const { data, error } = await supabase.auth.signInWithOAuth({
      // @ts-ignore - provider options include a capital letter, but the type only allows lowercase
      provider: providerName,
      options: {},
    });

    if (error) {
      console.error(error);
    }

    if (data) {
      // Navigate to the dashboard
      console.log(data);
      // window.location.href = "/";
    }
  }

  return (
    <button
      className={`rounded-md shadow-md w-full flex items-center gap-3 p-3 bg-gray-900 transition-transform hover:-translate-y-1`}
      onClick={signInWithProvider}
    >
      <Image
        src={`/logos/${provider.toLowerCase()}.svg`}
        alt={`${provider} logo`}
        // Center the image
        content="center"
        width={40}
        height={40}
      />
      <span className="ml-3 text-xl">Login with {provider}</span>
    </button>
  );
}

function LoginWithEmail() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
    // Login with email using supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error(error);
    }

    if (data) {
      // Navigate to the dashboard
      console.log(data);
      // window.location.href = "/";
    }
  }

  return (
    <div className="flex flex-col gap-3 w-80">
      {/* <h2 className="text-2xl">Login with Email</h2> */}
      <section className="flex flex-col gap-1 ">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          error={
            email.length > 0 && !email.includes("@") ? "Invalid email" : ""
          }
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
        />
        <a className="" href="#">
          Forgot password?
        </a>
      </section>
      <button className="btn-primary w-full" onClick={login}>
        Login
      </button>
    </div>
  );
}

function SignUpWithEmailPrompt() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [confirm, setConfirm] = useState(false);

  async function signUp() {
    // Check if the username is taken, regardless of case

    // Sign up with email using supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          email,
          avatar_url: "/default_avatar.svg",
        },
      },
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    if (data) {
      setConfirm(true);
    }
  }

  return (
    <div className="flex flex-col gap-3 w-80">
      {confirm && (
        <section className="bg-opacity-25 bg-red-500 w-full p-3 rounded-sm">
          Please confirm your email address to continue
        </section>
      )}
      {/* <h2 className="text-2xl">Sign up with Email</h2> */}
      <section className="flex flex-col gap-1 ">
        <Input
          label="Username"
          type="text"
          value={username}
          onChange={setUsername}
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          error={
            email.length > 0 && !email.includes("@") ? "Invalid email" : ""
          }
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
        />
        <Input
          label="Confirm Password"
          type="password"
          value={passwordConfirm}
          onChange={setPasswordConfirm}
          error={
            passwordConfirm.length > 0 && passwordConfirm !== password
              ? "Passwords do not match"
              : ""
          }
        />
      </section>
      <button className="btn-primary w-full " onClick={signUp}>
        Sign up
      </button>

      <p>
        Already have an account?{" "}
        <a className="text-primary-500" href="/login">
          Login
        </a>
      </p>
    </div>
  );
}

function LoginPrompt() {
  // Using supabase to login with facebook, google, microsoft, twitter, and email
  return (
    <div className="flex flex-col gap-3 items-center w-80">
      <LoginWithEmail />
      <p>
        Don't have an account?{" "}
        <a className="text-primary-500 underline" href="/login?register">
          Sign up
        </a>
      </p>
      <div className="flex items-center w-full">
        <hr className="flex-grow border-gray-300" />
        <h2 className="mx-2">OR</h2>
        <hr className="flex-grow border-gray-300" />
      </div>
      <section className="flex gap-3 w-full">
        <AuthProvider
          providerName="google"
          provider="Google"
          onClick={() => {}}
        />
        {/* <AuthProvider
          providerName="facebook"
          provider="Facebook"
          onClick={() => {}}
        />
        <AuthProvider
          providerName="azure"
          provider="Microsoft"
          onClick={() => {}}
        />
        <AuthProvider
          providerName="twitter"
          provider="Twitter"
          onClick={() => {}}
        /> */}
      </section>
    </div>
  );
}

export default function Login() {
  const { user } = useAuth();

  const searchParams = useSearchParams();
  const register = searchParams.get("register");

  useEffect(() => {
    if (user) {
      // Navigate to the dashboard
      window.location.href = "/";
    }
  }, [user]);

  return (
    <main className="flex flex-col items-center w-full justify-center">
      {register != null ? <SignUpWithEmailPrompt /> : <LoginPrompt />}
    </main>
  );
}
