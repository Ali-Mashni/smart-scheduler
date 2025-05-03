// controllers/adminController.js

const SupportRequest = require('../models/SupportRequest');
const User = require('../models/User');
const Admin = require('../models/Admin');
const Support = require('../models/Support');

// Get all escalated requests that are unresolved
exports.getEscalatedRequests = async (req, res) => {
    try {
        // Find all unresolved escalated requests
        const escalatedRequests = await SupportRequest.find({
            status: 'Escalated'
        }).populate('user').populate('assignedAgent');

        // Format tickets for frontend
        const formattedTickets = escalatedRequests.map(ticket => ({
            _id: ticket._id,
            id: `#${ticket._id}`,
            avatar: ticket.user ? ticket.user.firstName.charAt(0) : '?',
            title: ticket.title,
            description: ticket.description,
            status: ticket.status,
            statusColor: "blue",
            timeLabel: `Updated ${timeSince(ticket.updatedAt)}`,
            createdAt: ticket.createdAt,
            updatedAt: ticket.updatedAt
        }));

        res.status(200).json({
            success: true,
            count: formattedTickets.length,
            data: formattedTickets
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Get all resolved escalated requests
exports.getResolvedRequests = async (req, res) => {
    try {
        // Find all resolved tickets (not just escalated ones)
        const resolvedRequests = await SupportRequest.find({
            status: 'Resolved'
        }).populate('user').populate('assignedAgent');

        // Format tickets for frontend
        const formattedTickets = resolvedRequests.map(ticket => ({
            _id: ticket._id,
            id: `#${ticket._id}`,
            avatar: ticket.user ? ticket.user.firstName.charAt(0) : '?',
            title: ticket.title,
            description: ticket.description,
            status: "Solved",
            statusColor: "green",
            timeLabel: `Resolved ${timeSince(ticket.updatedAt)}`,
            createdAt: ticket.createdAt,
            updatedAt: ticket.updatedAt
        }));

        res.status(200).json({
            success: true,
            count: formattedTickets.length,
            data: formattedTickets
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Resolve a ticket
exports.resolveTicket = async (req, res) => {
    try {
        const ticketId = req.params.id;

        // Find the ticket
        const ticket = await SupportRequest.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found'
            });
        }

        // If there's an assigned agent, increment their handled tickets count
        if (ticket.assignedAgent) {
            await Support.findOneAndUpdate(
                { user: ticket.assignedAgent },
                { $inc: { ticketsHandled: 1 } },
                { upsert: true, new: true }
            );
        }

        // Update ticket status
        ticket.status = 'Resolved';
        ticket.previousStatus = 'Escalated';
        ticket.resolvedAt = Date.now();
        await ticket.save();

        res.status(200).json({
            success: true,
            message: 'Ticket resolved successfully',
            data: { id: ticketId, status: 'Resolved' }
        });
    } catch (err) {
        console.error('Error resolving ticket:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Reassign a ticket to another staff member
exports.reassignTicket = async (req, res) => {
    const { agentId, message } = req.body;
    const ticketId = req.params.id;

    try {
        // Check if agent exists
        const agent = await User.findById(agentId);

        if (!agent || agent.role !== 'support') {
            return res.status(404).json({
                success: false,
                message: 'Support agent not found'
            });
        }

        // Find ticket
        const ticket = await SupportRequest.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found'
            });
        }

        // If the ticket is being reassigned from another agent, 
        // update the previous agent's counts
        if (ticket.assignedAgent && ticket.assignedAgent.toString() !== agentId) {
            // First, decrement the previously assigned agent's count
            await Support.findOneAndUpdate(
                { user: ticket.assignedAgent },
                { $inc: { ticketsAssigned: -1 } }
            );
        }

        // Update the new agent's assigned tickets count
        await Support.findOneAndUpdate(
            { user: agentId },
            { $inc: { ticketsAssigned: 1 } },
            { upsert: true, new: true }
        );

        // Update the ticket
        ticket.assignedAgent = agentId;
        if (message) {
            ticket.notes = ticket.notes
                ? `${ticket.notes}\nReassigned to ${agent.firstName} ${agent.lastName}: ${message}`
                : `Reassigned to ${agent.firstName} ${agent.lastName}: ${message}`;
        }
        await ticket.save();

        res.status(200).json({
            success: true,
            message: `Ticket reassigned to ${agent.firstName} ${agent.lastName}`,
            data: { id: ticketId, assignedAgent: agentId }
        });
    } catch (err) {
        console.error('Error reassigning ticket:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Get website statistics
exports.getWebsiteStatistics = async (req, res) => {
    try {
        // Count total users
        const totalUsers = await User.countDocuments();

        // Count total requests
        const totalRequests = await SupportRequest.countDocuments();

        // Count resolved requests
        const resolvedRequests = await SupportRequest.countDocuments({ status: 'Resolved' });

        // Calculate solved rate
        const solvedRate = totalRequests > 0
            ? Math.round((resolvedRequests / totalRequests) * 100)
            : 0;

        const statistics = {
            totalUsers,
            totalRequests,
            resolvedRequests,
            solvedRate: `${solvedRate}%`
        };

        res.status(200).json({
            success: true,
            data: statistics
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Update admin account settings
exports.updateAdminSettings = async (req, res) => {
    const { email, password, phone } = req.body;
    const userId = req.user.id; // Assuming authenticated user

    try {
        // Create update object with only provided fields
        const updateFields = {};
        if (email) updateFields.email = email;
        if (phone !== undefined) updateFields.phone = phone;

        // Find user and update basic info
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateFields,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // If password provided, update it with proper hashing
        if (password) {
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash(password, 10);
            updatedUser.password = hashedPassword;
            await updatedUser.save();
        }

        res.status(200).json({
            success: true,
            message: 'Account settings updated successfully',
            data: {
                id: updatedUser._id,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                phone: updatedUser.phone,
                role: updatedUser.role
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Get all support staff
exports.getSupportStaff = async (req, res) => {
    try {
        // Find all users with role 'support'
        const supportStaff = await User.find({ role: 'support' });

        // Get support data from Support model
        const formattedStaff = await Promise.all(supportStaff.map(async (staff) => {
            // Find or create support record
            let supportRecord = await Support.findOne({ user: staff._id });

            if (!supportRecord) {
                supportRecord = await Support.create({
                    user: staff._id,
                    ticketsAssigned: 0,
                    ticketsHandled: 0
                });
            }

            return {
                id: staff._id,
                name: `${staff.firstName} ${staff.lastName}`,
                ticketsAssigned: supportRecord.ticketsAssigned,
                ticketsHandled: supportRecord.ticketsHandled
            };
        }));

        res.status(200).json({
            success: true,
            count: formattedStaff.length,
            data: formattedStaff
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Helper function to format time since
function timeSince(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";

    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";

    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";

    return Math.floor(seconds) + "s ago";
} 