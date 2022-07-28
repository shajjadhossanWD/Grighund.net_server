const jwt = require('jsonwebtoken');
const User = require('../Models/AdminModel');

//authentication middleware
const AdminAuthMiddleware = async (req, res, next) => {
    let token = req.headers['authorization'];

    if (token && token.startsWith('Bearer ')) {
        try {
            token = token.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET); //verify token

            //check if user still exists
            req.user = await User.findById(decoded.id);
            next();
        }
        catch (err) {
            return res.status(401).json({
                message: 'Invalid token'
            });
        }
    } else {
        return res.status(401).json({
            message: 'No token provided'
        });
    }
}

module.exports = AdminAuthMiddleware;