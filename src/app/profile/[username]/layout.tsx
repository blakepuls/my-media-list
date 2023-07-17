"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/auth";
import { notFound, usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { Inter } from "next/font/google";
import supabase from "@/utils/supabase-browser";
import { useEffect, useState } from "react";
import { Profile } from "@/types/database";
import Skeleton from "@/components/Skeleton";

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { username: string };
}) {
  const [profile, setProfile] = useState<null | undefined | Profile>(undefined);

  const getProfile = async () => {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", params.username)
      .single();

    if (error || !profile) {
      setProfile(null);
      return;
    }

    setProfile(profile);
  };

  useEffect(() => {
    getProfile();
  }, []);

  // Navigate to nexjts 404 page if profile is null
  if (profile === null) {
    notFound();
  }

  return (
    <main className={`bg-gray-800 w-full`}>
      <ProfileHeader profile={profile} />
      {profile && <main className="p-3">{children}</main>}
    </main>
  );
}

interface NavItemProps {
  children: React.ReactNode;
  href: string;
}

function NavItem({ children, href }: NavItemProps) {
  const pathname = usePathname();
  // const ref = `/profile/${profile?.username}/${href}`;
  // Replace last part of pathname with href
  const ref = pathname.replace(/[^/]+$/, href);
  const router = useRouter();

  function navigate(href: string) {
    router.refresh();
    router.push(href);
  }

  if (pathname === ref) {
    return (
      <button
        className={`transition-colors text-primary-500`}
        onClick={() => navigate(ref)}
      >
        <span className="">{children}</span>
      </button>
    );
  }

  return (
    <button
      className={`transition-colors hover:text-primary-500`}
      onClick={() => navigate(ref)}
    >
      <span>{children}</span>
    </button>
  );
}

interface ProfileHeaderProps {
  profile?: Profile;
}

function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <div className="w-full flex flex-col ">
      <section className="w-full h-28 bg-gray-900"></section>
      <div className="w-full font-medium p-3 bg-gray-900 relative shadow-md">
        {profile ? (
          <Image
            className=" rounded-full drop-shadow-md absolute -bottom-7 left-5"
            src={profile?.avatar_url || ""}
            alt=""
            width={100}
            height={100}
          />
        ) : (
          <Skeleton className="w-24 h-24 absolute -bottom-7 left-5 !rounded-full !bg-gray-900" />
        )}

        <nav className=" flex gap-5 ml-32 font-medium bg-gray-900">
          <NavItem href="watchlist">Watchlist</NavItem>
          <NavItem href="readlist">Readlist</NavItem>
          <NavItem href="rankings">Rankings</NavItem>
        </nav>
      </div>
    </div>
  );
}
