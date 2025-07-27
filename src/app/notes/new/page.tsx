import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Navbar } from "@/components/Navbar";
import { Editor } from "@/components/Editor";
import { headers } from "next/headers";

export default async function NewNotePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={session.user} />
      <Editor isNew />
    </div>
  );
}
