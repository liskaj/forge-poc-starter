class DataService extends ServiceClient {
    getItemDetails(projectID, itemID) {
        const url = `/api/data/projects/${projectID}/items/${itemID}`;

        return this.get(url);
    }
}
