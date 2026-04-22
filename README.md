# Obsidian path in tab title plugin

![plugin screenshot](./doc/path-in-tab-title.png)

## Installation

Copy over `main.js`, `manifest.json` to your vault into subfolder `.obsidian/plugins/path-in-tab-title/`. Restart Obsidian, enable plugin in settings (`[Cogwheel button] -> Community plugins -> Installed Plugins`)

## Known limitations

- There is the delay before updating tab title.
- Tabs titles are reset to default after the app restart.
- Only focused tabs titles are changed

## Styling

Recommended styles:

```css
.workspace-tab-header-inner-title small {
  opacity: 70%;
}
```

## Build with

- [obsidian-sample-plugin](https://github.com/obsidianmd/obsidian-sample-plugin) by [obsidianmd](https://github.com/obsidianmd)
	- _Template for Obsidian community plugins with build configuration and development best practices._

## See also

- [d9k-obsidian-style-guide](https://github.com/d9k/d9k-obsidian-style-guide)

## Alternative approach

Better to replace this code in `app.js`

```js
            t.prototype.getDisplayText = function() {
                return this.file ? this.file.basename : im.interface.noFile()
            }
```

with something like

```js
            t.prototype.getDisplayText = function() {
    			      // return this.file ? this.file.basename : im.interface.noFile()
                if (!this.file) {
                    return im.interface.noFile();
                }

                return this.file.path.split('/').slice(-2).join('/')
            }
```

But I don't know how to patch Electron app :man_shrugging:

