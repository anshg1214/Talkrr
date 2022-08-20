import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = new Schema({
	username: { type: String, required: true, unique: true, max: 20 },
	email: { type: String, required: true, unique: true },
	password: { type: String, min: 8 },
	image: { type: String, required: true }
});

export default mongoose.model('User', schema);
