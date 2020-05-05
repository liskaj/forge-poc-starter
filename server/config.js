const options = {
    forge: {
        clientID: process.env.FORGE_CLIENT_ID,
        clientSecret: process.env.FORGE_CLIENT_SECRET
    },
    storage: {
        baseURL: process.env.STORAGE_API_URL,
        key: process.env.STORAGE_API_KEY
    },
    port: process.env.PORT || 3000
};

module.exports = options;
