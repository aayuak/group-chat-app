import Group from '../models/Group.js';

const createGroup = async (req, res) => {
  try {
    const { name } = req.body;
    const group = new Group({ name });
    await group.save();
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    await Group.findByIdAndDelete(id);
    res.json({ message: 'Group deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addMember = async (req, res) => {
  try {
    const { groupId, userId } = req.body;
    const group = await Group.findOne({ _id: groupId, is_deleted: false });
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    group.members_ids.push(userId);
    await group.save();
    res.json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getGroupsList = async (_, res) => {
  try {
    const groups = await Group.find();
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await Group.findOne({
      _id: id,
      is_deleted: false
    });
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createGroup,
  deleteGroup,
  addMember,
  getGroupsList,
  getGroup,
};