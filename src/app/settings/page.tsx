"use client";

import React, { useEffect, useState } from "react";
import supabase from "@/utils/supabase-browser";
import { useAuth } from "@/hooks/auth";
import Input from "@/components/Input";
import Image from "next/image";
import { AiOutlineCamera } from "react-icons/ai";
import { useDetectedChanges } from "@/hooks/DetectedChanges";
import { toast } from "react-toastify";

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function Profile() {
  return (
    <main className="flex flex-col items-center gap-3">
      <ProfileEditor />
    </main>
  );
}

function ProfileEditor() {
  const { user, status } = useAuth();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  const [username, setUsername] = useState(user?.user_metadata.username || "");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(user?.email || "");

  // useEffect(() => {
  //   setUsername(user?.user_metadata.username || "");
  //   setEmail(user?.email || "");
  // }, [user]);

  async function save() {
    // Save the user's profile to Supabase
    if (!user) return;

    if (user.app_metadata.provider == "email") {
      const { data, error: authError } = await supabase.auth.updateUser({
        password: password.length > 0 ? password : undefined,
        email,
      });

      if (authError) {
        toast.error(authError.message);
        return;
      }
    }

    // Save profile with username
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        username: username,
      })
      .eq("id", user.id);

    if (profileError) {
      // If the username is taken, return an error
      if (profileError.message.includes("duplicate key value")) {
        toast.error("Username taken");
        // setUsername(user.user_metadata.username || "");
        return;
      }

      toast.error(profileError.message);
      return;
    }

    window.location.href = "/profile";
  }

  const reset = () => {
    setUsername(user?.user_metadata.username || "");
    setEmail(user?.email || "");
    setPassword("");
  };

  const { addSave, addReset } = useDetectedChanges(() => {
    addSave(save);
    addReset(reset);
  }, [password, email, username]);

  return (
    <div className="flex flex-col gap-3 max-w-lg p-3">
      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-bold">Edit Profile</h1>
        <AvatarEditor />
      </div>

      <section className="flex gap-3 flex-wrap ">
        <Input
          label="Username"
          type="text"
          value={username}
          onChange={setUsername}
        />
        <Input
          disabled={
            user?.app_metadata.provider !== "email" &&
            `Managed by ${capitalizeFirstLetter(
              user?.app_metadata.provider || ""
            )}`
          }
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
        />
      </section>

      <Input
        disabled={user?.app_metadata.provider !== "email" && user?.email}
        label="Email"
        value={email}
        onChange={setEmail}
      />

      {/* <button className="ml-auto btn-primary w-20" onClick={saveProfile}>
        Save
      </button> */}
    </div>
  );
}

function AvatarEditor() {
  const { user } = useAuth();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user?.user_metadata.avatar_url) {
      setAvatarUrl(user.user_metadata.avatar_url);
    }
  }, [user]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files?.length) {
      const file = event.target.files[0];
      setAvatarFile(file);
      await handleAvatarUpload(file);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (!file || !user) return;

    const fileExtension = file.name.split(".").pop() || "";
    const filePath = `${user.id}/avatar.${fileExtension}`;

    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      console.error("Error uploading avatar:", error);
    } else {
      // Save the URL of the uploaded file to state
      if (data) {
        const newAvatarUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${data.path}`;

        await supabase
          .from("profiles")
          .update({ avatar_url: newAvatarUrl })
          .match({ id: user.id });

        setAvatarUrl(newAvatarUrl);
      }
    }
  };

  return (
    <label
      htmlFor="avatar-upload"
      className="rounded-full w-20 h-20 bg-gray-700 flex items-center justify-center cursor-pointer"
    >
      <input
        type="file"
        onChange={handleFileChange}
        style={{ display: "none" }}
        id="avatar-upload"
      />

      {avatarUrl ? (
        <img
          src={avatarUrl}
          className="rounded-full w-full h-full object-cover"
          alt="Avatar"
        />
      ) : (
        <AiOutlineCamera className="text-4xl" />
      )}
    </label>
  );
}
