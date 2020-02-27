import mongoose, { Schema, model, Document } from 'mongoose';
import { type } from 'os';

export interface IEntries extends Document {
	station: String;
	datetime: String;
	entries: Number;
}

const EntriesSchema = new Schema({
	station: { type: String, required: true, unique: false },
	datetime: { type: String, required: true, unique: false },
	entries: { type: Number, required: true, unique: false }
});

export default mongoose.model<IEntries>('Entries', EntriesSchema, 'entries');
