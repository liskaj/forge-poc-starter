let btnLoad;
let container;
let viewer;
let initialized = false;

$(document).ready(async () => {
    console.debug(`document is ready`);
    btnLoad = $('#btn-load');
    btnLoad.on('click', () => {
        onLoadClick();
    });
    container = $('#viewer-container');
    await initialize();
});

async function onLoadClick() {
    console.debug(`onLoad`);
    const urn = `urn:dXJuOmFkc2sud2lwcHJvZDpmcy5maWxlOnZmLjZVTWdSVjVSUjdDeHR5R0E5UVVNbWc_dmVyc2lvbj0x`;

    await load(urn);
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
                    ]
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
