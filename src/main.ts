import { Plugin, TFile } from 'obsidian';

const UPDATE_TITLE_INTERVAL_MS = 2000;
const UPDATE_TITLE_MIN_DELAY_MS = 150;

export default class PathInTabTitlePlugin extends Plugin {
	intervalUpdateTitle: number | null;

	getFolderText(folderName: string) {
		return ` | ${folderName}`;
	}

	getTabTitleRenderInfo () {
		const file: TFile | null = this.app.workspace.getActiveFile();

		if (!file) {
			return null;
		}

		const filePathEnd = file.path.split('/').slice(-2).join('/');
		const filePathEndWithoutExtension = filePathEnd.replace(/\.md$/, '');
		const tabTitleParts = filePathEndWithoutExtension.split('/').reverse();
		const fileName = tabTitleParts[0];
		const folderName = tabTitleParts[1];
		let newTabTitleHtml = fileName ? `<span>${fileName}</span>` : '';
		const folderText = folderName ? ` | ${folderName}` : '';
		if (folderName) {
			newTabTitleHtml += ` <small>${folderText}</small>`;
		}
		return {
			folderText,
			newTabTitleHtml,
			fileName,
		}
	}

	getTabTitleElement() {
		return activeDocument.querySelector('.workspace-tabs.mod-active .workspace-tab-header.is-active .workspace-tab-header-inner-title');
	}

	updateTabTitle() {
		let renderInfo = this.getTabTitleRenderInfo();
		let tabTitleElement = this.getTabTitleElement();

		if (!renderInfo || !tabTitleElement) {
			return;
		}

		if (tabTitleElement.innerHTML != renderInfo.newTabTitleHtml) {
			// Can't use innerHTML because of Obsidian Plugins Security Guidelines:
			// https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines#Avoid+%60innerHTML%60%2C+%60outerHTML%60+and+%60insertAdjacentHTML%60
			// tabTitleElement.innerHTML = newTabTitleHtml;
			// let clearInnerHtml = true;
			let updateTimeout = 0;

			if (tabTitleElement.innerHTML) {
				updateTimeout = 50;
			}

			activeWindow.setTimeout(() => {
				const renderInfoCurrent = this.getTabTitleRenderInfo();
				const tabTitleElementCurrent = this.getTabTitleElement();

				if (!renderInfoCurrent || !tabTitleElementCurrent) {
					return;
				}

				if (tabTitleElementCurrent.innerHTML) {
					tabTitleElementCurrent.innerHTML = "";
				}

				let renderInfo = this.getTabTitleRenderInfo();

				let tabTitleElement = this.getTabTitleElement();

				if (!renderInfo || !tabTitleElement) {
					return;
				}

				if (renderInfo.fileName) {
					tabTitleElement.createSpan({ text: renderInfo.fileName });
				}
				if (renderInfo.folderText) {
					tabTitleElement.createEl('small', { text: renderInfo.folderText });
				}
				// console.error('__TEST__ d9k 150: tab title updated')
			}, updateTimeout);
		}
	}

	updateTabTitleDelayed() {
		activeWindow.setTimeout(() => {
			this.updateTabTitle()
		}, UPDATE_TITLE_MIN_DELAY_MS)
	}

	async onload() {
		this.updateTabTitleDelayed();
		this.intervalUpdateTitle = activeWindow.setInterval(
			() => {
				this.updateTabTitle()
			},
			UPDATE_TITLE_INTERVAL_MS
		);

		this.registerEvent(this.app.workspace.on('layout-change', () => {
			// console.error('__TEST__ d9k 500: workspace layout changed')
			this.updateTabTitleDelayed();
		}));

		this.registerEvent(this.app.workspace.on('file-open', () => {
			this.updateTabTitleDelayed();
		}));

		this.registerEvent(this.app.workspace.on('window-open', () => {
			this.updateTabTitleDelayed();
		}));


		this.registerInterval(this.intervalUpdateTitle);
	}

	onunload() {
		if (this.intervalUpdateTitle) {
			activeWindow.clearInterval(this.intervalUpdateTitle);
		}
	}
}
