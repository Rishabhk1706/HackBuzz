import Event from "../models/Event.js";

function validateTimes(startTime, endTime) {
  if (!startTime || !endTime) return true; 
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);

  if (eh < sh || (eh === sh && em <= sm)) {
    return false;
  }
  return true;
}

export const getAllEvents = async (req, res) => {
  const events = await Event.find()
    .populate("createdBy", "name email")
    .populate("college", "name");
  res.status(200).json(events);
};

export const getEventById = async (req, res) => {
  const event = await Event.findById(req.params.id)
    .populate("createdBy", "name")
    .populate("college", "name")
    .populate({
      path: "registeredUsers",
      select: "name email college",
      populate: { path: "college", select: "name" }
    });

  res.status(200).json(event);
};

export const createEvent = async (req, res) => {
  try {
    const { startTime, endTime } = req.body;

    if (!validateTimes(startTime, endTime)) {
      return res.status(400).json({ error: "End time must be after start time." });
    }

    const newEvent = new Event(req.body);
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Create event error:", error);
    res.status(500).json({ error: "Server error while creating event." });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { startTime, endTime } = req.body;

    if (startTime && endTime && !validateTimes(startTime, endTime)) {
      return res.status(400).json({ error: "End time must be after start time." });
    }

    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    console.error("Update event error:", error);
    res.status(500).json({ error: "Server error while updating event." });
  }
};

export const deleteEvent = async (req, res) => {
  const deleted = await Event.findByIdAndDelete(req.params.id);
  res.status(200).json(deleted);
};

export const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    if (event.registeredUsers.includes(req.user.id)) {
      return res.status(400).json({ error: "You are already registered for this event." });
    }

    if (event.isFull()) {
      return res.status(400).json({ error: "Event has reached max participants." });
    }

    event.registeredUsers.push(req.user.id);
    await event.save();

    res.status(200).json({ message: "Successfully registered for the event." });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server error while registering." });
  }
};