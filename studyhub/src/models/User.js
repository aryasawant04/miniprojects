import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bundle" }],
    purchases: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bundle" }]
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
