function verifyAppToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token || token !== process.env.APP_TOKEN) {
        return res.status(401).json({message: 'Unauthorized: Invalid or missing application token.'});
    }

    next();
}

module.exports = verifyAppToken;
