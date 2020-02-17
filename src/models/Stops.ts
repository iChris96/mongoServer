import mongoose,{ Schema, model, Document} from 'mongoose';
import { type } from 'os';


export interface IStop extends Document {
  geometry: {
    type: String,
    coordinates: [ Number ] 
  },
  properties: {
    area: String ,
    lines: [ String ],
    id: String,
    name: String,
    childrens: [{
      id: String,
      destination: String,
      geojson: {
        geometry: {
          type: String,
          coordinates: [ [Number] ]
        },
        type: String,
        properties: {
          directions: [ String ]
          id: String
          name: String
        }
      }
    }],
    father: String
  },
  type: String
}

const StopsSchema = new Schema({
    geometry: {
      type: { type: String, required: true, unique: true },
      coordinates: [ { type: Number, required: true, unique: true } ],
    },
    properties: {
      area: { type: String, required: true, unique: true },
      lines: [ { type: String, required: true, unique: true }, ],
      id: { type: String, required: true, unique: true },
      name: { type: String, required: true, unique: true },
      childrens: [{
        id: {type: String},
        destination: {type:String},
        geojson: {
          geometry: {
            type: { type: String, required: false, unique: false },
            coordinates: [ [ { type: Number, required: false, unique: false }] ],
          },
          type: { type: String, required: false, unique: false },
          properties: {
            directions: [ { type: String, required: false, unique: false } ],
            id: { type: String, required: false, unique: false },
            name: { type: String, required: false, unique: false },
          }
        }
      }],
      father: {type: String}
    },
    type: { type: String, required: true, unique: true }
  })

export default mongoose.model<IStop>('Stops', StopsSchema, 'trainStops');