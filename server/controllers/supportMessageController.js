// controllers/supportMessageController.js

const SupportMessage = require('../models/SupportMessage');
const SupportRequest = require('../models/SupportRequest');

// Send a new message
exports.createMessage = async (req, res) => {
  const { requestId, message } = req.body;

  try {
    const request = await SupportRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Support request not found.' });
    }

    if (request.status !== 'In Progress') {
      return res.status(403).json({ success: false, message: 'Cannot send message unless request is In Progress.' });
    }

    const newMessage = await SupportMessage.create({
      request: requestId,
      sender: req.user.id,
      message
    });

    res.status(201).json({ success: true, message: 'Message sent successfully.', data: newMessage });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get all messages for a specific request
exports.getAllMessages = async (req, res) => {
  const { requestId } = req.params;

  try {
    const messages = await SupportMessage.find({ request: requestId }).populate('sender', 'firstName lastName role');

    res.status(200).json({ success: true, count: messages.length, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
