# moXx

**An overly demanding personal journal that looks like an X profile and punishes you for wanting convenience.**

There is no text box, no editor, and no "post" form. To write an entry, you open `index.html`, type it out by hand, commit, and push. If your code is sloppy, the build fails. If your thoughts are short, the page deletes them.

Built with plain HTML, CSS, and vanilla JavaScript. No frameworks, no build tools, no external libraries. Hosted on GitHub Pages.

---

## Features

### 1. The "New Entry" button that refuses
A large, pulsing **New Entry** button sits where X puts its "Post" button. Clicking it shows:

> Access Denied. You know where the HTML file is. Go write some code.

It never opens anything. It only reminds you that the real way to post is through `index.html`.

### 2. Word count enforcer
When the page loads, every paragraph inside an `.entry` is checked. Any entry with **fewer than 50 words** has its text replaced with:

> Entry rejected at runtime: Insufficient reflection. Try harder.

The rejected entry is shown in a red box, so everyone can see you didn't try hard enough. The original text is still in the HTML; it just never gets displayed.

### 3. Anti-plagiarism (no copy, cut, or paste)
Your past thoughts stay where you left them. On the page:

- `copy`, `cut`, and `paste` events are blocked.
- **Ctrl+C / Ctrl+V / Ctrl+X** and **Cmd+C / Cmd+V / Cmd+X** do nothing.

You can still select text. You just can't take it anywhere.

### 4. X-style profile timeline
The layout copies X's profile page:

- **Left sidebar** with Home, Explore, Notifications, Messages, Bookmarks, Communities, Profile, and More, plus an account card at the bottom.
- **Profile header** with a sticky top bar and live entry count, banner, avatar, verified badge ("Verified by JSLint"), bio, join date, and follower stats.
- **Tabs** for Posts, Replies, Highlights, Articles, Media, and Likes, with the blue active underline.
- **Entries** styled as posts: avatar, name, handle, date, and reply / repost / like / views / share counts. One entry is pinned with the house rules.
- **Right sidebar** with a "Search your feelings" bar, a sold-out *Premium Introspection* offer, trends like `#InsufficientReflection`, and suggestions to follow JSLint and your future self.

It's always in **dark mode**, matching X's "Lights out" theme. On smaller screens it changes the same way X does: icon-only sidebar, then no right column, then a bottom tab bar with a floating **New Entry** button on phones.

None of the navigation, tabs, or Follow buttons do anything. They're for show.

### 5. Strict CI: JSLint or nothing
`ci.yaml` is a GitHub Actions workflow that runs on every push to `main`, in two jobs:

1. **Lint:** runs the official [JSLint](https://github.com/jslint-org/jslint) (pinned to `@jslint-org/jslint@2026.9.29`) on `script.js`. Any warning fails the build.
2. **Deploy:** runs only if linting passes. It publishes `index.html`, `style.css`, and `script.js` to GitHub Pages using the official `configure-pages`, `upload-pages-artifact`, and `deploy-pages` actions.

> **Note:** GitHub only runs workflows stored in `.github/workflows/`. `ci.yaml` is kept at the repo root, so it won't run until it's placed there. Pages also needs **Settings → Pages → Source: GitHub Actions**.

---

## How to add an entry

There is no shortcut. There will never be a shortcut.

1. Open `index.html` and find the **HOW TO ADD AN ENTRY** comment inside the timeline.
2. Type a new `<article class="entry">` block just under the pinned entry, so the newest entry is at the top. The template is in the comment.
3. Write **at least 50 words** inside the single `<p>` tag. Use one `<p>` per entry, because each paragraph is counted on its own.
4. Commit and push:

   ```sh
   git add index.html
   git commit -m "a meaningful message"
   git push origin main
   ```

5. Wait for JSLint to judge you.

---

## Project structure

| File | Purpose |
| --- | --- |
| `index.html` | The profile page and every journal entry. This is the only way to post. |
| `style.css` | X-style dark layout, responsive breakpoints, and icons (drawn with CSS masks so entries stay short to type). |
| `script.js` | The New Entry alert, word count enforcer, copy/paste blocking, and entry counter. Written to pass strict JSLint. |
| `ci.yaml` | GitHub Actions workflow: JSLint, then deploy to GitHub Pages. |

## Run it locally

Open `index.html` in a browser. No server or install needed.

To lint the script yourself (requires Node.js):

```sh
npm install --no-save @jslint-org/jslint@2026.9.29
node node_modules/@jslint-org/jslint/jslint.mjs script.js
```

No output and exit code `0` means it passed.

---

*moXx is a parody project and is not affiliated with X Corp.*
