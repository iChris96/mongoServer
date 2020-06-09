import mongoose, { Schema, model, Document } from 'mongoose';

export interface IAfluencyStation extends Document {
	station: String;
	afluency: number;
}

const AfluencyStation = new Schema({
	station: { type: String, required: true, unique: false },
	afluency: { type: Number, required: true }
});

export default mongoose.model<IAfluencyStation>('afluencyStation', AfluencyStation);
