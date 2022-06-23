/*
  Brillant answer from Simon:
  https://stackoverflow.com/questions/423376/how-to-get-the-file-name-from-a-full-path-using-javascript 
*/
export const getFileName = (filePath: string) =>
  new URL("file://" + filePath).pathname.split("/").pop();

export const breakdownFileName = (fileName: string) => {
  const parts = fileName.split(".");
  if (parts.length === 0) {
    return {
      name: "",
      ext: "",
    };
  } else if (parts.length === 1) {
    return {
      name: parts[0],
      ext: "",
    };
  } else {
    const name = parts[0];
    parts.shift();
    return {
      name,
      ext: parts.join(""),
    };
  }
};
