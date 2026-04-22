import { Plugin, TFile } from 'obsidian';

const UPDATE_TITLE_INTERVAL_MS = 2000;
const UPDATE_TITLE_MIN_DELAY_MS = 150;

export default class PathInTabTitlePlugin extends Plugin {
	intervalUpdateTitle: number | null;

	updateTabTitle() {
		const file: TFile | null = this.app.workspace.getActiveFile();

		const filePath = file?.path;
		// console.error('__TEST__ d9k 100', file?.path)
		if (!filePath) {
			return;
		}
		const tabTitleElement = document.querySelector('.workspace-tabs.mod-active .workspace-tab-header.is-active .workspace-tab-header-inner-title');

		if (!tabTitleElement) {
			return;
		}

		const filePathEnd = file.path.split('/').slice(-2).join('/');
		const filePathEndWithoutExtension = filePathEnd.replace(/\.md$/, '');
		const tabTitleParts = filePathEndWithoutExtension.split('/').reverse();
		const fileName = tabTitleParts[0];
		const folderName = tabTitleParts[1];
		let newTabTitleHtml = fileName ? `<span>${fileName}</span>` : '';
		const folderText = `| ${folderName}`;
		if (folderName) {
			newTabTitleHtml += ` <small>${folderText}</small>`;
		}

		if (tabTitleElement.innerHTML != newTabTitleHtml) {
			// Can't use innerHTML because of Obsidian Plugins Security Guidelines:
			// https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines#Avoid+%60innerHTML%60%2C+%60outerHTML%60+and+%60insertAdjacentHTML%60
			// tabTitleElement.innerHTML = newTabTitleHtml;
			tabTitleElement.innerHTML = "";
			if (fileName) {
				tabTitleElement.createSpan({ text: fileName });
			}
			if (folderName) {
				tabTitleElement.createEl('small', { text: folderText });
			}
			// console.error('__TEST__ d9k 150: tab title updated')
		}
	}

	updateTabTitleDelayed() {
		window.setTimeout(() => {
			this.updateTabTitle()
		}, UPDATE_TITLE_MIN_DELAY_MS)
	}

	async onload() {
		this.updateTabTitleDelayed();
		this.intervalUpdateTitle = window.setInterval(
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
			clearInterval(this.intervalUpdateTitle);
		}
	}
}
