/**
 * Script to fetch and display all users from the database
 * Run with: node scripts/fetchUsers.js
 */

const mongoose = require('mongoose');
const User = require('../models/User');
const Admin = require('../models/Admin');
const Student = require('../models/Student');
const Support = require('../models/Support');
require('dotenv').config();

async function fetchUsers() {
    try {
        // Set up MongoDB connection - use local MongoDB if no connection string is provided
        const uri = process.env.DB_Connection_String || "mongodb://localhost:27017/smart-scheduler";

        console.log('Connecting to MongoDB...');
        await mongoose.connect(uri);
        console.log('MongoDB connected successfully\n');

        // Fetch all users from the database
        const users = await User.find().lean();

        if (users.length === 0) {
            console.log('No users found in the database.');
            await mongoose.disconnect();
            return;
        }

        console.log(`Found ${users.length} users in the database:\n`);

        // Process and display each user
        for (const user of users) {
            // Get the associated role specific data
            let roleData = null;
            if (user.role === 'admin') {
                roleData = await Admin.findOne({ user: user._id }).lean();
            } else if (user.role === 'student') {
                roleData = await Student.findOne({ user: user._id }).lean();
            } else if (user.role === 'support') {
                roleData = await Support.findOne({ user: user._id }).lean();
            }

            // Format user data for display
            console.log('---------------------------------------------------');
            console.log(`User ID: ${user._id}`);
            console.log(`Name: ${user.firstName} ${user.lastName}`);
            console.log(`Username: ${user.username}`);
            console.log(`Email: ${user.email}`);
            console.log(`Role: ${user.role}`);
            console.log(`Created: ${new Date(user.createdAt).toLocaleString()}`);

            // Display role-specific data if available
            if (roleData) {
                console.log(`${user.role.charAt(0).toUpperCase() + user.role.slice(1)} ID: ${roleData._id}`);
            }

            // Only show password for admin in development environment
            if (user.role === 'admin') {
                console.log(`Password: ${user.password} (hashed)`);
            }

            console.log('---------------------------------------------------\n');
        }

        // Display summary
        const adminCount = users.filter(user => user.role === 'admin').length;
        const studentCount = users.filter(user => user.role === 'student').length;
        const supportCount = users.filter(user => user.role === 'support').length;

        console.log('Summary:');
        console.log(`Total Users: ${users.length}`);
        console.log(`Admin Users: ${adminCount}`);
        console.log(`Student Users: ${studentCount}`);
        console.log(`Support Users: ${supportCount}`);

        await mongoose.disconnect();
        console.log('\nMongoDB disconnected');

    } catch (err) {
        console.error('Error fetching users:', err);
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
        process.exit(1);
    }
}

// Run the function
fetchUsers(); 