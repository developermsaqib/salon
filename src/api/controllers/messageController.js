const Conversation = require("../models/conversation.js");
const Message = require("../models/message.js");
const { io, getReceiverSocketId } = require("../socket/socket.js");

exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = await Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    // await conversation.save();
    // await newMessage.save();
    // this will parallel executed
    await Promise.all([conversation.save(), newMessage.save()]);

    // SOCKET IO FUNCTIONALITY WILL HERE

    const receiverSocketId = getReceiverSocketId(receiverId);
    // io.emit("newMessage", newMessage);
    if (receiverSocketId) {
      console.log(receiverSocketId);
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    res.status(201).json({ status: true, newMessage });
  } catch (error) {
    console.log("Error in SendMessage Controller", error.message);
    res.status(500).json({ status: false, error: "Internal server error" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    if (!conversation) {
      return res.status(201).json([]);
    }

    res.status(200).json({ status: true, messages: conversation.messages });
  } catch (error) {
    console.log("Error in getMessages Controller", error.message);
    res.status(500).json({ status: false, error: "Internal server error" });
  }
};
