import mongoose from "mongoose";

const fieldSchema = new mongoose.Schema(
  {
    x: {
      type: Number,
      required: true,
    },

    y: {
      type: Number,
      required: true,
    },

    fontSize: {
      type: Number,
      default: 24,
    },

    color: {
      type: String,
      default: "#000000",
    },

    fontWeight: {
      type: String,
      default: "normal",
    },

    textAlign: {
      type: String,
      enum: ["left", "center", "right"],
      default: "center",
    },
  },
  { _id: false }
);

const templateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    imagePath: {
      type: String,
      required: true,
    },

    resultNumber: fieldSchema,

    categoryName: fieldSchema,

    group: fieldSchema,

    winners: {
      startX: {
        type: Number,
        required: true,
      },

      startY: {
        type: Number,
        required: true,
      },

      gapY: {
        type: Number,
        required: true,
      },

      fontSize: {
        type: Number,
        default: 24,
      },

      color: {
        type: String,
        default: "#000000",
      },

      textAlign: {
        type: String,
        enum: ["left", "center", "right"],
        default: "center",
      },
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Template = mongoose.model("Template", templateSchema);

export default Template;