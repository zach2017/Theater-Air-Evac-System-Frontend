const os = require('os');
const express = require('express');

const app = express();
const PORT = 3001;

// Endpoint to get the username of the logged-in user
app.get('/username', (req, res) => {
    try {
        // Retrieve user info using the os module
        const userInfo = os.userInfo();
        const username = userInfo.username;

        res.status(200).json({
            success: true,
            username: username,
            platform: os.platform(),
        });
    } catch (error) {
        console.error('Error retrieving username:', error);
        res.status(500).json({
            success: false,
            message: 'Unable to retrieve username',
            error: error.message,
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
