# Components

Specs for the TTS clone. Built from the recon component list (recon.md) and
the measured pages in `replica/screens/`. All sizes in px. All colours are
token roles from `tokens.json`. Layout uses logical properties, so the RTL
start side is the right edge.

Base: Radix primitives (or shadcn/ui on top of them) for anything with
focus management: menus, dialogs, accordions, sliders, popovers.
Icons: Lucide, MIT.

Every component lists the screens it serves, by S-ID from recon.md.

---

```
Button
  variants  ink (main action), secondary (outline), ghost, danger
  sizes     sm 32, md 40, lg 52 (the hero call to action)
  shape     pill (radius pill)
  states    default, hover (ink: 90% lightness shift), active (scale .98),
            focus-visible (2px focus ring, offset 2), disabled (40% opacity,
            no pointer), loading (spinner at the start side, label kept)
  tokens    ink: bg ink, text on-ink. secondary: bg surface, border border,
            text text. danger: bg danger, text on-ink
            font sm/600 for sm and md, lg/700 for lg. padding-inline 16/20/40
  icons     optional leading or trailing icon, 16px. Directional arrows
            mirror in RTL (an arrow pointing "forward" points left)
  a11y      real <button> or <a> for navigation. Loading sets aria-busy,
            keeps the text for screen readers
  used on   all
```

```
TopNav
  layout    3 zones in a 64px header: brand at the start, a centred pill of
            links, the account action at the end. Below md: brand plus a
            menu button that opens a sheet
  pill      bg surface-sunken, border border, radius pill, height 44, gap 4.
            Items are ghost buttons. The current page is an ink button with
            aria-current="page"
  states    default, scrolled (shadow card, bg surface), mobile sheet open
  a11y      <nav aria-label>, sheet traps focus and closes on Escape
  used on   S01 to S07, app shell
```

```
Badge
  variants  premium, neutral, success
  size      height 20, padding-inline 8, font xs/600, radius pill
  tokens    premium: bg badge, text on-badge. neutral: bg accent-soft, text
            on-accent-soft. success: bg success-soft, text on-success-soft
  a11y      decorative text stays in the reading order. No colour-only meaning
  used on   S01, S02, S03, S11
```

```
AudioPlayer
  variants  inline (voice cards, history rows), large (editor result),
            compare (two inline players, labelled "original" and "cloned")
  parts     play/pause button (ink circle 40, icon 18), progress slider,
            current time, total time, download button (large only)
  layout    row inside a surface-sunken well, radius md, padding 12.
            Times use tabular numbers and always render LTR ("0:16")
  states    idle, loading (spinner in the play button), playing, paused,
            ended (button shows replay), error ("couldn't load audio", retry)
  tokens    track border-input, filled part ink, thumb ink 12
  a11y      play button has aria-label with the voice name and state.
            Slider is a Radix slider with aria-valuetext "0:16 of 0:55".
            Space toggles play when the player is focused. Only one player
            plays at a time on a page
  used on   S01, S02, S10, S11, S12, S13, S14
```

```
VoiceCard
  size      min width 280, grid of 3 at lg, 2 at md, 1 below
  parts     avatar (48 circle, generated pattern from the voice id, no
            photos), name (lg/600), premium badge, use-case label with icon
            (sm, text-muted), inline AudioPlayer
  states    default, hover (shadow raised), selected (border-strong 2px,
            check at the end corner), playing (player state), disabled
            (premium voice on the free plan: lock icon and "upgrade" link)
  tokens    bg surface, border border, radius lg, padding 16, gap 12
  a11y      in the voice picker the card is a radio in a radiogroup. On
            marketing pages it is a plain article
  used on   S01, S02, S10, S11
```

```
DialectChip
  variants  link (marketing, goes to /[dialect]), toggle (filters and picker)
  size      height 36, padding-inline 16, font sm/500, radius pill
  states    default (bg surface, border border), hover, selected (bg ink,
            text on-ink), focus-visible, disabled
  content   the dialect name in Arabic. Optional flag emoji off by default
  a11y      toggles are aria-pressed buttons, or radios when only one can
            be chosen
  used on   S01, S02, S10, S11
```

```
DialectSelect / VoiceSelect
  pattern   combobox with search (Radix Popover plus a listbox)
  parts     trigger showing the current dialect or voice, search input,
            grouped options (dialect: Maghreb, Egypt, Gulf, Levant, Fusha),
            voice option shows name, gender, use case and a preview button
  states    closed, open, filtered empty ("no voice matches"), loading
  a11y      aria-expanded, aria-activedescendant, type-ahead works with
            Arabic letters
  used on   S10, S11
```

```
TextEditor
  parts     contenteditable area with dir="auto", toolbar of EmotionTags,
            character and word counter, estimated seconds and cost, clear
  size      min height 240, grows to 60vh then scrolls
  states    empty (placeholder text in text-muted), filled, over balance
            (counter turns danger, generate disabled, "buy minutes" link),
            over the per-request limit, saving
  tokens    bg surface, border border-input, radius lg, padding 16,
            focus ring focus
  rules     counter ignores tashkeel when estimating cost. Pasted rich text
            is stripped to plain text plus our own tags
  a11y      labelled textbox, counter is a polite live region, tags read as
            "whisper starts" and "whisper ends"
  used on   S10
```

```
EmotionTag
  variants  laugh, whisper, sad, angry, fast, slow, more (menu)
  toolbar   row of small secondary buttons with an icon and a word
  applied   tagged text gets a soft background per tag and a small label at
            the start of the span. Colours come from accent-soft until the
            rebrand picks per-tag tints that pass contrast
  states    disabled when nothing is selected, active when the caret is
            inside a tagged span (clicking removes the tag)
  a11y      toolbar role with arrow-key navigation, each button has
            aria-pressed for the current selection
  used on   S01 demo, S10
```

```
SfxCard
  parts     title (lg/600), one-line prompt in text-muted, inline AudioPlayer
  tokens    as VoiceCard, no avatar
  used on   S01, S02, S13
```

```
PlanCard
  variants  paid (border-strong 1px, name tab on the top edge), free
            (border border, centred under the paid row), current plan
            (success badge "your plan")
  parts     name tab (ink pill straddling the top border), price (2xl/800)
            with currency and period in text-muted, minutes line in bold,
            feature list with check icons in success-soft circles, validity
            note (xs, text-muted), savings pill (success-soft), call to
            action button full width
  layout    4 paid cards in a row at xl, 2 at md, 1 below. radius lg,
            padding 24
  states    default, hover (shadow raised), loading prices (skeleton
            blocks, not a full-page spinner), currency switched
  rules     prices come from the server in the user's currency. Never a
            converted guess in the browser
  a11y      each card is a list item with a heading. The savings pill is
            text, not only colour
  used on   S03, S15
```

```
Accordion (FAQ)
  parts     question row (lg/600) with a chevron at the end, answer (base,
            text-muted)
  states    closed, open, focus-visible
  a11y      Radix Accordion: buttons with aria-expanded, regions labelled by
            their question
  used on   S01, S02, S03
```

```
BalanceMeter
  parts     minutes and seconds left, a thin bar against the current
            pack, next expiry date, "buy minutes" link
  states    healthy, low (under 10% or under 60 seconds: warning colour
            and text, not only colour), empty (danger, generate disabled)
  a11y      role="meter" with aria-valuenow and a readable valuetext
  used on   S10, S15, app header
```

```
HistoryRow
  parts     first line of the text, voice and dialect, date, duration,
            seconds charged, inline AudioPlayer, download, regenerate,
            "expires in 3 days" note
  states    queued, running (progress), done, failed (reason, seconds
            refunded), expired (no player, text cleared)
  used on   S14
```

```
Field (Input, Textarea, Select, Checkbox)
  size      height 44, radius md, padding-inline 12
  states    default (border border-input), hover, focus (focus ring),
            invalid (border danger plus a message below with an icon),
            disabled
  a11y      visible label above, hint and error tied with aria-describedby
  used on   S05, S08, S09, S12, S16
```

```
Dialog
  variants  confirm (delete account, revoke key), form (create key, clone
            voice consent)
  parts     title, body, actions at the end side, close button
  a11y      Radix Dialog: focus trapped, Escape closes, focus returns to the
            trigger. Destructive confirms need the user to type a word
  used on   S12, S16
```

```
Toast
  variants  success, error, info
  placement bottom, centred on mobile, at the end corner on desktop
  a11y      polite live region, errors assertive. Auto-dismiss 5s, paused
            on hover and focus
  used on   app wide
```

```
EmptyState
  parts     icon (Lucide, 32, text-muted), one-line title, one-line help,
            one primary action
  cases     no history yet, no cloned voices, no API keys, search with no
            results
  used on   S11, S12, S14, S16
```

---

What is deliberately different from the original:

- No multi-colour gradient heading. That gradient is the original's signature
  look. The accent stays neutral until /replica-brand picks our own.
- No photos or decorative 3D gradient avatars. Voice avatars are generated
  patterns from the voice id.
- Input and track greys darkened to pass 3:1. The original's do not.
- Pricing loads as skeleton cards, not a full-page spinner.
- IBM Plex Sans Arabic instead of Tajawal.
