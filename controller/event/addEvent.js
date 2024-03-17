const Event = require("../../model/events.js");
const crypto = require("crypto");
async function addEvent(req, res) {
  try {
    const { eventName, eventDate } = req.body || {};
    let photos = req.files["eventPhoto[]"] || {};
    const event = new Event({
      eventName,
      eventDate,
    });
    if (photos) {
      photos.forEach((eventPhoto) => {
        const randomName = `${crypto.randomBytes(10).toString("hex")}.png`;
        const path = `${__dirname}/../../uploads/${randomName}`;
        eventPhoto.mv(path);
        event.eventPhoto.push({
          photoUrl: `${process.env.SERVER_URL}/uploads/${randomName}`,
        });
      });
    }
    await event.save();
    const events = await Event.find({});
    res.status(200).json({ events });
  } catch (error) {
    if (error.code === 11000) throw [409, "Event already exist"];
    throw error;
  }
}
module.exports = addEvent;
