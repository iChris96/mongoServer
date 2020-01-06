"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongodb_1 = require("mongodb");
const TripSchema = new mongoose_1.Schema({
    TripID: String,
    Destination: String,
    Position: {
        Timestamp: Number,
        Train: String,
        Lat: Number,
        Long: Number,
        Heading: Number
    },
    Predictions: {
        StopID: String,
        Stop: String,
        Seconds: Number
    }
}, { _id: false });
const JsonSchema = new mongoose_1.Schema({
    TripList: {
        trainID: mongodb_1.ObjectId,
        CurrentTime: Number,
        Line: String,
        Trips: [TripSchema]
    }
});
exports.default = mongoose_1.model('Json', JsonSchema);
//# sourceMappingURL=json.js.map