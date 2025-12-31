import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true},
  username: { type: String, required: true, unique: true, trim: true, lowercase: true, minlength: 3, maxlength: 20, match: /^[a-z0-9_]+$/},
  email: { type: String, required: true, unique: true, trim: true, lowercase: true, match: /^[^\s@]+@[a-zA-Z0-9.-]+\.(ac\.in|edu|edu\.in)$/i},
  password: {type: String, required: true, minlength: 8, select: false},
  role: { type: String, enum: ['Student', 'Club'], default: 'Student'},
  college: {type: mongoose.Schema.Types.ObjectId, ref:'College'},
  isVerified: {type: Boolean, default: false},
  resumeLink: {type: String, trim: true},
  githubProfile: {type: String, trim: true, match: /^https:\/\/(www\.)?github\.com\/[A-Za-z0-9_-]+$/},
  interests: [{type: String, trim: true}],
  skills: [{type: String, trim: true}],
  participatedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event'}],
  hostedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event'}],
}, {timestamps: true})

export default mongoose.model('User', userSchema)