// scripts/initSupportData.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Support = require('../models/Support');
const connectDB = require('../config/db');

// Connect to the database
connectDB();

async function initializeSupportData() {
    try {
        console.log('Starting support data initialization...');

        // Find all support users
        const supportUsers = await User.find({ role: 'support' });
        console.log(`Found ${supportUsers.length} support users`);

        if (supportUsers.length === 0) {
            console.log('No support users found. Please create support users first.');
            process.exit(0);
        }

        // For each support user, create or update Support record with random test data
        for (const user of supportUsers) {
            // Generate random numbers for testing
            const ticketsAssigned = Math.floor(Math.random() * 50) + 10; // 10-60
            const ticketsHandled = Math.floor(Math.random() * ticketsAssigned); // 0 to ticketsAssigned

            // Find existing record or create new one
            const supportRecord = await Support.findOneAndUpdate(
                { user: user._id },
                {
                    user: user._id,
                    ticketsAssigned,
                    ticketsHandled
                },
                { upsert: true, new: true }
            );

            console.log(`Updated support record for ${user.firstName} ${user.lastName}:`);
            console.log(`- Tickets Assigned: ${supportRecord.ticketsAssigned}`);
            console.log(`- Tickets Handled: ${supportRecord.ticketsHandled}`);
            console.log(`- Progress: ${Math.round((supportRecord.ticketsHandled / supportRecord.ticketsAssigned) * 100)}%`);
            console.log('-----------------------------------');
        }

        console.log('Support data initialization completed.');
        process.exit(0);
    } catch (error) {
        console.error('Error initializing support data:', error);
        process.exit(1);
    }
}

initializeSupportData(); 