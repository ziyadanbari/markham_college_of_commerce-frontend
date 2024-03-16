import React from "react";

export default function EventCard({ eventPhoto, eventName, eventDate }) {
  return (
    <div className="bg-gray-300 rounded shadow-lg flex flex-col gap-3 [&>*]:w-full p-2">
      <div className="flex-1">
        <img src={eventPhoto} className="w-full h-full" />
      </div>
      <div className="text-lg font-semibold">{eventName}</div>
      <div className="text-sm font-bold">
        Event at: {new Date(eventDate).toDateString()}
      </div>
    </div>
  );
}
