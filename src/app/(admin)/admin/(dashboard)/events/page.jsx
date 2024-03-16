"use client";
import Button from "@/components/Button.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import AddEventForm from "../components/AddEventForm.jsx";
import axios from "axios";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import EventsShow from "@/components/public/events/Events.jsx";

export default function Events() {
  const [showAddEventForm, setShowAddEventForm] = useState(false);
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
    <>
      <div className="h-full w-full py-8 sm:px-10 px-6">
        <div className="flex flex-col items-center gap-5">
          <div
            className="self-end"
            onClick={() => setShowAddEventForm((prev) => !prev)}>
            <Button
              text={
                <div className="flex items-center gap-3">
                  <div>
                    <FontAwesomeIcon icon={faPlus} />
                  </div>
                  <div>Add event</div>
                </div>
              }
            />
          </div>
          <div className="w-full">
            <EventsShow events={events} setEvents={setEvents} />
          </div>
        </div>
      </div>
      {showAddEventForm && (
        <div className="absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 bg-black/40 w-screen h-screen z-50">
          <div className="flex items-center justify-center w-full h-full">
            <div>
              <AddEventForm
                setShowAddEventForm={setShowAddEventForm}
                setEvents={setEvents}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
