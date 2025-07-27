import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import { Editor } from "@/components/Editor";
import { headers } from "next/headers";

interface NotePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function NotePage({ params }: NotePageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { id } = await params;

  if (!session) {
    redirect("/auth/signin");
  }

  const note = await prisma.note.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
  });

  if (!note) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={session.user} />
      <Editor note={note} />
    </div>
  );
}
