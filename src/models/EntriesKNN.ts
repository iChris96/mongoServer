import mongoose, { Schema, model, Document } from 'mongoose';
import { type } from 'os';

export interface IEntriesKnn extends Document {
	station: String;
	entries: Number;
	day: Number;
	hour: Number;
	minutes: Number;
}

const EntriesKnnSchema = new Schema(
	{
		station: { type: String, required: true, unique: false },
		entries: { type: Number, required: true, unique: false },
		day: { type: Number, required: true, unique: false },
		hour: { type: Number, required: true, unique: false },
		minutes: { type: Number, required: true, unique: false }
	},
	{ _id: false }
);

export default mongoose.model<IEntriesKnn>(
	'Entries',
	EntriesKnnSchema,
	'entriesKNN'
);
