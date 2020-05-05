class ElementDataPanel extends Autodesk.Viewing.UI.DockingPanel {
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
        const url = `${window.location.href}scripts/extension/res/elementDataPanel.html`;

        Autodesk.Viewing.Private.getHtmlTemplate(url, async (error, content) => {
            this._onTemplate(error, content);
        });
    }

    async refresh() {
        console.debug(`ElementDataPanel#refresh`);
        if (!this._templateLoaded) {
            return;
        }
        const values = await this._extension.storageService.getLookupValues('LOC');

        this._lookup.empty();
        values.forEach((v) => {
            this._lookup.append(
                $('<option/>')
                    .val(v.value)
                    .text(v.value)
            );
        });
    }

    toggleVisibility() {
        this.setVisible(!this.isVisible());
        return this.isVisible();
    }

    async _onApplyClick() {
        const selectedValue = this._lookup[0]['value'];

        const idMapping = await this._extension.getIdMapping();
        const selection = this._extension.viewer.getSelection();
        const extId = idMapping[selection[0]];

        await this._extension.storageService.saveElementData({
            urn: this._extension.itemID,
            externalID: extId,
            LOC: selectedValue
        });
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
        this._lookup = $('#lookup');
        this._btnApply = $('#apply');
        this._btnApply.on('click', async () => {
            await this._onApplyClick();
        });
        // update controls
        this._templateLoaded = true;
        await this.refresh();
    }
}
