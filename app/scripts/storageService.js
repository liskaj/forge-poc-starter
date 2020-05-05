class StorageService extends ServiceClient {
    getLookupValues(key) {
        const url = `/api/storage/lookup/${key}`;

        return this.get(url);
    }
}
