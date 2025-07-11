// pages/jobs/index.tsx
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../../components/ui/button";
import React from "react";

async function getJobs() {
  const res = await fetch("/api/jobs");
  return res.json();
}

export default function JobsPage() {
  const { data: session } = useSession();
  const { data: jobs, isLoading } = useQuery({ queryKey: ["jobs"], queryFn: getJobs });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Job Opportunities</h1>
      {session?.user ? (
        <div className="grid gap-4">
          {jobs?.map((job: { id: string; title: string; company: string }) => (
            <div key={job.id} className="p-4 border rounded">
              <h2 className="text-xl">{job.title}</h2>
              <p>{job.company}</p>
              <Button>Apply Now</Button>
            </div>
          ))}
        </div>
      ) : (
        <p>Please sign in to view jobs.</p>
      )}
    </div>
  );
}