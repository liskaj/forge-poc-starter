class ElementStatusPanel extends Autodesk.Viewing.UI.DockingPanel {
    constructor(parentContainer, id, title, options) {
        super(parentContainer, id, title, options);
        this._extension = options.extension;
        this._templateLoaded = false;
        this.container.style.left = '40px';
        this.container.style.top = '40px';
        this.container.style.height = '180px';
        this.container.style.width = '300px';
        this.container.style.position = 'absolute';
        this.createScrollContainer({
            heightAdjustment: 70,
            left: false,
            marginTop: 0
        });
        // create UI
        const url = `${window.location.href}scripts/extension/res/elementStatusPanel.html`;

        Autodesk.Viewing.Private.getHtmlTemplate(url, async (error, content) => {
            this._onTemplate(error, content);
        });
    }

    async refresh() {
        console.debug(`ElementStatusPanel#refresh`);
        if (!this._templateLoaded) {
            return;
        }
        const data = await this._extension.storageService.getData(this._extension.itemID);
        const statusData = {};

        data.forEach((i) => {
            const status = i['LOC'];
            let ids = statusData[status];

            if (!ids) {
                ids = [];
                statusData[status] = ids;
            }
            ids.push(i.externalID);
        });
        console.debug(`${statusData}`);
        await this._extension.displayStatus(statusData);
    }

    toggleVisibility() {
        this.setVisible(!this.isVisible());
        return this.isVisible();
    }

    async _onTemplate(error, content) {
        if (error) {
            console.error(error);
            return;
        }
        const tmp = document.createElement('div');

        tmp.innerHTML = content;
        this.scrollContainer.appendChild(tmp.childNodes[0]);
        // bind to controls
        // update controls
        this._templateLoaded = true;
        await this.refresh();
    }
}
