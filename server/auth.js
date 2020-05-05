const express = require('express');
const { AuthenticationClient } = require('forge-server-utils');
const config = require('./config');

const authenticationClient = new AuthenticationClient(config.clientID, config.clientSecret);
const router = express.Router();

// POST /api/auth/token
router.post('/viewtoken', async (req, res) => {
    try {
        const token = await authenticationClient.authenticate(['viewables:read']);

        res.json(token);
    } catch (err) {
        console.error(err);
        res.status(400).send(err);
    }
});

module.exports = router;
