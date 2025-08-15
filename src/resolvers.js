const User = require('./models/User');
const Room = require('./models/Room');
const Message = require('./models/Message');
const { hashPassword, verifyPassword, createToken } = require('./utils/auth');
const mongoose = require('mongoose');

const resolvers = {
    Query: {
        me: async (_, __, { user }) => {
            if (!user) return null;
            return await User.findById(user.userId);
        },
        rooms: async () => Room.find().populate('members'),
        room: async (_, { id }) => Room.findById(id).populate('members messages'),
        messages: async (_, { roomId }) =>
            Message.find({ room: roomId }).populate('sender'),
    },
    Mutation: {
        // Registration and login as before...
        register: async (_, { username, email, password }) => {
            const existing = await User.findOne({ email });
            if (existing) throw new Error('Email already in use.');
            const hashed = await hashPassword(password);
            const user = await User.create({ username, email, password: hashed });
            const token = createToken(user);
            return { token, user };
        },
        login: async (_, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) throw new Error('User not found.');
            const valid = await verifyPassword(password, user.password);
            if (!valid) throw new Error('Invalid password.');
            const token = createToken(user);
            return { token, user };
        },

        // Create a new room
        createRoom: async (_, { name }, { user }) => {
            if (!user) throw new Error('Not authenticated');
            const room = await Room.create({
                name,
                createdBy: user.userId, // <--- must be provided!
                members: [user.userId],
                messages: []
            });
            await User.findByIdAndUpdate(user.userId, { $push: { rooms: room._id } });
            return room;
        },

        // Join an existing room
        joinRoom: async (_, { roomId }, { user }) => {
            if (!user) throw new Error('Not authenticated');
            const room = await Room.findById(roomId);
            if (!room) throw new Error('Room not found');
            // Add user to room if not already a member
            if (!room.members.includes(user.userId)) {
                room.members.push(user.userId);
                await room.save();
                await User.findByIdAndUpdate(user.userId, {
                    $push: { rooms: room._id },
                });
            }
            return room;
        },

        // Send a message in a room
        sendMessage: async (_, { roomId, text }, { user }) => {
            if (!user) throw new Error('Not authenticated');
            const room = await Room.findById(roomId);
            if (!room) throw new Error('Room not found');
            // Check if user is member of the room
            if (!room.members.includes(user.userId)) {
                throw new Error('You are not a member of this room');
            }
            const message = await Message.create({
                room: room._id,
                sender: user.userId,
                text,
            });
            room.messages.push(message._id);
            await room.save();
            return await Message.findById(message._id).populate('sender room');
        },
    },

    // Optional: type resolvers for nested population
    Room: {
        members: async (room) => User.find({ _id: { $in: room.members } }),
        messages: async (room) => Message.find({ room: room._id }),
    },
    Message: {
        sender: async (message) => User.findById(message.sender),
        room: async (message) => Room.findById(message.room),
    },
    User: {
        rooms: async (user) => Room.find({ _id: { $in: user.rooms } }),
    },
};

module.exports = resolvers;