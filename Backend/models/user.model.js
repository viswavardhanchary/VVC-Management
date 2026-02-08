const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema(
	{
		name: { type: String, required: true, trim: true },
		email: { type: String, required: true, unique: true, lowercase: true, trim: true },
		password: { type: String, required: true },
		projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
    role: {
      type: String,
      enum: ['developer' , 'professional'],
      default: 'developer'
    }
	},
	{ timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
