// routes/projects.js
import express from 'express';
import Project from '../models/Project.js';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get all projects for user
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.userId },
        { 'members.user': req.userId }
      ]
    }).populate('owner', 'name email')
      .populate('members.user', 'name email');
    
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create project
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, members } = req.body;
    
    const project = new Project({
      name,
      description,
      owner: req.userId,
      members: members?.map(m => ({ user: m })) || []
    });
    
    await project.save();
    await project.populate('owner', 'name email');
    await project.populate('members.user', 'name email');
    
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single project
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email');
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const isMember = project.owner._id.toString() === req.userId ||
      project.members.some(m => m.user._id.toString() === req.userId);
    
    if (!isMember) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update project
router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    if (project.owner.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Only project owner can update' });
    }
    
    const updates = ['name', 'description', 'status'];
    updates.forEach(update => {
      if (req.body[update] !== undefined) {
        project[update] = req.body[update];
      }
    });
    
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add member to project
router.post('/:id/members', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    if (project.owner.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Only project owner can add members' });
    }
    
    const { email, role } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (project.members.some(m => m.user.toString() === user._id.toString())) {
      return res.status(400).json({ error: 'User already in project' });
    }
    
    project.members.push({ user: user._id, role: role || 'member' });
    await project.save();
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default router;