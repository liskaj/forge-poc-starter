const express = require('express');
const { BIM360Client } = require('forge-server-utils');
const config = require('./config');

const bimClient = new BIM360Client({
    client_id: config.clientID,
    client_secret: config.clientSecret
});
const router = express.Router();

// GET /api/data/projects/:projectID/items/:itemID
router.get('/projects/:projectID/items/:itemID', async (req, res) => {
    try {
        const itemDetails = await bimClient.getItemDetails(req.params.projectID, req.params.itemID);

        res.json({
            displayName: itemDetails.displayName,
            urn: itemDetails.derivative
        });
    } catch (err) {
        console.error(err);
        res.status(400).send(err);
    }
});

module.exports = router;
