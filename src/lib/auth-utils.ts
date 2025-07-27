import { headers } from "next/headers";
import { auth } from "./auth";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

export const checkAuth = async ({ api = false }: { api?: boolean }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    if (api) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    } else {
      redirect("/auth/signin");
    }
  }

  return session;
};
