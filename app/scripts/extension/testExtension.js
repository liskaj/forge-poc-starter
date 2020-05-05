class TestExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
    }

    load() {
        console.debug(`extension loaded`);
        return true;
    }

    unload() {
        console.debug(`extension unloaded`);
        return true;
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('Skanska.Test', TestExtension);
