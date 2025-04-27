// controllers/supportRequestController.js

const SupportRequest = require('../models/SupportRequest');
const SupportMessage = require('../models/SupportMessage');

// Create a new support request
exports.createRequest = async (req, res) => {
  const { title, description } = req.body;
  
  try {
    const newRequest = await SupportRequest.create({
      user: req.user.id, // student ID from token
      title,
      description,
      status: 'Pending'
    });

    // Also create the first message automatically
    await SupportMessage.create({
      request: newRequest._id,
      sender: req.user.id,
      message: description
    });

    res.status(201).json({ success: true, message: 'Support request created successfully.', data: newRequest });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get all requests (agent or student)
exports.getRequests = async (req, res) => {
  try {
    const requests = await SupportRequest.find().populate('user assignedAgent');
    res.status(200).json({ success: true, count: requests.length, data: requests });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Update request status (only agent)
exports.updateRequestStatus = async (req, res) => {
  const { status } = req.body;
  
  try {
    const updatedRequest = await SupportRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    res.status(200).json({ success: true, message: 'Request status updated.', data: updatedRequest });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
