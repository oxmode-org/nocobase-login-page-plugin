# NocoBase Login Page Plugin

[![NocoBase 2.x](https://img.shields.io/badge/NocoBase-2.x-1f6feb)](https://www.nocobase.com/)
[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-blue.svg)](LICENSE)
[![Latest release](https://img.shields.io/github/v/release/oxmode-org/nocobase-login-page-plugin)](https://github.com/oxmode-org/nocobase-login-page-plugin/releases/latest)

A community plugin for configuring the public login page in **NocoBase 2.2.x+**. It provides multiple layouts, a background-image carousel, technical-support text, and preserves NocoBase's native authentication flow.

> The plugin package is **not published to npm**. Install the signed release `.tgz` from GitHub Releases.

## Features

- **Three responsive layouts**
  - **Default** — clean, focused sign-in form.
  - **Center** — sign-in form over a full-screen background-image carousel.
  - **Left and right** — carousel beside the sign-in form; stacks vertically on smaller screens.
- **Background-image carousel** — upload and order multiple images from the plugin settings page.
- **System logo support** — displays the logo configured in NocoBase System Settings, with a bundled OXMODE logo fallback.
- **Public-login media handling** — selected logo and background images work even when NocoBase attachments require authentication.
- **Native authentication compatibility** — keeps NocoBase authenticators, sign-up behaviour, language switcher, and `Powered by NocoBase` attribution intact.
- **Technical-support footer** — configure a plain-text support message shown below the login form.
- **English, Vietnamese, and Simplified Chinese UI strings.**

## Compatibility

| Requirement | Supported |
| --- | --- |
| NocoBase | `2.2.x+` |
| Build/test baseline | `2.2.0-beta.9` |
| Verified production runtime | `2.2.0-beta.15` |
| NocoBase 1.x | No — use the [upstream plugin](https://github.com/youchaoyun/nocobase-login-settings) instead |

The package includes both the legacy client entry and the NocoBase client-v2 entry so existing 2.2 installations can use the relevant login shell.

## Installation

### Admin UI — recommended

1. Download the latest `masuphan-plugin-login-page-<version>.tgz` from [GitHub Releases](https://github.com/oxmode-org/nocobase-login-page-plugin/releases/latest).
2. Sign in as a NocoBase administrator.
3. Open **Plugin Management** → **Add & Update** → **Upload Plugin**.
4. Upload the downloaded `.tgz` file and wait for the update to complete.
5. Enable **Login Page** if it is not already enabled.
6. Hard-refresh the browser after an update (`Cmd + Shift + R` on macOS; `Ctrl + Shift + R` on Windows/Linux).

### Server CLI — administrators

Run the command from the NocoBase application directory. Replace the path with the downloaded release file:

```bash
# First installation
yarn nocobase pm add /absolute/path/masuphan-plugin-login-page-1.0.18.tgz

# Update an existing installation
yarn nocobase pm update /absolute/path/masuphan-plugin-login-page-1.0.18.tgz
```

NocoBase may restart or reload plugin processes during an update. Back up production before making any plugin change.

## Configuration

After enabling the plugin, open:

**Admin → Plugin Settings → Login Page**

1. Select **Default**, **Center**, or **Left and right** layout.
2. Upload one or more background images. Only image files are accepted.
3. Add the technical-support text if needed.
4. Click **Submit**.
5. Open the sign-in page in a private/incognito browser window to validate the unauthenticated experience.

### Logo and background-image behaviour

NocoBase attachment files are often private by default. A public sign-in page cannot load those files directly.

This plugin solves that with the public endpoint:

```text
/api/loginPageMedia:get/:attachmentId
```

It serves **only image files** that are either:

1. the current System Settings logo; or
2. linked to the plugin's Login Settings record.

All other attachments remain private. The plugin does **not** grant public `attachments:get` or attachment-list permissions.

> Do not add confidential images as login backgrounds or as the public system logo. Those selected images are intentionally visible to every visitor of the sign-in page.

## Important notes

- The **Title font size** setting remains in the data model for legacy compatibility. Current public layouts use the configured logo rather than rendering a title, so changing this value has no visible effect.
- Background images are used by the **Center** and **Left and right** layouts. The Default layout does not display a carousel.
- The plugin does not replace or modify NocoBase authentication providers. Configure password, SMS, SSO, or sign-up behaviour in NocoBase itself.
- If an update appears unchanged, hard-refresh the browser before investigating server-side cache or permissions.

## Troubleshooting

| Symptom | Check first |
| --- | --- |
| Logo or background is broken on the sign-in page | Upgrade to `1.0.18+`, then hard-refresh. The public-media proxy was introduced in `1.0.18`. |
| Settings page is missing | Confirm the plugin is enabled and open the NocoBase **client-v2** admin interface (`/v2/admin/`). |
| Uploaded image is not displayed | Confirm it was saved in **Login Page** settings and test the sign-in page while logged out. |
| Plugin update fails | Review NocoBase server logs, verify the `.tgz` is intact, and confirm the NocoBase version is compatible. |

When reporting a bug, include the NocoBase version, plugin version, installation method, browser console/network errors, and non-sensitive server logs.

## Development

```bash
npm install
npm run build
npm test
```

`npm pack` runs the build and test suite automatically before producing a distributable `.tgz`.

## Credits and provenance

This project is adapted from [`@youchaoyun/plugin-login-settings`](https://github.com/youchaoyun/nocobase-login-settings) by [有巢数智 / youchaoyun](https://github.com/youchaoyun), originally written for NocoBase 1.x.

- The legacy client-v1 layout and the Login Settings collection schema contain adapted upstream work.
- The NocoBase client-v2 implementation and modern hooks were rewritten for NocoBase 2.x.
- Attribution notices remain in the relevant source files.

## License

This plugin is licensed under [AGPL-3.0](LICENSE). If you modify and run it for users over a network, comply with the source-availability obligations in the license.

- Source: https://github.com/oxmode-org/nocobase-login-page-plugin
- Releases: https://github.com/oxmode-org/nocobase-login-page-plugin/releases
- Issues: https://github.com/oxmode-org/nocobase-login-page-plugin/issues
