"use client";
import Events from "@/components/public/events/Events.jsx";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Gallery() {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    async function fetchEvents() {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_HOST}/event/get`
      );
      setEvents(response?.data?.events);
    }
    fetchEvents();
  }, []);
  return (
    <div className="h-full w-full py-8 sm:px-10 px-6">
      <Events events={events} setEvents={setEvents} />
    </div>
  );
}
