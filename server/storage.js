const express = require('express');
const axios = require('axios');
const config = require('./config');

const router = express.Router();

// GET /api/storage/lookup/:key
router.get('/lookup/:key', async (req, res) => {
    try {
        const key = req.params.key;
        const url = `${config.storage.baseURL}/lookup/${key}`;
        const result = await get(url);

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(400).send(err);
    }
});

async function get(url) {
    return new Promise((resolve, reject) => {
        let headers = {
            'key': `${config.storage.key}`
        };

        axios({
            method: 'get',
            url: url,
            headers: headers
        }).then((res) => {
            resolve(res.data);
        }).catch((err) => {
            reject(err);
        });
    });

}

module.exports = router;
