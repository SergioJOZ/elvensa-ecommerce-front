import mongoose, {model, Schema, models} from "mongoose";

const UserSchema = new Schema({
    email: {type: String},
    name: {type:String},
    address: {type: String},
    CI: {type: Number},
    phone: {type: Number},
    password: {type: String}
});

export const User = models.User || model('User', UserSchema);


