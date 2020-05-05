class StorageService extends ServiceClient {
    getLookupValues(key) {
        const url = `/api/storage/lookup/${key}`;

        return this.get(url);
    }

    getData(itemID) {
        const url = `/api/storage/element/${itemID}`;

        return this.get(url);
    }

    saveElementData(data) {
        const url = `/api/storage/element`;

        return this.post(url, data);
    }
}
