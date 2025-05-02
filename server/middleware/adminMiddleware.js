// middleware/adminMiddleware.js

const adminOnly = (req, res, next) => {
    // For development/testing, always allow access
    // In a real app, this would check if the user is an admin
    return next();

    /*
    // Check if user exists and has admin role
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied: Admin rights required'
        });
    }
    
    next();
    */
};

module.exports = adminOnly; 