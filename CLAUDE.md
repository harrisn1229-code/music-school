# Music School — instructions for this repo

This repo is the **source of School**, a tool inside the public Music app
(`harrisn1229-code/music`, served at `/music/school/`). It holds the notes in
`00 Human/20 Music/School & Content/` and the build; the built app is written into the `music`
repo's `school/` folder. Both repos are public.

It began as a copy of a private shared vault that published the school as a Claude artifact. That
vault and its artifact pages are separate and still in use by other people. **Nothing done here
should touch them** — do not add that vault's remote, do not publish over anyone's artifact.

## The two rules that matter most

1. **This repo is public. Never commit licensed or third-party material, or anyone's personal
   data.** That means: book scans still in copyright, chord-chart / sheet-music PDFs, album art,
   vendor promo art or manuals (plain plugin screenshots are allowed, see below), paid lesson PDFs, video transcripts or downloads, a teacher's
   lesson material, and any `progress-*.json` or `Users/` folder. `.gitignore` lists the known
   paths; a new kind of file needs the same judgement. If unsure, leave it out and say so —
   something pushed to a public repo cannot be taken back.
2. **Never hand-edit the built app** (`music/school/`). Edit the sources here and rebuild.

## How licensed material is handled instead

Anything the school uses but cannot ship is a **named slot**. The file reaches the reader one of
two ways, and is then kept in their browser (IndexedDB, `app-shell/files.js`):

- from the **account's private bucket** (`school-files` in the Supabase project named in
  `music/shared/cloud-config.js`) if they are signed in and on the members list — automatic, and
  an owner fills the bucket just by adding files in the app;
- or **by hand**, their own copy, added on the My files page.

Private files go in that bucket. They never go in either repo.

| Slot | Where the name comes from |
| --- | --- |
| A book (`BOOKS` in build.py, not in `PUBLISHABLE_BOOKS`) | the PDF's file name; lessons carry the cited pages |
| A song's chart | `Song Library/Files/_filenames.txt`, matched to songs by file name |
| A song's cover | the `![[Images/…]]` embed in the song note |
| Anything else a note embeds | any `![[file]]` whose file is not in the repo |

The join is always the **file name**. To add a new slot, just reference the file from a note (or
add its name to `_filenames.txt`) and do not commit the file. A file that *is* in the repo and is
embedded by a note is shipped (`files/` in the built app; pictures are re-encoded as WebP) and shown
directly. A chart PDF that is in `Song Library/Files/` ships the same way.

**What may be in the repo** (owner's decision, 2026-11-11):

- the author's own files (handwritten notes, his own charts and photos);
- public-domain scores, from a public-domain edition (Hanon; Satie's Gymnopédies, IMSLP scan);
- plain screenshots of a plugin's own window, shown in the note about that plugin
  (`Production/Plugins/Images/`).

**What may not**, even though it can be found online: chord sheets and tabs printed from a site
(they carry the full lyrics), published or purchased sheet music, a teacher's handouts (Bernth,
PianoGroove), album art, downloaded videos, video thumbnails and vendor promo art, manuals. Free
to view is not free to republish. Those stay named slots, filled from the account's private bucket.

## Building and publishing

```
python3 Machine/Scripts/school-artifact/build.py --dest ../music/school   # writes the app into the music repo
git add -A && git commit && git push                                       # here (the source)
cd ../music && git add -A && git commit && git push                        # there (what Pages serves)
```

- Read the build output. `!` lines are problems; `~ unresolved` lines are Read pointers that fell
  back to a link.
- School has its own service worker (`school/sw.js`), regenerated with a hash of every file, so
  installed copies update themselves file by file; there is no version to bump for School. Raise
  `version` in `music/apps.js` only when something outside `school/` changes.
- To check a change, serve the `music` folder (`python3 -m http.server` inside it) and open
  `/school/`.

## Where things are

| | |
|---|---|
| The curriculum | `00 Human/20 Music/School & Content/Curriculum/` |
| The notes lessons read from | the other folders under `School & Content/` |
| The app | `Machine/Scripts/school-artifact/app.js`, `app.css` |
| Start-up, offline, file store, icons | `Machine/Scripts/school-artifact/app-shell/` |
| The Music app's look, laid over `app.css` | `Machine/Scripts/school-artifact/app-shell/music-skin.css` |
| The build | `Machine/Scripts/school-artifact/build.py` |
| How the school works (enrolment, releases, tests) | `Machine/Workflows/school.md` |

`app.js` runs in two modes. `LOCAL` (set by the app's `index.html`) is this app: progress in
`localStorage` under `school:progress`, saved to the reader's Music account when signed in
(`music/shared/cloud.js`), files in IndexedDB, tests marked through `music/shared/ai.js`. Without
it, the same file is the single-file artifact page (`build.py --artifact`), which saves by
republishing itself. Keep both working: guard app-only code with `LOCAL`.

**One style across Music.** `app.css` is the school's original look and is what the artifact page
uses. The app adds `app-shell/music-skin.css` on top: Music's tokens (grey page, white cards,
system typeface, heavy headings, pill buttons, ink for whatever is selected) and the header bar
every Music tool has. Restyle the app there, tokens first; change `app.css` only for layout that
should change in both. `library.html` is the same app in library mode (`LIBMODE`): the Songs,
Drills, Originals and My files shelves that Music's Library tool links to.

## Things carried over from the vault that work differently here

- **Progress** is per device, not `Machine/School/progress-<user>.json`. A backup exported from the
  app has that file's shape.
- **Tests and finals** are sat and marked in the app: `build.py` ships each paper and its key
  (`C.papers`), the reader answers on the page, and "Grade test" has Claude mark it and writes
  the result into progress by the rules in `Machine/Workflows/school.md` (`applyPaperResult` in
  `app.js`). A paper that was sat in the vault carries that attempt inline; the build reads only
  the questions and the key, never the typed answers. `/school test` in chat still works for the
  artifact page; if you run one, read only up to `## ✅ End of questions`.
- **`/school sync`, `sync.py`, the Obsidian plugin** belong to the artifact workflow. They are kept
  for reference and for `--artifact` builds; the app does not use them.
