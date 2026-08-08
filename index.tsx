import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CareerPilot — Smart Career & Job Management Platform" },
      {
        name: "description",
        content:
          "CareerPilot helps students discover jobs, build resumes, track applications and plan interviews in one dashboard.",
      },
      { property: "og:title", content: "CareerPilot — Smart Career & Job Management Platform" },
      {
        property: "og:description",
        content: "Discover jobs, build your resume and track every application in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    window.location.replace("/careerpilot/index.html");
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">CareerPilot</h1>
        <p className="mt-2 text-sm text-muted-foreground">Opening your career dashboard…</p>
        <a className="mt-4 inline-block text-sm underline" href="/careerpilot/index.html">
          Continue to CareerPilot
        </a>
      </div>
    </div>
  );
}
