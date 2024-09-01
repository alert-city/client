"use server";
import { routing } from "@/i18n/routing";
import { cookies } from "next/headers";

export async function getNextLocale() {
  const cookieStore = cookies();
  const result = cookieStore.get("NEXT_LOCALE")?.value;
  if (!result) {
    return routing.defaultLocale;
  }
  return result;
}
