import type { Metadata } from "next";

import { FieldNotes } from "@/components/FieldNotes";
import { getPages } from "@/lib/content";

export const metadata: Metadata = {
  title: "Field notes",
  description:
    "How the first eleven Ninebark jackets were made, what came back, and what changed as a result.",
};

export default async function FieldNotesPage() {
  const pages = await getPages();

  return <FieldNotes content={pages.fieldNotes.notes} headingLevel="h1" />;
}
