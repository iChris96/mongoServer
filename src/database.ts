import mongoose from 'mongoose';

export default async function connect() {
	try {
		await mongoose.connect('mongodb://localhost/modularDB', {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true
		});
		console.log('Db Connected');
	} catch (error) {
		console.log(`Imposible to connect to Database, Error: ${error}.`);
	}
}
