import { Schema, model } from 'mongoose';
// import { ObjectId } from 'mongodb';

const CsvSchema = new Schema({
    station: String,
    datetime: String,
    entries: Number,
    exits: Number    

})

export default model('Csv', CsvSchema);