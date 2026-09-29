import type { Metadata } from "next";

import { Reports } from "@/components/Reports";
import { getPages, getReports } from "@/lib/content";

export const metadata: Metadata = {
  title: "Field reports",
  description:
    "Reviews from hunters who wore the gear through a full season, each one listed with the conditions it was tested in.",
};

export default async function ReportsPage() {
  const [pages, reports] = await Promise.all([getPages(), getReports()]);

  return (
    <Reports content={pages.reports.reports} reports={reports} headingLevel="h1" />
  );
}
