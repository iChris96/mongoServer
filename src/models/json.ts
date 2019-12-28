import { Schema, model } from 'mongoose';

const JsonSchema = new Schema({
    TripList: {
        CurrentTime: Number,
        Line: String,
        Trips: [{
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
        }]
    }
})

export default model('Json', JsonSchema);