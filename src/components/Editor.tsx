"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface EditorProps {
  note?: Note;
  isNew?: boolean;
}

export function Editor({ note, isNew = false }: EditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const saveNote = useCallback(async () => {
    if (!title.trim()) return;
    if (isDeleting) return;

    setIsSaving(true);
    try {
      const url = isNew ? "/api/notes" : `/api/notes/${note?.id}`;
      const method = isNew ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), content }),
      });

      if (!response.ok) {
        throw new Error("Failed to save note");
      }

      const savedNote = await response.json();
      setLastSaved(new Date());

      if (isNew) {
        router.push(`/notes/${savedNote.id}`);
      }
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setIsSaving(false);
    }
  }, [title, content, isNew, note?.id, router]);

  const deleteNote = async () => {
    if (!note?.id || !confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/notes/${note.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/dashboard");
      }
    } catch (error) {
      setIsDeleting(false);
      console.error("Delete error:", error);
    }
  };

  // Autosave after 2 seconds of inactivity
  useEffect(() => {
    if (!title.trim()) return;

    const timeoutId = setTimeout(saveNote, 2000);
    return () => clearTimeout(timeoutId);
  }, [title, content, saveNote, isDeleting]);

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="flex items-center space-x-2">
          {lastSaved && (
            <span className="text-sm text-muted-foreground">
              Saved {lastSaved.toLocaleTimeString()}
            </span>
          )}
          {isSaving && (
            <span className="text-sm text-muted-foreground">Saving...</span>
          )}
          {!isNew && (
            <Button variant="outline" size="sm" onClick={deleteNote}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            <Input
              placeholder="Note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-semibold border-none shadow-none focus-visible:ring-0 p-0"
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Start writing your note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[500px] border-none shadow-none focus-visible:ring-0 resize-none text-base"
          />
        </CardContent>
      </Card>
    </div>
  );
}
