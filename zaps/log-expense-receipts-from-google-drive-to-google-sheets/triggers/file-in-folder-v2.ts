export default {
  app: "google-drive",
  event: "file_in_folder_v2",
  connection: "google-drive",
  params: {
    // Ask the user which Google Drive folder receipts are uploaded to, then look up its ID (the long ID in the folder's URL) with their Google Drive connection.
    folder: "REPLACE_DRIVE_FOLDER_ID",
    includeSubfolders: "false",
    includeDeleted: "false",
  },
};
