import React from "react";
import EventCard from "./EventCard.jsx";

export default function Events({ events, setEvents }) {
  return (
    <div className="w-full h-full grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
      {events?.length ? (
        events.map(({ eventPhoto, eventName, eventDate }) => (
          <EventCard
            key={eventName}
            eventPhoto={eventPhoto}
            eventName={eventName}
            eventDate={eventDate}
          />
        ))
      ) : (
        <div className="text-4xl font-bold -tracking-wide">No event found</div>
      )}
    </div>
  );
}
