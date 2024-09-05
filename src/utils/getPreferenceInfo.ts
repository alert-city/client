"use server";
import { routing } from "@/i18n/routing";
import { cookies } from "next/headers";

export async function getPreferenceInfo() {
  const cookieStore = cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || routing.defaultLocale;
  const theme = cookieStore.get("theme")?.value || "light";
  return { locale, theme };
}
