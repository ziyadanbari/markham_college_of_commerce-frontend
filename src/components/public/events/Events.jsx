import React from "react";
import EventCard from "./EventCard.jsx";

export default function Events({ events, setEvents }) {
  return (
    <div className="flex flex-col h-full gap-10">
      <div className="text-4xl font-semibold -tracking-wide">
        Programmed Events:
      </div>
      <div className="w-full h-full grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-4">
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
          <div className="text-4xl font-bold -tracking-wide">
            No event found
          </div>
        )}
      </div>
    </div>
  );
}
