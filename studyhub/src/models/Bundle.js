import mongoose from "mongoose";

const noteItemSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    fileUrl: String,
    contributor: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { _id: false }
);

const bundleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    subjects: [String],
    priceCents: { type: Number, required: true },
    notes: [noteItemSchema],
    isPublished: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Bundle", bundleSchema);
