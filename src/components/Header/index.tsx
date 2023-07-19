"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/auth";
import UserMini from "../UserMini";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export default function Header() {
  const { profile } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header
      className={`relative flex w-full p-3 items-center h-14 ${
        pathname.includes("profile") && "bg-gray-900"
      }`}
    >
      <div className="hidden sm:block absolute top-3.5 left-3">
        <Link className="text-xl font-bold" href="/">
          MyMediaList
        </Link>
      </div>
      <nav className="absolute top-4 gap-3 flex sm:left-1/2 transform sm:-translate-x-1/2">
        <Link className="transition-colors hover:text-primary-500" href="/">
          Home
        </Link>
        <Link
          onClick={() => {
            router.refresh();
          }}
          className="transition-colors hover:text-primary-500"
          href={profile ? `/profile/${profile.username}/watchlist` : "/login"}
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
      <div className="absolute top-2 right-3">
        <UserMini />
      </div>
    </header>
  );
}
