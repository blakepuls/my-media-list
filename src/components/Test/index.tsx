"use client";

import { addSeriesList, removeSeriesList } from "@/utils";
import { IAnimeResult, IMovieResult, IMangaResult } from "@consumet/extensions";
import { useState } from "react";
import { AiFillTrophy, AiFillStar } from "react-icons/ai";
import { BsFillBookmarkPlusFill } from "react-icons/bs";
import { toast } from "react-toastify";
import Skeleton from "../Skeleton";
import { Database } from "@/types/database.types";

interface TestProps {
  data: any;
}

export default function Test({ data }: TestProps) {
  return (
    <button className="btn-primary " onClick={() => console.log(data)}>
      Test
    </button>
  );
}
