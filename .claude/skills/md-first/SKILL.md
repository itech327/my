---
name: md-first
description: Convert a document to Markdown BEFORE reading it, to cut input tokens. Use whenever a task needs the contents of a PDF, Word, PowerPoint, Excel, HTML, EPUB, RTF, OpenDocument or CSV file, even one you could read directly. Do not read the raw file first.
---

# Markdown first

Raw documents waste tokens: PDF pages load as images plus text, HTML carries tags and scripts, office files carry XML. Markdown keeps the text and structure only.

## Steps

1. Convert into the scratchpad, never beside the source file:

   ```bash
   markitdown "<file>" -o "<scratch>/<name>.md"
   ```

   Error `MissingDependencyException`? Some `markitdown` installs lack converters, such as `.docx`. Install them once:

   ```bash
   pip install 'markitdown[all]'
   ```

   No `markitdown`, or it still fails? Use the fallback:

   ```bash
   npx -y @firecrawl/anydoc "<file>" -o "<scratch>/<name>.md"
   ```

2. Check the size before reading:

   ```bash
   wc -c "<scratch>/<name>.md"
   ```

3. Read only what the task needs:
   - Under 40 KB: read the whole `.md`.
   - Over 40 KB: list headings with `grep -n '^#' <file>.md`, then read the needed sections by line range.
   - Looking for one fact: `grep -n -i '<term>' <file>.md` first.

4. Reuse the `.md` for later questions about the same file. Convert again only if the source changed.

## Fall back to the raw file when

- The `.md` is empty or near empty. Causes: a scanned PDF needs OCR, or an HTML page builds its content with JavaScript. Tell the user, then read the source directly.
- The task depends on layout, images, charts, colors or exact formatting.
- The task edits the original file: convert only to read it, then edit the original with the right tool.
- The file is already plain text: `.md`, `.txt`, source code, `.json`, `.yaml`. Read it directly.
