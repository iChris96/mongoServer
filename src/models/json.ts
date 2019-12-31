import { Schema, model } from 'mongoose';
import { ObjectId } from 'mongodb';

const TripSchema = new Schema({
    TripID: String,
    Destination:String,
    Position: {
        Timestamp:Number,
        Train:String,
        Lat: Number,
        Long: Number,
        Heading:Number
    },
    Predictions: {
        StopID: String,
        Stop:String,
        Seconds: Number
    }
},{ _id : false })

const JsonSchema = new Schema({
    TripList: {
        trainID: ObjectId,
        CurrentTime: Number,
        Line: String,
        Trips: [TripSchema]
    }
})
 


export default model('Json', JsonSchema);