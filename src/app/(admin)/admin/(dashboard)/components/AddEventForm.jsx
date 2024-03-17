"use client";

import Button from "@/components/Button.jsx";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function AddEventForm({ setShowAddEventForm, setEvents }) {
  const [eventPhotos, setEventPhotos] = useState([]);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (values) => {
    const form = new FormData();
    const {
      event_name: eventName,
      event_date: eventDate,
      event_photo: eventPhotos,
    } = values;
    form.append("eventName", eventName);
    form.append("eventDate", eventDate);
    for (let photo of eventPhotos) {
      form.append("eventPhoto[]", photo);
    }
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_HOST}/event/add`,
      form
    );
    setEvents(response.data.events);
  };
  console.log(eventPhotos);
  return (
    <div className="w-full">
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
            <label
              htmlFor="event_photo"
              className="flex flex-col gap-1 flex-wrap">
              <div>Event Photo:</div>
              <div className="w-full">
                <span
                  type="button"
                  className="bg-primary-regular hover:bg-[#f33d06] text-white font-medium py-2 px-6 rounded-full duration-500 cursor-pointer w-full text-center">
                  Add Photo
                </span>
              </div>
            </label>

            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              className="px-4 py-2 outline-none rounded bg-white"
              id="event_photo"
              placeholder="Event photo"
              {...register("event_photo", {
                required: "Event photo is missed!", // Change 'message' to 'required'
                onChange: (data) => {
                  const files = [...data.target.files];
                  setEventPhotos((prev = []) => {
                    return prev?.length ? [...prev, ...files] : [...files];
                  });
                },
              })}
            />
            <div className="text-left text-red-500">
              {errors.event_photo && errors.event_photo.message}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {eventPhotos.map((photo, i) => {
                const blobUrl = URL.createObjectURL(photo);
                return (
                  <img
                    className=" w-24 h-24 object-cover"
                    src={blobUrl}
                    key={i}
                  />
                );
              })}
            </div>
            <Button text={"Add Event"} className={"rounded"} />
          </div>
        </form>
      </div>
    </div>
  );
}
