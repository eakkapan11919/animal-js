const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ตรวจสอบค่าตัวแปรจาก .env
console.log('MONGO_URI:', process.env.MONGODB_URI);
console.log('PORT:', process.env.PORT);

// เชื่อมต่อ MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// สร้าง Schema และ Model
const animalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: String, required: true },
});

const Animal = mongoose.model('Animal', animalSchema);

// Routes

// GET: ดึงรายการสัตว์ทั้งหมด
app.get('/api/animals', async (req, res) => {
  try {
    const animals = await Animal.find();
    res.json(animals);
  } catch (error) {
    console.error('Error fetching animals:', error.message);
    res.status(500).json({ error: 'Failed to fetch animals' });
  }
});

// POST: เพิ่มสัตว์ใหม่
app.post('/api/animals', async (req, res) => {
  try {
    const newAnimal = new Animal(req.body);
    await newAnimal.save();
    console.log('Animal added:', req.body);
    res.json({ message: 'Animal added successfully', animal: newAnimal });
  } catch (error) {
    console.error('Error adding animal:', error.message);
    res.status(500).json({ error: 'Failed to add animal' });
  }
});

// DELETE: ลบสัตว์ตาม ID
app.delete('/api/animals/:id', async (req, res) => {
  try {
    await Animal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Animal deleted successfully' });
  } catch (error) {
    console.error('Error deleting animal:', error.message);
    res.status(500).json({ error: 'Failed to delete animal' });
  }
});

// รันเซิร์ฟเวอร์
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
