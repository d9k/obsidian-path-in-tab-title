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
		let tabTitleHtml = fileName || '';
		if (folderName) {
			tabTitleHtml += ` <small>| ${folderName}</small>`;
		}

		tabTitleElement.innerHTML = tabTitleHtml;
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
