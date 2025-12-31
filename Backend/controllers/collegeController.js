import College from "../models/College.js";

export const getColleges = async (req, res) => {
    const colleges = await College.find();
    res.status(200).json(colleges);
};

export const getCollegeById = async (req, res) => {
  const college = await College.findById(req.params.id);
  res.status(200).json(college);
};

export const createCollege = async (req, res) => {
  const newCollege = new College(req.body);
  await newCollege.save();
  res.status(201).json(newCollege);
};

export const updateCollege = async (req, res) => {
  const updated = await College.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(updated);
};

export const deleteCollege = async (req, res) => {
  const deleted = await College.findByIdAndDelete(req.params.id);
  res.status(200).json(deleted);
};
