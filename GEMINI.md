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