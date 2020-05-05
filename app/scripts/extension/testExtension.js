class TestExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this._itemID = options.itemID;
        this._storageService = options.storageService;
        this._colorMapping = {
            'Not delivered': new THREE.Vector4(1.0, 0.4, 0.0, 0.8),
            'On site': new THREE.Vector4(0.0, 1.0, 0.1, 0.8),
            'In progress': new THREE.Vector4(0.0, 0.6, 1.0, 0.8),
            'Installed': new THREE.Vector4(0.7, 0.0, 1.0, 0.8)
        };
    }

    load() {
        console.debug(`extension loaded`);
        return true;
    }

    unload() {
        console.debug(`extension unloaded`);
        return true;
    }

    onToolbarCreated() {
        this._createToolbar();
    }

    get itemID() {
        return this._itemID;
    }

    get storageService() {
        return this._storageService;
    }

    displayStatus(statusData) {
        return new Promise((resolve) => {
            this.viewer.model.getExternalIdMapping((mapping) => {
                const names = Object.keys(statusData);
                const allIds = [];

                names.forEach((n) => {
                    const color = this._colorMapping[n];
                    const ids = statusData[n];

                    ids.forEach((id) => {
                        const dbId = mapping[id];

                        this.viewer.setThemingColor(dbId, color, this.viewer.model, true);
                        allIds.push(dbId);
                    });
                });
                this.viewer.isolate(allIds);
            });
        });
    }

    getIdMapping() {
        return new Promise((resolve) => {
            if (this.idMapping) {
                resolve(this.idMapping);
            } else {
                this.viewer.model.getExternalIdMapping((mapping) => {
                    this.idMapping = {};
                    const extIds = Object.keys(mapping);
    
                    extIds.forEach((extId) => {
                        const dbId = mapping[extId];
    
                        this.idMapping[dbId] = extId;
                    });
                    resolve(this.idMapping);
                });
            }
        });
    }

    _createToolbar() {
        // add group to main toolbar
        const ctrlGroup = new Autodesk.Viewing.UI.ControlGroup('Skanska.Test.ControlGroup');

        this.viewer.toolbar.addControl(ctrlGroup);
        // element data
        this._btnElementData = new Autodesk.Viewing.UI.Button('Skanska.Test.ElementData');
        this._btnElementData.setIcon('adsk-icon-bug');
        this._btnElementData.setToolTip('Element Data');
        this._btnElementData.onClick = async () => {
            this._onElementData();
        };
        // add button to the group
        ctrlGroup.addControl(this._btnElementData);
        // element status
        this._btnElementStatus = new Autodesk.Viewing.UI.Button('Skanska.Test.ElementStatus');
        this._btnElementStatus.setIcon('adsk-icon-bug');
        this._btnElementStatus.setToolTip('Element Status');
        this._btnElementStatus.onClick = async () => {
            this._onElementStatus();
        };
        // add button to the group
        ctrlGroup.addControl(this._btnElementStatus);
    }

    async _onElementData() {
        if (!this._elementDataPanel) {
            this._elementDataPanel = new ElementDataPanel(this.viewer.container, 'Skanska.Test.ElementDataPanel', 'Element Data', {
                extension: this
            });
            this.viewer.addPanel(this._elementDataPanel);
        }
        const selection = this.viewer.getSelection();

        if (this._elementDataPanel.isVisible()) {
            this._elementDataPanel.setVisible(false);
        } else {
            this._elementDataPanel.setVisible(selection.length > 0);
        }
        if (this._elementDataPanel.isVisible()) {
            await this._elementDataPanel.refresh();
        }
    }

    async _onElementStatus() {
        if (!this._elementStatusPanel) {
            this._elementStatusPanel = new ElementStatusPanel(this.viewer.container, 'Skanska.Test.ElementStatusPanel', 'Element Status', {
                extension: this
            });
            this.viewer.addPanel(this._elementStatusPanel);
            this._elementStatusPanel.setVisible(true);
        } else {
            this._elementStatusPanel.toggleVisibility();
        }
        if (this._elementStatusPanel.isVisible()) {
            await this._elementStatusPanel.refresh();
        }
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('Skanska.Test', TestExtension);
