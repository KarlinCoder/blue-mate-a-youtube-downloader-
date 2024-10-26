const API_BASE = "https://redirector.gv.cmnetworkusercontent.com/";

export const getVideoByUrl = async (url: string) => {
  const idRegex =
    /(?:youtube(?:-nocookie)?\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|.*[?&]v=)|.*\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;

  const match = url.match(idRegex)![1];

  const data = await fetch(
    `${API_BASE}video?scope=streaming&itag=18&id=${match}`
  );
  return data.url;
};
