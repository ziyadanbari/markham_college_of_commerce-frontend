"use client";

import Button from "@/components/Button.jsx";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useForm } from "react-hook-form";

export default function AddEventForm({ setShowAddEventForm, setEvents }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (values) => {
    const form = new FormData();
    const {
      event_name: eventName,
      event_date: eventDate,
      event_photo: eventPhoto,
    } = values;
    const data = {
      eventName,
      eventDate,
      eventPhoto: eventPhoto[0],
    };
    for (let key in data) {
      form.append(key, data[key]);
    }
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_HOST}/event/add`,
      form
    );
    setEvents(response.data.events);
  };
  return (
    <div>
      <div className="bg-gray-300 p-6 rounded shadow-lg space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="text-2xl font-semibold">Add Event</div>
          <div
            onClick={() => setShowAddEventForm(false)}
            className="cursor-pointer">
            <FontAwesomeIcon icon={faX} />
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center flex-col gap-3 [&>*]:w-full">
            <label htmlFor="event_name">Event Name:</label>
            <input
              className="px-4 py-2 outline-none rounded"
              id="event_name"
              placeholder="Event name"
              {...register("event_name", {
                required: "Event name is missed!", // Change 'message' to 'required'
              })}
            />
            <div className="text-left text-red-500">
              {errors.event_name && errors.event_name.message}
            </div>
            <label htmlFor="event_date">Event Date:</label>
            <input
              type="date"
              className="px-4 py-2 outline-none rounded"
              id="event_date"
              placeholder="Event date"
              {...register("event_date", {
                required: "Event date is missed!", // Change 'message' to 'required'
              })}
            />
            <div className="text-left text-red-500">
              {errors.event_date && errors.event_date.message}
            </div>
            <label htmlFor="event_photo">Event Photo:</label>
            <input
              type="file"
              accept="image/*"
              className="px-4 py-2 outline-none rounded bg-white"
              id="event_photo"
              placeholder="Event photo"
              {...register("event_photo", {
                required: "Event photo is missed!", // Change 'message' to 'required'
              })}
            />
            <div className="text-left text-red-500">
              {errors.event_photo && errors.event_photo.message}
            </div>
            <Button text={"Add Event"} className={"rounded"} />
          </div>
        </form>
      </div>
    </div>
  );
}
