// controllers/supportFaqController.js

const SupportFAQ = require('../models/SupportFAQ');

// Create a new FAQ
exports.createFAQ = async (req, res) => {
  const { question, answer } = req.body;

  try {
    const faq = await SupportFAQ.create({ question, answer });
    res.status(201).json({
      success: true,
      message: 'FAQ created successfully.',
      data: faq,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error while creating FAQ.',
    });
  }
};

// Get all FAQs
exports.getAllFAQs = async (req, res) => {
  try {
    const faqs = await SupportFAQ.find();
    res.status(200).json({
      success: true,
      count: faqs.length,
      message: 'FAQs fetched successfully.',
      data: faqs,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching FAQs.',
    });
  }
};

// Update an FAQ
exports.updateFAQ = async (req, res) => {
  const { id } = req.params;
  const { question, answer } = req.body;

  try {
    const faq = await SupportFAQ.findByIdAndUpdate(
      id,
      { question, answer },
      { new: true, runValidators: true }
    );

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'FAQ updated successfully.',
      data: faq,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error while updating FAQ.',
    });
  }
};

// Delete an FAQ
exports.deleteFAQ = async (req, res) => {
  const { id } = req.params;

  try {
    const faq = await SupportFAQ.findByIdAndDelete(id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'FAQ deleted successfully.',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting FAQ.',
    });
  }
};
