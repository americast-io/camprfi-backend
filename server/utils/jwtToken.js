// Create and send token and save in the cookie.
const sendToken = (user, statusCode, res) => {
    
    // Create JWT token
    const token = user.getJwtToken();

    // Options for cookie
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        // Domain: 'http//localhost:3000',
        // Path: '/',
        // SameSite: 'none',
        // Secure: true,
        // 'Max-Age': "Session"
    }

    // res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
        user

    })





}

module.exports = sendToken;