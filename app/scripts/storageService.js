class StorageService {
    getLookupValues(key) {
        const url = `/api/storage/lookup/${key}`;

        return this._get(url);
    }

    async _get(url) {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
    
        return result;
    }
}
