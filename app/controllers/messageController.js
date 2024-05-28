import Message from '../models/Message.js';
import Group from '../models/Group.js';

const sendMessage = async (req, res) => {
  try {
    const { groupId, content } = req.body;
    const group = await Group.findOne({ _id: groupId, is_deleted: false });
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    if (!group.members_ids.includes(req.user._id) && !req.user.isAdmin) {
      return res.status(403).json({ message: 'You are not a member of this group' });
    }
    const message = new Message({
      group_id: groupId,
      user_id: req.user._id,
      content
    });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const likeMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findOne({ _id: id, is_deleted: false });
    if (message) {
      if (message.likes.includes(req.user._id)) {
        message.likes.pull(req.user._id);
      } else {
        message.likes.push(req.user._id);
      }
      await message.save();
      res.json(message);
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  sendMessage,
  likeMessage,
};