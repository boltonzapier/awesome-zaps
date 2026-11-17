export default {
  app: "granola",
  event: "new_meeting",
  connection: "granola",
  params: {
    // Ask the user which Granola workspace holds the meetings, then choose it from the workspace list.
    selected_workspace: "REPLACE_GRANOLA_WORKSPACE",
    // Ask the user which Granola folder their meeting notes land in, then choose that folder from the folder list.
    document_list_id: "REPLACE_GRANOLA_FOLDER_ID",
    name: "Action items to Asana",
    visibility: false,
  },
};
