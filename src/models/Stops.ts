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
    childrens: [String],
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
      childrens: [{type: String, required: true}],
      father: {type: String}
    },
    type: { type: String, required: true, unique: true }
  })

export default mongoose.model<IStop>('Stops', StopsSchema, 'trainStops');