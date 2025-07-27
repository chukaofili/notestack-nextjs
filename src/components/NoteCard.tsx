import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  const preview =
    note.content.length > 150
      ? note.content.substring(0, 150) + "..."
      : note.content;

  return (
    <Link href={`/notes/${note.id}`}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader>
          <CardTitle className="line-clamp-2">{note.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {preview || "No content"}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
