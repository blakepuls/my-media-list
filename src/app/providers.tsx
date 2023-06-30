"use client";

import { useEffect } from "react";
import { AuthUserProvider } from "../hooks/auth";
import { Flip, ToastContainer } from "react-toastify";
import { DetectedChangesProvider } from "@/hooks/DetectedChanges";
import DetectedChangesContainer from "@/components/DetectedChanges";
import "react-toastify/dist/ReactToastify.css";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthUserProvider>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Flip}
        // className={"text-blue-500 bg-bg-800"}
        toastClassName={"bg-bg-950"}
        // bodyClassName="toast"
        // progressStyle={{ background: "#8423d9" }}
        // toastStyle={{ background: "#0F0F13" }} // Why can't I use tailwind here? 'toastClassName' doesn't work.
      />
      <DetectedChangesProvider>
        {children}
        <DetectedChangesContainer />
      </DetectedChangesProvider>
    </AuthUserProvider>
  );
}
