require('dotenv').config();
const mongoose = require('mongoose');

// First, require all models to ensure registration
require('../models/User');
require('../models/Admin');
require('../models/Student');
require('../models/Support');
const SupportRequest = require('../models/SupportRequest');
const User = require('../models/User');

// Connect to the database
async function connectToDatabase() {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/smart-scheduler';
        await mongoose.connect(mongoURI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    }
}

// Sample ticket data
const ticketTemplates = [
    {
        title: 'Cannot schedule appointment',
        description: 'I am trying to schedule an appointment but the system keeps showing an error.',
        status: 'Open'
    },
    {
        title: 'Login issues on mobile app',
        description: 'I cannot log in to the mobile app. It keeps saying "Invalid credentials" even though I am sure my password is correct.',
        status: 'Open'
    },
    {
        title: 'Need to reschedule my appointment',
        description: 'I need to reschedule my appointment on Friday due to a conflict. How can I do this?',
        status: 'Open'
    },
    {
        title: 'System slow during peak hours',
        description: 'The system becomes very slow between 9-11am. This makes it difficult to manage my schedule.',
        status: 'Escalated'
    },
    {
        title: 'Missing appointments in calendar',
        description: 'Some of my appointments are not showing up in my calendar even though I received confirmation emails.',
        status: 'Escalated'
    },
    {
        title: 'Unable to view past appointments',
        description: 'I need to access my appointment history for the last 3 months but I can only see the last month.',
        status: 'Escalated'
    },
    {
        title: 'App crashes when adding notes',
        description: 'When I try to add notes to an appointment, the app crashes immediately.',
        status: 'Escalated'
    },
    {
        title: 'Calendar sync not working',
        description: 'The calendar sync with my Google Calendar is not working. I enabled it in settings but no appointments are showing up.',
        status: 'Resolved'
    },
    {
        title: 'Notification settings reset',
        description: 'My notification settings keep resetting to default every time I log out.',
        status: 'Resolved'
    },
    {
        title: 'Need to cancel my account',
        description: 'I would like to cancel my account as I no longer need the service.',
        status: 'Resolved'
    }
];

async function seedTickets() {
    try {
        await connectToDatabase();

        // Get all students and support staff
        const students = await User.find({ role: 'student' }).limit(10);
        const supportStaff = await User.find({ role: 'support' }).limit(5);

        if (students.length === 0) {
            console.log('No students found in the database. Please create some student users first.');
            mongoose.disconnect();
            return process.exit(1);
        }

        console.log(`Found ${students.length} students and ${supportStaff.length} support staff.`);

        // Count existing tickets
        const existingTicketsCount = await SupportRequest.countDocuments();
        console.log(`There are currently ${existingTicketsCount} tickets in the database.`);

        // Ask for confirmation if tickets already exist
        if (existingTicketsCount > 0) {
            console.log('WARNING: This will add more test tickets to your database.');
            console.log('If you want to proceed, add --force as an argument.');

            // Check if --force flag is provided
            if (!process.argv.includes('--force')) {
                console.log('Exiting without creating tickets. Run with --force to bypass this check.');
                mongoose.disconnect();
                return process.exit(0);
            }

            console.log('--force flag detected. Proceeding with ticket creation...');
        }

        // Create tickets
        const createdTickets = [];

        // Define a time range for creation dates (past 30 days)
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        for (const template of ticketTemplates) {
            // Select a random student
            const student = students[Math.floor(Math.random() * students.length)];

            // For escalated and resolved tickets, assign a support agent
            let agent = null;
            if (template.status !== 'Open' && supportStaff.length > 0) {
                agent = supportStaff[Math.floor(Math.random() * supportStaff.length)];
            }

            // Create a random date between now and 30 days ago
            const randomTime = thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime());
            const createdAt = new Date(randomTime);

            // For resolved tickets, add a resolved date
            let resolvedAt = null;
            if (template.status === 'Resolved') {
                // Resolve date is between creation date and now
                const minResolutionTime = 1000 * 60 * 30; // minimum 30 minutes to resolve
                const resolvedTime = createdAt.getTime() + minResolutionTime +
                    Math.random() * (now.getTime() - createdAt.getTime() - minResolutionTime);
                resolvedAt = new Date(resolvedTime);
            }

            // Create the ticket
            const ticketData = {
                title: template.title,
                description: template.description,
                status: template.status,
                user: student._id,
                assignedAgent: agent ? agent._id : null,
                createdAt,
                updatedAt: template.status === 'Resolved' ? resolvedAt : createdAt,
                resolvedAt
            };

            if (template.status === 'Resolved') {
                ticketData.previousStatus = 'Escalated';
            }

            // Add some random notes for escalated and resolved tickets
            if (template.status !== 'Open') {
                ticketData.notes = `Ticket escalated due to ${['complexity', 'urgency', 'customer request'][Math.floor(Math.random() * 3)]}.`;

                if (template.status === 'Resolved') {
                    ticketData.notes += `\nResolved by ${agent.firstName} ${agent.lastName}. Solution: ${[
                        'Provided step-by-step guide to the customer.',
                        'Fixed system configuration issue.',
                        'Resolved account-related problem.',
                        'Updated user permissions.'
                    ][Math.floor(Math.random() * 4)]}`;
                }
            }

            const ticket = await SupportRequest.create(ticketData);
            createdTickets.push(ticket);

            console.log(`Created ticket: ${ticket.title} (${ticket.status}) for ${student.firstName} ${student.lastName}`);

            // Update support staff ticket counts if assigned
            if (agent && template.status === 'Resolved') {
                await mongoose.model('Support').findOneAndUpdate(
                    { user: agent._id },
                    { $inc: { ticketsHandled: 1, ticketsAssigned: 1 } },
                    { upsert: true }
                );
            } else if (agent) {
                await mongoose.model('Support').findOneAndUpdate(
                    { user: agent._id },
                    { $inc: { ticketsAssigned: 1 } },
                    { upsert: true }
                );
            }
        }

        console.log(`\nSuccessfully created ${createdTickets.length} test tickets!`);
        console.log('Ticket Status Distribution:');
        console.log(`- Open: ${createdTickets.filter(t => t.status === 'Open').length}`);
        console.log(`- Escalated: ${createdTickets.filter(t => t.status === 'Escalated').length}`);
        console.log(`- Resolved: ${createdTickets.filter(t => t.status === 'Resolved').length}`);

        mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Error seeding tickets:', error);
        mongoose.disconnect();
        process.exit(1);
    }
}

seedTickets();
