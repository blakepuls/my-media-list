"use client";

import { SeriesCard } from "@/components/SeriesCard";
import React, { useEffect, useState } from "react";

interface Series {}

function Series() {}

export default function Profile() {
  function test() {
    fetch("/api/series/tmdb/123", {
      method: "POST",
      body: JSON.stringify({
        priority: 1,
      }),
    });
  }

  return (
    <main className="flex flex-col items-center gap-3 mt-10 w-full"></main>
  );
}
