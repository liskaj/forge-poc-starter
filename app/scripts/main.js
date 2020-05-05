let btnLoad;
let container;
let storageService;
let project;
let item;
let viewer;
let initialized = false;

$(document).ready(async () => {
    console.debug(`document is ready`);
    btnLoad = $('#btn-load');
    btnLoad.on('click', () => {
        onLoadClick();
    });
    container = $('#viewer-container');
    project = $('#project');
    item = $('#item');
    await initialize();
    storageService = new StorageService();
});

async function onLoadClick() {
    console.debug(`onLoad`);
    const itemDetails = await getItemDetails(project.val(), item.val());
    const urn = `urn:${itemDetails.urn}`;

    await load(urn);
}

async function getItemDetails(projectID, itemID) {
    const response = await fetch(`/api/data/projects/${projectID}/items/${itemID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const result = await response.json();

    return result;
}

async function getToken(callback) {
    const response = await fetch('/api/auth/viewtoken', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const token = await response.json();

    callback(token.access_token, token.expires_in);
}

function initialize() {
    return new Promise((resolve, reject) => {
        if (initialized) {
            resolve();
        } else {
            const options = {
                getAccessToken: getToken
            };

            Autodesk.Viewing.Initializer(options, () => {
                initialized = true;
                resolve();
            });
        }
    });
}

function load(urn) {
    return new Promise((resolve, reject) => {
        Autodesk.Viewing.Document.load(urn, (doc) => {
            const viewable = doc.getRoot().getDefaultGeometry();

            if (!viewer) {
                const config = {
                    extensions: [
                        'Skanska.Test'
                    ],
                    storageService: storageService
                };

                viewer = new Autodesk.Viewing.GuiViewer3D(container[0], config);
            }
            if (!viewer.started) {
                viewer.start();
            }
            const options = {
            };

            viewer.loadDocumentNode(doc, viewable, options).then(() => {
                resolve();
            });
        }, (errorCode, errorMsg, errors) => {
            reject(new Error(errorMsg));
        });
    });
}
