# Music School — instructions for this repo

This repo is the **public, standalone Music School app**. It is built from the notes in
`00 Human/20 Music/School & Content/` and served by GitHub Pages from `docs/`.

It began as a copy of a private shared vault that published the school as a Claude artifact. That
vault and its artifact pages are separate and still in use by other people. **Nothing done here
should touch them** — do not add that vault's remote, do not publish over anyone's artifact.

## The two rules that matter most

1. **This repo is public. Never commit licensed or third-party material, or anyone's personal
   data.** That means: book scans still in copyright, chord-chart / sheet-music PDFs, album art,
   vendor screenshots or manuals, paid lesson PDFs, video transcripts or downloads, a teacher's
   lesson material, and any `progress-*.json` or `Users/` folder. `.gitignore` lists the known
   paths; a new kind of file needs the same judgement. If unsure, leave it out and say so —
   something pushed to a public repo cannot be taken back.
2. **Never hand-edit `docs/`.** Edit the sources and rebuild.

## How licensed material is handled instead

Anything the school uses but cannot ship is a **named slot**. The reader adds their own copy in the
app; it is stored in their browser (IndexedDB, `app-shell/files.js`) and never uploaded.

| Slot | Where the name comes from |
| --- | --- |
| A book (`BOOKS` in build.py, not in `PUBLISHABLE_BOOKS`) | the PDF's file name; lessons carry the cited pages |
| A song's chart | `Song Library/Files/_filenames.txt`, matched to songs by file name |
| A song's cover | the `![[Images/…]]` embed in the song note |
| Anything else a note embeds | any `![[file]]` whose file is not in the repo |

The join is always the **file name**. To add a new slot, just reference the file from a note (or
add its name to `_filenames.txt`) and do not commit the file. A file that *is* in the repo and is
embedded by a note is copied to `docs/files/` and shown directly — only do that for files that are
the author's own or public domain.

## Building and publishing

```
python3 Machine/Scripts/school-artifact/build.py     # writes docs/
git add -A && git commit && git push                  # Pages serves docs/ from main
```

- Read the build output. `!` lines are problems; `~ unresolved` lines are Read pointers that fell
  back to a link.
- The service worker (`docs/sw.js`) is regenerated with a hash of every file, so installed copies
  update themselves; there is no version number to bump.
- To check a change, serve `docs/` (`python3 -m http.server` inside it) and open it. Progress and
  added files in that browser are separate from the published site's.

## Where things are

| | |
|---|---|
| The curriculum | `00 Human/20 Music/School & Content/Curriculum/` |
| The notes lessons read from | the other folders under `School & Content/` |
| The app | `Machine/Scripts/school-artifact/app.js`, `app.css` |
| Start-up, offline, file store, fonts, icons | `Machine/Scripts/school-artifact/app-shell/` |
| The build | `Machine/Scripts/school-artifact/build.py` |
| How the school works (enrolment, releases, tests) | `Machine/Workflows/school.md` |

`app.js` runs in two modes. `LOCAL` (set by `docs/index.html`) is this app: progress in
`localStorage` under `music-school:progress`, optional GitHub gist sync using the Music app's
token (`music:ghToken`), files in IndexedDB. Without it, the same file is the single-file artifact
page (`build.py --artifact`), which saves by republishing itself. Keep both working: guard
app-only code with `LOCAL`.

## Things carried over from the vault that work differently here

- **Progress** is per device, not `Machine/School/progress-<user>.json`. A backup exported from the
  app has that file's shape.
- **Tests and finals** are still sat in chat (`/school test <course> <lesson>`, see
  `Machine/Workflows/school.md`). When running one, read only up to `## ✅ End of questions` —
  loading the answer key early leaks answers. Results do not flow into the app on their own yet;
  the reader completes the lesson in the app.
- **`/school sync`, `sync.py`, the Obsidian plugin** belong to the artifact workflow. They are kept
  for reference and for `--artifact` builds; the app does not use them.
