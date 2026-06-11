import mongoose from 'mongoose';

// ── Entry Sub-Schema (inside entries array) ──
const entrySchema = new mongoose.Schema(
    {
        position: {
            type: Number,
            required: [true, 'Position is required'],
        },
        participantName: {
            type: String,
            required: [true, 'Participant name is required'],
            trim: true,
        },

        teamId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Team',
            required: [true, 'Team is required'],
        },
        points: {
            type: Number,
            default: 0,
        },
        grade : {
            type: String,
            default: '',
        }
         

    },
    { _id: true } // each entry gets its own _id — useful for editing one entry
);

// ── Result Main Schema ──
const resultSchema = new mongoose.Schema(
    {
        resultNumber: {
            type: Number,
            required: [true, 'Result number is required'],
            unique: true,
        },
        categoryName: {
            type: String,
            required: [true, 'Category name is required'],
            trim: true,
        },
        group: {
            type: String,
            trim: true,
            default: '',
        },
        published: {
            type: Boolean,
            default: false,
        },
        entries: {
            type: [entrySchema],
            validate: {
                validator: (arr) => arr.length > 0,
                message: 'At least one entry is required',
            },
        },
        resultUrl: {
            type: String,
            default: '',

        },
    },
    {
        timestamps: true,
    }
);

// ── Index for fast filtering ──
// This makes group + categoryName queries very fast
resultSchema.index({ group: 1 });
resultSchema.index({ categoryName: 1 });
resultSchema.index({ group: 1, categoryName: 1 });

const Result = mongoose.model('Result', resultSchema);

export default Result;