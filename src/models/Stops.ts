import { Schema, model } from 'mongoose';

const StopsSchema = new Schema({
    geometry: {
      type: String,
      coordinates:  [ Number ]
    },
    type: String,
    properties: {
      area: String ,
      lines: [ String ],
      id: String,
      name: String
    }
  })

export default model('Stops',StopsSchema, 'trainStops');