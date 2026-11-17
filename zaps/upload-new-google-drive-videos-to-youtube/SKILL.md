---
name: upload-new-google-drive-videos-to-youtube
description: Build a Zap on Zapier that uploads each new video file added to Google Drive to YouTube, titled after the file and described from its Drive description. Use when a creator or team drops finished videos into Google Drive and wants them published to YouTube without manual uploads.
license: MIT
metadata:
  author: zapier
  summary: "Each new video in your Google Drive is uploaded to YouTube with a title from its file name and a description from its Drive notes."
  apps: "Google Drive, YouTube"
  category: "Marketing"
  job: "Content media production"
  source: "https://zapier.com/templates/details/6f4989c37b156aa98531ae4b800099cf1f0e5d470c7d4a6a829c15767d1c61e5"
---

# Upload new Google Drive videos to YouTube with titles and descriptions

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/upload-new-google-drive-videos-to-youtube. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** a new file is added to Google Drive (`google-drive`, `file`). The run carries the file's ID, name, description, MIME type and download link.
2. **Workflow** skips anything that is not a video, so only video files continue.
3. **YouTube** uploads the video. Its title is the file name without the extension, cut to 100 characters. Its description is the Drive file's description, or a short default when the file has none. The video is uploaded as private.

## Ask the user

No value here is set per person. Choose the accounts when you bind the connections, and review the defaults with the user:

| Setting               | Where       | What it does                                                                                                    |
| --------------------- | ----------- | --------------------------------------------------------------------------------------------------------------- |
| `YOUTUBE_PRIVACY`     | `config.ts` | Privacy of each upload. `"private"` keeps videos hidden until reviewed; `"unlisted"` or `"public"` publish them |
| `DEFAULT_DESCRIPTION` | `config.ts` | Description used for files that have no Drive description                                                       |

Ask which Google Drive account holds the new videos and which YouTube channel should publish them. Their connections are chosen in the Build step, not pasted as IDs.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Accounts:** bind `google-drive` to the user's Google Drive connection for the account that holds the new files, and `youtube` to the user's YouTube connection for the channel that should publish them. Both are named in `connections/`.
2. **Source:** publish `workflow.ts` and `config.ts` with the defaults above, or the values the user chose. `triggers/new-file.ts` and `connections/` are settings, not code: set the workflow's trigger and connection bindings from them. The trigger file names the app by its slug; for the trigger's `selected_api`, call `search_triggers` with that slug, find the row whose `key` is `file`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create, test and publish the workflow.
4. **Fields:** inspect the YouTube `upload_video` action's fields with the user's YouTube connection before the first test run, and fix any key in `workflow.ts` that doesn't match (the file, title, description and privacy inputs). Check the Google Drive trigger's output fields against `mimeType`, `file`, `title`, `description` and `id` as well.

## Test it

Run this sample as a draft test (`run_workflow_draft` in Zapier MCP) with a short test video the user uploads to a folder they own, not a real one:

```json
{
  "id": "1sample-drive-file-id",
  "title": "[install-test] sample clip.mp4",
  "description": "Install test upload.",
  "mimeType": "video/mp4",
  "file": "https://example.com/sample-clip.mp4"
}
```

Confirm that one private YouTube video appears on the channel with the title and description above. The user deletes the test video, not the agent. Then publish, and confirm the trigger is active.

## Notes

- The trigger fires for every new file in Drive, so non-video files are skipped on purpose. To limit uploads to one folder, change the trigger to Google Drive's `file_in_folder_v3` event and set its folder.
- Titles come from file names. Rename a file in Drive before it lands to change its YouTube title.
- YouTube limits titles to 100 characters and a per-day upload quota applies to each channel.
- Keep `YOUTUBE_PRIVACY` at `"private"` until the titles and descriptions have been checked on a real upload.
