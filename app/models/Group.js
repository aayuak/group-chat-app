import mongoose from 'mongoose';

const GroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  is_deleted: { type: Boolean, default: false },
});

export default mongoose.model('Group', GroupSchema);