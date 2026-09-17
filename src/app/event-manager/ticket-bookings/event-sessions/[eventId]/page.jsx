"use client";
import EventSessionsPage from "../../EventSessionPage";
import { useSearchParams } from "next/navigation";

export default function Page({ params }) {

  const { eventId } = params; // yaha se direct URL ka param milega
  console.log(eventId, "Event Id from params");

  console.log(eventId, "Event Id");

  if (!eventId) return <div>Loading Event...</div>;

  return <EventSessionsPage eventId={eventId} />;
}
