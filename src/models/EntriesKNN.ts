import mongoose, { Schema, Document } from 'mongoose';
export interface IEntriesKnn extends Document {
	station: String;
	day: Number;
	hour: Number;
	minutes: Number;
	entries: Number;
}

const EntriesKnnSchema = new Schema(
	{
		station: { type: String, required: true, unique: false },
		day: { type: Number, required: true, unique: false },
		hour: { type: Number, required: true, unique: false },
		minutes: { type: Number, required: true, unique: false },
		entries: { type: Number, required: true, unique: false }
	},
	{ _id: false }
);

EntriesKnnSchema.set('toObject', {
	versionKey: false,
	transform: (doc: any, ret: any) => {
		delete ret.__v;
		return ret;
	}
});

export default mongoose.model<IEntriesKnn>(
	'Entries',
	EntriesKnnSchema,
	'entriesKNN'
);
