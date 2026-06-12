import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Team name is required'],
      unique:   true,
      trim:     true,
    },
    description: {
      type:    String,
      trim:    true,
      default: '',
    },
    color: {
      type:    String,
      trim:    true,
      default: '#000000',
    },
    managerName: {
      type:    String,
      trim:    true,
      default: '',
    },
    logoUrl: {
      type:    String,
      default: '',
    },
    totalMembers: {
      type:    Number,
      default: 0,
    },
    totalPoints: {
      type:    Number,
      default: 0,
    },
     teamType: {
      type:    String,
      enum:    ['sector', 'campus'],
      default: 'sector',
    },
  },
  {
    timestamps: true, // auto adds createdAt and updatedAt
  }
);

const Team = mongoose.model('Team', teamSchema);

export default Team;