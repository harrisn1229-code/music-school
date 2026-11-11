# Music School

A self-paced music school that runs in the browser and installs like an app: classes, courses and
lessons, homework, spaced-repetition quizzes, ear training, technique drills with a tempo log, a
song library, and the notes behind all of it.

**Open it:** <https://harrisn1229-code.github.io/music-school/> (GitHub Pages, served from `docs/`
on `main`). Add it to a phone's Home Screen or a computer's Dock and it opens with no connection.

- **Your progress stays on your device.** It is saved in the browser as you go. *Activity & backup*
  exports it as one file, imports one, and can keep several devices the same through a private
  gist on your own GitHub account (the same connection the Music app uses).
- **Nothing licensed is in here.** See below.

## What is not included, and how the app handles it

This repo is public, so it carries only what can be given away. Wherever the school uses something
that can't be, the app shows a slot with the file's name and you add your own copy. Copies are kept
in the browser on that device (IndexedDB). They are never uploaded, and they are not part of a
backup or of sync.

| Not in the repo | In the app |
| --- | --- |
| *A Modern Method for Guitar, Vol. 1* (Leavitt, Berklee Press) — courses 25–28 | Add your own PDF; each lesson draws the pages it cites from it |
| Chord-chart and sheet-music PDFs for the song library | Each song lists the chart it expects; add that file or any other |
| Album art | Lettered tile until you add a cover |
| Screenshots and handouts that notes embed (plugin screens, third-party PDFs) | A slot in the note, by file name |
| Video transcripts | Not used; notes link to the video |
| Video thumbnails | Linked from YouTube when online, not copied |

**My files** in the app lists every slot. Files are matched by **name**, so *add files* or *add a
folder* takes a whole pile at once and keeps only what the school has a place for.

*The Virtuoso Pianist* (C. L. Hanon, 1873) is in the public domain and ships with the app.

## What is in here

```
docs/                         The built app — what GitHub Pages serves. Generated; do not hand-edit.
00 Human/20 Music/School & Content/
    Curriculum/               Classes, courses, concepts, tests, school config
    Theory/ Guitar/ Bass/ Piano/ Production/ Ensemble/ Song Library/ YouTube Notes/
                              The notes the lessons read from (Markdown, Obsidian-style links)
Machine/Scripts/school-artifact/
    build.py                  Builds docs/ from the notes
    app.js  app.css           The app
    app-shell/                index.html, start-up, offline worker, file store, fonts, icons, pdf.js
Machine/School/               syllabus.json, eartrain.json
Machine/Workflows/school.md   How the school itself works (enrolment, releases, tests)
```

## Changing it

1. Edit a note, `app.js`, `app.css`, or something in `app-shell/`.
2. Rebuild: `python3 Machine/Scripts/school-artifact/build.py`
   (needs Python 3 with `markdown`; `poppler` + `imagemagick` only if the Hanon pages in
   `docs/books/` are ever deleted).
3. Commit — including `docs/` — and push. Pages updates in a minute or two. An installed copy
   picks the new version up in the background and shows it the next time it is opened.

`build.py --artifact --user <name> --new-user --out school-<name>.html` still writes the old
single-file page (the one published as a Claude artifact).

## Licences

The school's own notes, curriculum and code are © their author. Bundled third-party pieces keep
their own licences: the fonts in `app-shell/fonts/` (SIL Open Font License) and pdf.js in
`app-shell/vendor/pdfjs/` (Apache 2.0).
