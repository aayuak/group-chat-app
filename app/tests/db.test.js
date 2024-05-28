import mongoose from 'mongoose';
import connectDB from '../config/db.js';

jest.mock('mongoose');

describe('connectDB', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('connectDB should connect to MongoDB and log a success message', async () => {
    console.log = jest.fn();
    mongoose.connect.mockResolvedValue(true);

    await connectDB();

    expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    expect(console.log).toHaveBeenCalledWith('MongoDB connected');
  });

  test('connectDB should log an error message and exit the process if the connection fails', async () => {
    console.error = jest.fn();
    process.exit = jest.fn();
    mongoose.connect.mockRejectedValue(new Error('Connection failed'));

    await connectDB();

    expect(console.error).toHaveBeenCalledWith('MongoDB connection failed', new Error('Connection failed'));
    expect(process.exit).toHaveBeenCalledWith(1);
  });
});