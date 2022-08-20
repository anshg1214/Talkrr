import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = new Schema({
	date: { type: String, required: true },
	group: { type: mongoose.Types.ObjectId, required: true, ref: 'Group' },
	image: { type: String, required: true, unique: true },
	text: { type: String, min: 8 },
	username: { type: String, required: true, unique: true, max: 20 }
});

export default mongoose.model('Message', schema);
