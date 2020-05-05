class TestExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this._storageService = options.storageService;
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

    get storageService() {
        return this._storageService;
    }

    _createToolbar() {
        this._btnElementData = new Autodesk.Viewing.UI.Button('Skanska.Test.ElementData');
        this._btnElementData.setIcon('adsk-icon-bug');
        this._btnElementData.setToolTip('Element Data');
        this._btnElementData.onClick = async (e) => {
            this._onElementData(e);
        };
        // add button to the goup
        const ctrlGroup = new Autodesk.Viewing.UI.ControlGroup('Skanska.Test.ControlGroup');

        ctrlGroup.addControl(this._btnElementData);
        // add group to main toolbar
        this.viewer.toolbar.addControl(ctrlGroup);
    }

    async _onElementData(e) {
        if (!this._elementDataPanel) {
            this._elementDataPanel = new ElementDataPanel(this.viewer.container, 'Skanska.Test.ElementDataPanel', 'Element Data', {
                extension: this
            }, this);
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
}

Autodesk.Viewing.theExtensionManager.registerExtension('Skanska.Test', TestExtension);
