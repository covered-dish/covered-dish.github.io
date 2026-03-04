# SKILL: Autonomous YouTube Research & NotebookLM Generation

**Description:** This skill automates the process of finding YouTube videos, downloading their transcripts, creating a NotebookLM brain, and generating a full suite of studio artifacts.

**Trigger:** When the user asks to "Run the YouTube NotebookLM pipeline for [Topic]".

## Execution Steps:

### Step 1: YouTube Search & Extraction (yt-dlp)
Open a local terminal instance and use `yt-dlp` to search for the top 5 recent, long, highly-rated videos matching the user's topic. 
- **Command template:** `yt-dlp "ytsearch5:[TOPIC]" --write-subs --sub-langs en --skip-download --get-id > yt_links.txt`
- Ensure the subtitles are written to the local disk and the video URLs/IDs are saved to `yt_links.txt`.

### Step 2: Notebook Initialization (MCP)
Use the NotebookLM MCP `notebook_create` tool to create a new notebook titled "[TOPIC] Master Research". Store the returned Notebook ID for subsequent steps.

### Step 3: Source Ingestion (MCP)
Read the contents of the generated `yt_links.txt` and locate the downloaded subtitle files on the local file system. 
- Use the `source_add` tool to upload the YouTube URLs as web sources.
- Use the `source_add` tool to upload the local subtitle/transcript text files as document sources.

### Step 4: Studio Artifact Generation (MCP)
Utilize the `studio_create` tool to generate a comprehensive suite of assets from the ingested sources. Request the following artifacts:
1. Audio Overview (deep dive format)
2. Video Overview (classic visual style)
3. Mind Map
4. Briefing Doc (report)
5. Flashcards
6. Quiz
7. Infographic
8. Slide Deck
9. Data Table

### Step 5: Polling & File Delivery
Continuously poll the status of the studio content generation. Once the generation status confirms completion, use the `download_artifact` tool to pull every generated asset (audio, video, markdown reports, images) directly onto the local file system in the current working directory. 

Confirm with the user via a checklist with a green tick once all files have been safely downloaded.
