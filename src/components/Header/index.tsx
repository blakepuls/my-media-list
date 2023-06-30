"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/auth";
import UserMini from "../UserMini";
import { usePathname } from "next/navigation";

export default function Header() {
  const { profile } = useAuth();
  const pathname = usePathname();

  return (
    <header
      className={`flex w-full p-3 items-center ${
        pathname.includes("profile") && "bg-gray-900"
      }`}
    >
      <div className="w-1/3 text-left">
        <Link className="text-xl font-bold" href="/">
          MyMediaList
        </Link>
      </div>
      <nav className="w-1/3 flex gap-5 font-medium items-center justify-center text-center">
        <Link className="transition-colors hover:text-primary-500" href="/">
          Home
        </Link>
        <Link
          className="transition-colors hover:text-primary-500"
          href={`/profile/${profile?.username}`}
        >
          Profile
        </Link>
        <Link
          className="transition-colors hover:text-primary-500"
          href="/browse"
        >
          Browse
        </Link>
      </nav>
      <div className="w-1/3 flex justify-end">
        <UserMini />
      </div>
    </header>
  );
}
