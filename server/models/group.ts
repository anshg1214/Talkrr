import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = new Schema({
	description: { type: String, required: true },
	title: { type: String, required: true },
	members: [{ type: mongoose.Types.ObjectId, required: true, ref: 'User' }],
	messages: [
		{ type: mongoose.Types.ObjectId, required: true, ref: 'Message' }
	]
});

export default mongoose.model('Group', schema);
