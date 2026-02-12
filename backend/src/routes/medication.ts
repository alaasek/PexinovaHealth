// routes/medication.ts
import express from 'express';
import Medication from '../models/Medication';
import User from '../models/User';

const router = express.Router();

router.post('/add', async (req, res) => {
  const { email, name, dosage, time, category } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.json({ success: false });

  const medication = await Medication.create({
    userId: user._id,
    name,
    dosage,
    time,
    category,
  });

  res.json({ success: true, medication });
});
