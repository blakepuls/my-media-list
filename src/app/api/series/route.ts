import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";

import type { Database } from "@/utils/database.types";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const supabase = createClient();

  // get profile
  const test = await supabase
    .from("profiles")
    .select("*")
    .eq("id", "cab28d5e-0871-4f10-81ab-33532e412367")
    .single();

  // update profile
  const test2 = await supabase
    .from("profiles")
    .update({ username: "test" })
    .eq("id", "cab28d5e-0871-4f10-81ab-33532e412367")
    .single();

  console.log("get", test);
  console.log("\n");
  console.log("update", test2);

  // if (!session) {
  //   // this is a protected route - only users who are signed in can view this route
  //   redirect('/')
  // }

  return NextResponse.json({
    message: "Hello World",
  });
}
