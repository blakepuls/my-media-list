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
import { AiOutlineShareAlt } from "react-icons/ai";
import { BsFillShareFill } from "react-icons/bs";
import Modal from "@/components/Modal";
import Tooltip from "@/components/Tooltip";
import Test from "@/components/Test";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { username: string };
}) {
  const [profile, setProfile] = useState<null | undefined | Profile>(undefined);

  const getProfile = async () => {
    console.log("getting profile");
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", params.username)
      .single();

    setProfile(profile);

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
      <Test data={profile} />
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
  const [shareModal, setShareModal] = useState(false);

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

        <section className="flex items-center w-full flex-wrap-reverse gap-3">
          <nav className=" flex gap-5 ml-32 font-medium bg-gray-900 items-center">
            <NavItem href="watchlist">Watchlist</NavItem>
            <NavItem href="readlist">Readlist</NavItem>
            <NavItem href="rankings">Rankings</NavItem>
          </nav>
          <button
            className="ml-auto transition-colors hover:text-primary-500"
            onClick={() => setShareModal(true)}
          >
            <BsFillShareFill className="inline-block mr-1 text-2xl" />
          </button>
        </section>
      </div>
      <ShareModal isOpen={shareModal} setOpen={setShareModal} />
    </div>
  );
}

interface ShareModalProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function ShareModal({ isOpen, setOpen }: ShareModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      ariaHideApp={false}
      className="bg-gray-800 flex flex-col gap-1 outline-none rounded-sm  m-auto items-center justify-center "
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
      onAfterClose={() => {}}
      onRequestClose={() => setOpen(false)}
    >
      <section className="flex flex-col h-auto outline-none p-3">
        <h1 className="text-lg mb-2">Share</h1>

        <section className="flex gap-3 text-center w-full bg-gray-950 p-2 px-2 items-center rounded-md">
          {/* <span className="truncate w-40">{window?.location?.href}</span>
          <button
            className="flex items-center transition-colors hover:bg-primary-500 bg-gray-700 p-1.5 text-sm rounded-md gap-2"
            onClick={() => {
              navigator.clipboard.writeText(window?.location?.href);
              setOpen(false);
            }}
          >
            Copy
          </button> */}
        </section>
        {/* <div className="flex gap-2">
          <button className="flex items-center gap-2">
            <AiOutlineShareAlt className="text-2xl" />
            <span>Share on Twitter</span>
          </button>
          <button className="flex items-center gap-2">
            <AiOutlineShareAlt className="text-2xl" />
            <span>Share on Facebook</span>
          </button>
          <button className="flex items-center gap-2">
            <AiOutlineShareAlt className="text-2xl" />
            <span>Share on Reddit</span>
          </button>
        </div> */}
      </section>
    </Modal>
  );
}
