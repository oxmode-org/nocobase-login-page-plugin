# NocoBase Login Page Plugin

NocoBase 2.x plugin for customizing the login page layout, background image carousel, title font size, and technical support text.

## Features

- **Three login layouts**
  - **Default**: Clean NocoBase login page structure.
  - **Center**: Login form centered with full-screen background image carousel.
  - **Left-Right**: Background carousel on left, login form on right (auto-stacks vertically on narrow screens).
- **Background image upload + carousel**: Upload multiple images, auto-rotates in Center and Left-Right layouts.
- **Title font size**: Configure login page title font size independently.
- **Technical support text**: Customizable footer text.
- **Preserves native auth**: Compatible with all NocoBase authenticators (password, SMS, WeCom, etc.) and language switcher.
- **Admin config UI**: Adds a "Login Page" settings page in Plugin Settings.

## Compatibility

- **NocoBase 2.2.x** (build/test baseline: `2.2.0-beta.9`)
- For NocoBase 1.x, use the [original plugin](https://github.com/youchaoyun/nocobase-login-settings) by 有巢数智.

## Installation

### Via Upload (recommended)

1. Download the latest `.tgz` from [Releases](https://github.com/oxmode-org/nocobase-login-page/releases).
2. Go to NocoBase Admin → **Plugin Management** → **Add & Update** → **Upload Plugin**.
3. Upload the `.tgz` file.
4. Enable the plugin.
5. Restart NocoBase if prompted.

### Via npm (if published)

```bash
npm install @masuphan/plugin-login-page
```

## Usage

1. After enabling, go to **Plugin Settings** → **Login Page**.
2. Choose a layout:
   - `Default`: No background image config.
   - `Center`: Centered login form with full-screen carousel.
   - `Left-Right`: Left carousel, right login form.
3. Upload background images (multiple allowed).
4. Set title font size (e.g., `32`).
5. Set technical support text.
6. Click **Submit**. Visit the login page to see the result.

## Credits

Adapted and ported from [`@youchaoyun/plugin-login-settings`](https://github.com/youchaoyun/nocobase-login-settings) by [有巢数智](https://github.com/youchaoyun) (originally for NocoBase 1.x). The legacy client v1 layout and database collection schema are directly adapted from the original plugin, while the client-v2 layout and modern hooks have been completely rewritten to support NocoBase 2.x natively.

## License

AGPL-3.0