const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String, // Password is optional for wallet-based users
    },
    walletAddress: {
      type: String, // Unique for wallet-based users
      unique: true,
      sparse: true, // Allows `walletAddress` to be optional for password-based users
    },
    role: {
      type: String,
      enum: ["Customer", "Talent"],
      required: true,
    },
    postedFullTimeJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FullTimeJob",
      },
    ],
    postedFreelanceJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FreelanceJob",
      },
    ],
    personalInfo: {
      name: String,
      website: String,
      country: String,
      bio: String,
      skills: [String],
      profileImage: String,
    },
    workExperience: [
      {
        company: String,
        role: String,
        years: String,
        currentlyWorking: Boolean,
        description: String,
      },
    ],
    education: [
      {
        institution: String,
        graduationYear: String,
        levelOfStudy: String,
        major: String,
      },
    ],
    socialLinks: {
      linkedin: String,
      facebook: String,
      twitter: String,
    },
    freelanceInfo: {
      specialization: String,
      hourlyRate: String,
      preferredPaymentOptions: [String],
      portfolio: [
        {
          projectName: String,
          description: String,
          files: [String],
        },
      ],
    },
    fullTimeInfo: {
      position: String,
      experience: String,
      cvFile: String,
    },
    contactInfo: {
      email: String,
      linkedin: String,
      github: String,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Middleware to hash passwords before saving the user (for password-based signup)
userSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// Method to compare passwords during login
userSchema.methods.comparePassword = async function (password) {
  if (!this.password) return false; // No password set for wallet-based users
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
