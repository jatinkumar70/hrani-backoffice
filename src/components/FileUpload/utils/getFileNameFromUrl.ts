export const getFileNameFromUrl = (path: string) => {
  const regex = /\/([^\/]+)$/; // Matches the last part after the last '/'
 // const regex = /\/([^/]+)_(\d+)_\d{4}-\d{2}-\d{2}_\d{2}:\d{2}:\d{2}\.\w+$/;
  const match = path.match(regex);

  if (match && match.length > 1) {
    let filename = match[1];
 
    return filename;
  }
  return "N/A";
};

export const getFileExtensionFromUrl = (url: string) => {
  return url.split(".").pop() || "";
};
