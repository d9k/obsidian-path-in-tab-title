import { Plugin, TFile } from 'obsidian';
// import {DEFAULT_SETTINGS, MyPluginSettings, SampleSettingTab} from "./settings";

// Remember to rename these classes and interfaces!

const UPDATE_TITLE_INTERVAL_MS = 2000;
const UPDATE_TITLE_MIN_DELAY_MS = 150;

export default class PathInTabTitlePlugin extends Plugin {
	// pathInTabTitleComponent: Component;
	intervalUpdateTitle: number | null;

	updateTabTitle() {
		const file: TFile | null = this.app.workspace.getActiveFile();
		// const fsa = new FileSystemAdapter();
		// console.error(fsa.getBasePath());

		const filePath = file?.path;
		console.error('__TEST__ d9k 100', file?.path)
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
			// tabTitleHtml += ` <small>(${folderName})</small>`;
			tabTitleHtml += ` <small>| ${folderName}</small>`;
		}

		// console.error('__TEST__ d9k 200', tabTitleElement);
		tabTitleElement.innerHTML = tabTitleHtml;
	}

	updateTabTitleDelayed() {
		window.setTimeout(() => {
			this.updateTabTitle()
		}, UPDATE_TITLE_MIN_DELAY_MS)
	}

	async onload() {
		this.updateTabTitleDelayed();
		// this.pathInTabTitleComponent = new Component();
		this.intervalUpdateTitle = window.setInterval(
			() => {
				this.updateTabTitle()
			},
			UPDATE_TITLE_INTERVAL_MS
		);

		this.registerEvent(this.app.workspace.on('layout-change', () => {
			console.error('__TEST__ d9k 500: workspace layout changed')
			this.updateTabTitleDelayed();
		}));

		this.registerEvent(this.app.workspace.on('file-open', () => {
			this.updateTabTitleDelayed();
		}));

		this.registerEvent(this.app.workspace.on('window-open', () => {
			this.updateTabTitleDelayed();
		}));


		this.registerInterval(this.intervalUpdateTitle);

		// this.pathInTabTitleComponent.registerInterval(this.intervalUpdateTitle);
		// await this.loadSettings();

		// // This creates an icon in the left ribbon.
		// this.addRibbonIcon('dice', 'Sample', (evt: MouseEvent) => {
		// 	// Called when the user clicks the icon.
		// 	new Notice('This is a notice!');
		// });

		// // This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		// const statusBarItemEl = this.addStatusBarItem();
		// statusBarItemEl.setText('Status bar text');

		// // This adds a simple command that can be triggered anywhere
		// this.addCommand({
		// 	id: 'open-modal-simple',
		// 	name: 'Open modal (simple)',
		// 	callback: () => {
		// 		new SampleModal(this.app).open();
		// 	}
		// });
		// // This adds an editor command that can perform some operation on the current editor instance
		// this.addCommand({
		// 	id: 'replace-selected',
		// 	name: 'Replace selected content',
		// 	editorCallback: (editor: Editor, view: MarkdownView) => {
		// 		editor.replaceSelection('Sample editor command');
		// 	}
		// });
		// // This adds a complex command that can check whether the current state of the app allows execution of the command
		// this.addCommand({
		// 	id: 'open-modal-complex',
		// 	name: 'Open modal (complex)',
		// 	checkCallback: (checking: boolean) => {
		// 		// Conditions to check
		// 		const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
		// 		if (markdownView) {
		// 			// If checking is true, we're simply "checking" if the command can be run.
		// 			// If checking is false, then we want to actually perform the operation.
		// 			if (!checking) {
		// 				new SampleModal(this.app).open();
		// 			}

		// 			// This command will only show up in Command Palette when the check function returns true
		// 			return true;
		// 		}
		// 		return false;
		// 	}
		// });

		// This adds a settings tab so the user can configure various aspects of the plugin
		// this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
		// 	new Notice("Click");
		// });

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		// this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));

	}

	onunload() {
		if (this.intervalUpdateTitle) {
			clearInterval(this.intervalUpdateTitle);
		}
		// this.pathInTabTitleComponent.unload();
	}

	// async loadSettings() {
	// 	this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<MyPluginSettings>);
	// }

	// async saveSettings() {
	// 	await this.saveData(this.settings);
	// }
}
