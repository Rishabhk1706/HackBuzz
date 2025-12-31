import ProjectPosting from "../models/ProjectPosting.js";

export const getAllProjects = async (req, res) => {
  const projects = await ProjectPosting.find()
    .populate("postedBy", "name email")
    .populate("selectedUsers.user", "name");
  res.status(200).json(projects);
};

export const getProjectById = async (req, res) => {
  const project = await ProjectPosting.findById(req.params.id)
    .populate("postedBy", "name")
    .populate("selectedUsers.user", "name email")
    .populate("applicants.user", "_id name email");
  res.status(200).json(project);
};

export const createProject = async (req, res) => {
  const newProject = new ProjectPosting(req.body);
  await newProject.save();
  res.status(201).json(newProject);
};

export const updateProject = async (req, res) => {
  try {
    const project = await ProjectPosting.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });

    const { $push, $pull, ...rest } = req.body;
                                           
    if ($push?.selectedUsers) {
      project.selectedUsers.push($push.selectedUsers);
    }

    if ($pull?.selectedUsers) {
      const userIdToRemove = $pull.selectedUsers.user?.toString?.();
      project.selectedUsers = project.selectedUsers.filter(
        entry => entry.user?.toString() !== userIdToRemove
      );
    }

    Object.assign(project, rest);

    await project.save();

    res.status(200).json(project);
  } catch (err) {
    console.error("Error updating project:", err);
    res.status(500).json({ error: "Failed to update project" });
  }
};

export const deleteProject = async (req, res) => {
  const deleted = await ProjectPosting.findByIdAndDelete(req.params.id);
  res.status(200).json(deleted);
};

export const applyToProject = async (req, res) => {
  const project = await ProjectPosting.findById(req.params.id);
  if (!project) return res.status(404).json({ error: "Project not found" });

  const alreadyApplied = project.applicants.some(app => {
    const appUserId = app.user?.toString?.();
    const reqUserId = req.user._id?.toString?.();
    return appUserId === reqUserId;
  });
  if (alreadyApplied) return res.status(400).json({ error: "Already applied" });

  project.applicants.push({
    user: req.user.id,
    message: req.body.message || ""
  });

  await project.save();
  res.status(200).json({ success: true, message: "Applied successfully" });
};