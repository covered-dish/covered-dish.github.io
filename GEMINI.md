# GEMINI.md - YouTube to NotebookLM Autonomous Pipeline

## Phase 1: Blueprint (Vision & Logic)
**Singular Desired Outcome:** To operate as an autonomous research and media generation agent that extracts transcripts from YouTube using `yt-dlp`, ingests them into Google NotebookLM via MCP, generates comprehensive studio artifacts, and utilizes the notebook's chat capabilities to write grounded essays and website content without human interaction. 

**Sources of Truth:**
- Local file system (current working directory) for downloaded `.vtt`/`.srt` transcripts and `yt_links.txt`.
- Google NotebookLM for synthesized research and artifact generation.

## Phase 2: Links (Integrations)
This project requires two core integrations to function:
1. **yt-dlp CLI:** Used as a local command-line subprocess to query YouTube and download subtitle/transcript files.
2. **NotebookLM MCP Server:** Connected via AntiGravity's MCP configuration. Provides the necessary tools (`notebook_create`, `source_add`, `studio_create`, `download_artifact`) to interface with NotebookLM.

## Phase 3: Architectural Layer (Workflow Execution)
The agent must execute tasks methodically:
1. `yt-dlp` CLI scrapes data.
2. NotebookLM MCP creates a notebook and ingests the scraped sources.
3. NotebookLM MCP queries the notebook to draft an essay and website copy.
4. NotebookLM MCP generates Studio assets.
5. The agent waits for generation to complete, then downloads and saves all text and media artifacts locally.

## Phase 4: Operating Principles
- **Data First Rule:** Validate that `yt-dlp` has successfully created transcript files locally before attempting to upload them to NotebookLM.
- **One Task Per Step:** Execute the pipeline sequentially. Do not attempt to run `yt-dlp` downloads and NotebookLM source ingestion simultaneously.
- **Self-Healing Repair Loops:** If the NotebookLM MCP server returns an error or a generation is pending, wait and poll the status instead of failing.
- **Cost/Context Efficiency:** Rely on concise prompts and utilize targeted MCP tool calls to prevent context window rot.

## All phases: git workflow
- Use background workers for implementation
- Use git worktrees for workers
- Use feature branches
- Create issues using the gh cli
- Each worker works on a single GitHub issue, creates a feature branch, compeletes work, verifies with automated checks and tests, create pull request with gh cli
- The Google Code Assist GitHub app will post code review comments on the pull request, you must wait for these and fix all issues using fresh background workers
- Do not merge the pull request until all checks pass and the Google Code Assist app gives the green light
- Resolve conflicts and merge
- After merge watch the github actions for CI/CD on the main branch make sure it is green
- Make sure the GitHub pages site deploys successfully
- Verify the changes in the browser

## Learned Processes & Knowledge

### yt-dlp YouTube Research Pattern
1. Use `yt-dlp "ytsearch20:query" --flat-playlist --dump-json --no-download` for search
2. Parse JSON output with Python to filter by duration (>300s), view count, and title keywords
3. Run multiple targeted searches with different query angles for comprehensive coverage
4. Download transcripts: `yt-dlp --write-auto-sub --sub-lang en --skip-download --sub-format vtt -o path url`
5. Save metadata.json, yt_links.txt, and transcripts/ directory per topic

### NotebookLM MCP Workflow
1. `mcp_notebooklm_notebook_create(title)` — returns notebook_id
2. `mcp_notebooklm_source_add(notebook_id, source_type="url", urls=[...], wait=True)` — bulk add YouTube URLs
3. `mcp_notebooklm_notebook_query(notebook_id, query, timeout=180)` — generate grounded essay
4. Remove footnotes from essay: `re.sub(r'\s*\[\d+(?:[,\-]\s*\d+)*\]', '', text)`
5. Launch all 9 artifact types via `mcp_notebooklm_studio_create` (audio, video, report, mind_map, slide_deck, infographic, data_table, quiz, flashcards)
6. Poll `mcp_notebooklm_studio_status` until completed
7. Download artifacts via `nlm download <type> <nb-id> --output path` (CLI) or `mcp_notebooklm_download_artifact` (MCP)
8. **Known issue:** Quiz JSON downloads may have empty `questions` array — download as HTML format as fallback or use `quiz2.json` with artifact_id

### Image Generation & Processing Pattern
1. Use `generate_image` tool with detailed charcoal/pencil sketch prompts matching logo aesthetic
2. Apply white vignette with ImageMagick: `magick input.png -background white -flatten -vignette 0x80+40+40 output.png`
3. Copy vignetted images to `docs/images/` for the site

### Site Architecture Pattern
- `docs/` is GitHub Pages root (configured for main branch)
- `docs/css/style.css` — design system (fonts, colors, components)
- `docs/js/app.js` — search/filter, interactive quiz, flashcards
- `docs/topics/{topic-slug}/index.html` — sub-site template
- `docs/topics/{topic-slug}/assets/` — media files (audio, infographic)
- `data/{topic-slug}/` — raw research data (not served by Pages)

### Interactive Quiz Implementation
- Quiz data embedded in HTML via `data-questions` attribute as JSON
- JavaScript parses and renders questions dynamically
- Click handlers grade answers with correct/incorrect styling
- Running score displayed after all questions answered

### Key Environment Details
- `yt-dlp` at `/Users/bedwards/miniconda3/envs/wdi/bin/yt-dlp` (v2026.02.04)
- ImageMagick at `/usr/local/bin/magick`
- Git remote: `git@github.com:covered-dish/covered-dish.github.io.git`
- GitHub Pages URL: `https://covered-dish.github.io`
- NLM notebooks: Bitwig (`e3b05129`), Guitar Technique (`b3d21720`)

### Topics Registry
1. **Bitwig Acoustic Folk Production** — LIVE (16 videos, full artifacts)
2. **Acoustic Guitar Technique** — LIVE (16 videos, full artifacts)
3. **Vibe Coding Literary Fiction** — QUEUED (Claude Code + Antigravity fiction workflows)
4. **Literary Fiction Reviews** — QUEUED (20 books: Bolaño, McCarthy, Knausgaard, Carson, etc.)