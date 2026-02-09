const mongoose = require('mongoose');

const { Schema } = mongoose;

const StatusEnum = ['assigned', 'active', 'completed', 'closed', 'errors'];

const UpdateSchema = new Schema(
  {
    from: { type: String, enum: StatusEnum, required: true },
    to: { type: String, enum: StatusEnum, required: true },
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const CommentsSchema = new Schema(
  {
    by_creator: {
      type: [
      {
        name: String,
        last_edited: {
          type: Date,
          default: Date.now()
        },
        text: String
      }
    
    ],
    default: []
  },
    by_others: {
      type: [
      {
        name: String,
        last_edited: {
          type: Date,
          default: Date.now()
        },
        text: String
      }
    
    ],
    default: []
  },
    by_user: {
      type: [
      {
        name: String,
        last_edited: {
          type: Date,
          default: Date.now()
        },
        text: String
      }
    
    ],
    default: []
  },
  },
  { _id: false }
);

const UserAddedSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    email: { type: String },
    tasks: { type: String },
    drive_link: { type: String },
    status: { type: String, enum: StatusEnum, default: 'assigned' },
    date_to_completed: { type: Date },
    comments: { type: CommentsSchema, default: {} },
    updates: { type: [UpdateSchema], default: [] },
  },
  { _id: false }
);

const ProjectSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    password: { type: String },
    link: { type: String },
    created_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    users_added: { type: [UserAddedSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', ProjectSchema);
