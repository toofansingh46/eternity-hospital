import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["Administrator", "Receptionist", "Doctor", "Nurse", "Pharmacist", "Accountant", "Laboratory Staff"],
      default: "Receptionist",
    },
    avatarColor: { type: String, default: "#0E7490" },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeObject = function () {
  const { _id, name, email, role, avatarColor } = this;
  return { id: _id, name, email, role, avatarColor };
};

export default mongoose.model("User", userSchema);
