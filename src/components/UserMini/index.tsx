"use client";

import { useState, useEffect, useRef } from "react";
import { FaChevronDown } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import clsx from "clsx";
import Skeleton from "../Skeleton";

import { CSSTransition } from "react-transition-group";
import "./animation.css";
import Link from "next/link";
import { useAuth } from "@/hooks/auth";
import { AiFillProfile, AiOutlineSetting, AiOutlineUser } from "react-icons/ai";
import Image from "next/image";

function UserMenu(props: { show: boolean; setShow: (show: boolean) => void }) {
  const menuRef = useRef<HTMLDivElement | null>(null);

  const { signOut, user, profile } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        props.setShow(false);
      }
    };

    if (props.show) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [props.show]);

  const handleClickInside = (event: React.MouseEvent) => {
    event.stopPropagation();
    props.setShow(false);
  };

  return (
    <CSSTransition
      in={props.show}
      timeout={300}
      classNames="slide-down"
      unmountOnExit
    >
      <div
        className="z-20 absolute top-16 right-3 flex flex-col items-center shadow-lg"
        ref={menuRef}
      >
        <div
          className="rounded-md bg-gray-950 shadow-xs w-40 p-1.5"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu"
          onClick={handleClickInside}
        >
          <Link
            href={`/profile/${profile?.username}`}
            className="p-3 text-sm rounded-md hover:bg-gray-900 transition duration-300 ease-in-out flex items-center justify-between"
            role="menuitem"
          >
            Profile
            <AiOutlineUser className="ml-2 text-lg" />
          </Link>
          <Link
            href="/settings"
            className="p-3 text-sm rounded-md hover:bg-gray-900 transition duration-300 ease-in-out flex items-center justify-between"
            role="menuitem"
          >
            Settings
            <AiOutlineSetting className="ml-2 text-lg" />
          </Link>
          <Link
            href="/"
            className="p-3 text-sm rounded-md hover:bg-gray-900 transition duration-300 ease-in-out flex items-center justify-between"
            role="menuitem"
            onClick={signOut}
          >
            Sign out
            <FiLogOut className="ml-2 text-lg" />
          </Link>
        </div>
      </div>
    </CSSTransition>
  );
}

export default function UserMini() {
  const { user, status } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  function toggleMenu() {
    setShowMenu(!showMenu);
  }

  if (status === "loading") {
    return (
      <div
        className="cursor-pointer select-none flex items-center"
        onClick={() => console.log(status)}
      >
        <Skeleton className="h-10 w-10 !rounded-full" />
        <div className=" ml-3">
          <Skeleton className="text-lg leading-5 h-3 w-[6.3rem] text-white rounded-md"></Skeleton>
          <Skeleton className=" text-sm leading-5 h-3 w-12 mt-1.5 text-zinc-400 rounded-md"></Skeleton>
        </div>
      </div>
    );
  }

  // Don't show if on the login page
  if (
    (status === "unauthenticated" || !user) &&
    window.location.pathname != "/login"
  )
    return (
      <Link href={"/login"} className=" btn-primary">
        Login
      </Link>
    );

  if (!user) {
    return;
  }

  return (
    <div className="flex flex-col items-center ">
      <div
        className="cursor-pointer select-none flex items-center"
        onMouseDown={toggleMenu}
      >
        <Image
          className="h-10 w-10 rounded-full drop-shadow-md"
          src={user?.user_metadata.avatar_url || ""}
          alt=""
          width={40}
          height={40}
        />
        {/* <img
          className="h-10 w-10 rounded-full drop-shadow-md"
          src={session.user?. || ""}
          alt=""
        /> */}

        <div className="hidden sm:block ml-3">
          <p className="text-lg leading-5 text-white">
            {user?.user_metadata.username}
          </p>
          {/* <p className=" text-sm leading-5 text-zinc-400">#{discriminator}</p> */}
        </div>
        <FaChevronDown
          className={clsx("ml-3 text-white transition-transform duration-300", {
            "transform rotate-180": showMenu,
          })}
        />
      </div>
      <UserMenu show={showMenu} setShow={setShowMenu} />
    </div>
  );
}
