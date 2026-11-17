import mongoose from 'mongoose';

const drinkSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  priceSatang: { type: Number, required: true, min: 0, validate: Number.isInteger },
  available: { type: Boolean, required: true }
}, { collection: 'drinks', bufferCommands: false });

export const Drink = mongoose.model('Drink', drinkSchema);
