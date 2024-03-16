const { writeFileSync } = require("fs");
const Event = require("../../model/events.js");
const crypto = require("crypto");
async function addEvent(req, res) {
  try {
    const { eventName, eventDate } = req.body || {};
    let { eventPhoto } = req.files || {};
    if (eventPhoto) {
      var randomName = `${crypto.randomBytes(10).toString("hex")}.png`;
      const path = `${__dirname}/../../uploads/${randomName}`;
      eventPhoto.mv(path);
    }
    await Event.create({
      eventName,
      eventDate,
      eventPhoto: `${process.env.SERVER_URL}/uploads/${randomName}`,
    });
    const events = await Event.find({});
    res.status(200).json({ events });
  } catch (error) {
    if (error.code === 11000) throw [409, "Event already exist"];
    throw error;
  }
}
module.exports = addEvent;
