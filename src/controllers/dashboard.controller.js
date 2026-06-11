import { Team }   from '../models/index.js';
import { Result } from '../models/index.js';

export const getStats = async (req, res) => {
  try {
    const [
      totalTeams,
      totalResults,
    ] = await Promise.all([
      Team.countDocuments(),
      Result.countDocuments(),
    ]);

    // Get total entries across all results
    const entriesAgg = await Result.aggregate([
      { $project: { entryCount: { $size: '$entries' } } },
      { $group:   { _id: null, total: { $sum: '$entryCount' } } },
    ]);
    const totalEntries = entriesAgg[0]?.total || 0;

    // Top team by points
    const topTeam = await Team.findOne().sort({ totalPoints: -1 });

    res.status(200).json({
      success: true,
      data: {
        totalTeams,
        totalResults,
        totalEntries,
        topTeam: topTeam
          ? { name: topTeam.name, points: topTeam.totalPoints, color: topTeam.color }
          : null,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};