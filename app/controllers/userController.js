import User from '../models/User.js';

const createUser = async (req, res) => {
  try {
    const { username, password, isAdmin } = req.body;
    const user = new User({ username, password, isAdmin });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, isAdmin } = req.body;
    const user = await User.findOne({ _id: id, is_deleted: false, status: true });
    if (user) {
      user.username = username || user.username;
      user.password = password || user.password;
      user.isAdmin = isAdmin || user.isAdmin;
      await user.save();
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createUser,
  editUser,
};