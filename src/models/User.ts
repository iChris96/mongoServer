import mongoose, { Schema, Document } from 'mongoose';
const bcrypt = require('bcryptjs')

export interface IUser extends Document {
  email: string;
  userName: string;
  password: string;
  encryptPassword(password:string): string;
  validatePassword(password:string): boolean;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  userName: { type: String, required: true },
  password: { type: String, required: true }
});

UserSchema.methods.encryptPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(5);
    const encripted = bcrypt.hash(password, salt);
    console.log('encripted pass:', encripted);
    
    return encripted;
};


UserSchema.methods.validatePassword = function (password: string) {
    return bcrypt.compare(password, this.password); //compare pass from req.body with encrypted user.password from db
};

// Export the model and return your IUser interface
export default mongoose.model<IUser>('User', UserSchema);