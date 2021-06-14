var jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        var token = req.headers.authorization.split(' ')[1];
        var decode = jwt.verify(token, process.env.JWT_SECRET);
        req.tokenDetail = decode;
        next();
    } catch (error) {
        res.status(401).json({
            error: 'Token is invalid'
        });
    }
}