import ImageGallery from "react-image-gallery";
export default function EventCard({ eventPhoto, eventName, eventDate }) {
  if (eventPhoto instanceof Array)
    eventPhoto = eventPhoto
      .map(({ photoUrl }) => ({ original: photoUrl }))
      .filter((ele) => ele.original);
  return (
    <div className="bg-gray-300 rounded shadow-lg flex flex-col gap-3 [&>*]:w-full p-2">
      <div className="flex-1">
        <div>
          {eventPhoto instanceof Array ? (
            <ImageGallery
              items={eventPhoto}
              infinite={true}
              showFullscreenButton={false}
              showPlayButton={false}
            />
          ) : (
            <img src={eventPhoto} className="w-full h-full" />
          )}
        </div>
      </div>
      <div className="text-2xl font-semibold">{eventName}</div>
      <div className="text-base text-gray-500 font-bold">
        Event at: {new Date(eventDate).toDateString()}
      </div>
    </div>
  );
}
