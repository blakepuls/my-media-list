"use client";

import Search from "@/components/Search";
import SeriesContainer from "@/components/Series/SeriesContainer";
import Tooltip from "@/components/Tooltip";
import firebase from "firebase/app";
import { addDoc, collection } from "firebase/firestore";
import Image from "next/image";
import { useState, useEffect } from "react";
import Typist from "react-typist";

const actions = ["Track", "Rate", "Share"];

export default function Home() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const nextIndex = (index + 1) % actions.length;
    const timer = setTimeout(() => setIndex(nextIndex), 1500);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <main className="flex flex-col items-center justify-between w-full">
      <div className="text-md sm:text-5xl font-bold mt-16 flex  flex-col items-center gap-3 justify-center">
        <div className=" ">
          <h1 className="font-bold sm:mb-3 flex gap-1 sm:gap-4 ">
            <div>One Place to </div>
            <div className="w-14 sm:w-32">
              {index < actions.length && (
                <Typist className="text-primary-500" key={actions[index]}>
                  {actions[index]}
                </Typist>
              )}
            </div>
          </h1>
          {/* <h1 className="text-5xl font-bold ">Your Favorites.</h1> */}
        </div>
        <Search />
      </div>
    </main>
  );
}
