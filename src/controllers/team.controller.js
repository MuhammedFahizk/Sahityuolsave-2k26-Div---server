import { Team } from '../models/index.js';

// ── GET ALL TEAMS ──
// GET /api/teams
// Public
export const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find().sort({ totalPoints: -1 }); 
    res.status(200).json({
      success: true,
      count:   teams.length,
      data:    teams,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ── GET SINGLE TEAM ──
// GET /api/teams/:id
// Public
export const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found',
      });
    }

    res.status(200).json({
      success: true,
      data:    team,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ── CREATE TEAM ──
// POST /api/teams
// Protected — admin only
export const createTeam = async (req, res) => {
  try {
    const { name, description, color, managerName, totalMembers } = req.body;

    // Check required field
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Team name is required',
      });
    }

    // Check duplicate name
    const existing = await Team.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Team name already exists',
      });
    }

    const team = await Team.create({
      name,
      description,
      color,
      managerName,
      totalMembers,
    });

    res.status(201).json({
      success: true,
      message: 'Team created successfully',
      data:    team,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ── UPDATE TEAM ──
// PUT /api/teams/:id
// Protected — admin only
export const updateTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found',
      });
    }

    const updated = await Team.findByIdAndUpdate(
      req.params.id,
      req.body,          // update with whatever fields admin sends
      {
        new:          true,  // return updated document
        runValidators: true, // run schema validations on update
      }
    );

    res.status(200).json({
      success: true,
      message: 'Team updated successfully',
      data:    updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ── DELETE TEAM ──
// DELETE /api/teams/:id
// Protected — admin only
export const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found',
      });
    }

    await Team.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Team deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};