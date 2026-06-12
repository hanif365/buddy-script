import mongoose from "mongoose";
import { REACTIONS } from "./like.validator";

const likeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    targetType: { type: String, enum: ["post", "comment"], required: true },
    target: { type: mongoose.Schema.Types.ObjectId, required: true },
    reaction: { type: String, enum: REACTIONS, default: "like" },
  },
  { timestamps: true }
);

likeSchema.index({ user: 1, targetType: 1, target: 1 }, { unique: true });
likeSchema.index({ targetType: 1, target: 1 });

const Like = mongoose.model("Like", likeSchema);

export default Like;
