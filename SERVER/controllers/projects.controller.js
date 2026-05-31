import { isValidObjectId } from "mongoose";
import Project from "../models/projects.model.js";

export const getAllProjects = async (req, res, next) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (error) {
        next({ msg: error.message });
    }
};

export const getProjectsById = async (req, res, next) => {
    try {
        if (!isValidObjectId(req.params.id)) return res.status(404).json({ error: "Project not found" });

        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ error: "Project not found" });

        res.json(project);
    } catch (error) {
        next({ msg: error.message });
    }
};

export const addProject = async (req, res, next) => {
    try {
        const newProject = new Project(req.body);
        await newProject.save();
        res.status(201).json(newProject);
    } catch (error) {
        next({ msg: error.message, type: 'validation', status: 400 });
    }
};

export const updateProject = async (req, res, next) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!project) return res.status(404).json({ error: "Project not found" });

        res.json(project);
    } catch (error) {
        next({ msg: error.message });
    }
};

export const deleteProject = async (req, res, next) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) return res.status(404).json({ error: "Project not found" });

        res.status(204).end();
    } catch (error) {
        next({ msg: error.message });
    }
};
