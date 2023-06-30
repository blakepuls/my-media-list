import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";
import "server-only";

import type { Database } from "@/utils/database.types";

export const createClient = () => {};
