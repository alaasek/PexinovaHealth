import mongoose from 'mongoose';

const MedicationSchema = new mongoose.Schema({
  name: String,
  dosage: String,
  time: String,
  category: String,
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: false }, // optional for OAuth users
  dob: { type: String, default: null },
  disease: { type: String, default: null },
  medications: { type: [MedicationSchema], default: [] },
}, { timestamps: true });

export default mongoose.model('User', UserSchema);

