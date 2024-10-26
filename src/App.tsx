import React, { useEffect, useRef, useState } from "react";
import { getVideoByUrl } from "./services/getVideoLByUrl";
import { FaGithub, FaInstagram } from "react-icons/fa6";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export const App: React.FC = () => {
  const [inputUrl, setInputUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const getVideo = async () => {
      setLoading(true);
      const data = await getVideoByUrl(inputUrl);
      setVideoUrl(data);
      setLoading(false);
    };

    if (inputUrl) {
      getVideo();
    }
  }, [inputUrl]);

  const handleSearchClick = () => {
    setInputUrl(inputRef.current!.value);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(videoUrl);
      if (!response.ok) throw new Error("Error al descargar el video");

      const contentLength = response.headers.get("Content-Length");
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      let loaded = 0;

      const reader = response.body?.getReader();
      const chunks: Uint8Array[] = [];

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        chunks.push(value);
        loaded += value.length;

        // Calcular el progreso xd
        setProgress((loaded / total) * 100);
      }

      // Crear un Blob a partir de los chunkss
      const blob = new Blob(chunks);
      const url = window.URL.createObjectURL(blob);

      // Crear un enlace para descargar el archivo de la api
      const a = document.createElement("a");
      a.href = url;
      a.download = "video.mp4"; // Nombre del archivo descargado
      document.body.appendChild(a);
      a.click(); // Simular clic para iniciar la descarga
      a.remove(); // Eliminar el enlace del DOM

      // Liberar la URL temporal
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error durante la descarga:", error);
    }
  };

  return (
    <div className="min-h-dvh min-w-dvh flex flex-col justify-between">
      <div className="w-full p-1 bg-gradient-to-r from-teal-600 to-blue-800"></div>
      <main className="flex flex-col justify-center items-center bg-neutral-0 w-full h-full flex-1 mb-10">
        <h1 className="font-semibold text-neutral-800 flex gap-1 justify-center items-center text-5xl p-5">
          Blue
          <span className="inline-block font-bold text-blue-50 bg-blue-500 overflow-hidden rounded-lg pl-4 pr-5 py-2">
            Mate
          </span>
        </h1>
        <header className="max-w-[600px] w-full px-4">
          <div className="flex">
            <input
              type="text"
              ref={inputRef}
              className="flex-1 outline-none text-black px-3 py-4 border-4 border-r-0 border-blue-500"
              placeholder="Ingresa la URL del video"
            />
            {videoUrl ? (
              <button
                onClick={handleDownload}
                className="w-[100px] flex justify-center items-center bg-blue-500 text-white p-2  hover:bg-blue-600 active:bg-blue-700 disabled:bg-blue-400 font-semibold rounded-r-2xl"
              >
                Descargar
              </button>
            ) : (
              <button
                disabled={loading}
                onClick={handleSearchClick}
                className="w-[100px] flex justify-center items-center bg-blue-500 text-white p-2  hover:bg-blue-600 active:bg-blue-700 disabled:bg-blue-400 font-semibold rounded-r-2xl"
              >
                {loading ? (
                  <AiOutlineLoading3Quarters className="animate-spin" />
                ) : (
                  "Buscar"
                )}
              </button>
            )}
          </div>

          {progress > 0 && (
            <div className="w-full bg-gray-300 rounded mt-2">
              <div
                style={{ width: `${progress}%` }}
                className="bg-blue-500 h-2 rounded"
              />
            </div>
          )}

          {progress < 100 && progress > 0 && (
            <p className="mt-1 text-center text-gray-700">
              Descargando video: {Math.round(progress)}%
            </p>
          )}

          {progress === 100 && (
            <p className="mt-1 text-center text-gray-700">
              Descargado con éxito
            </p>
          )}
        </header>
      </main>

      <footer className="p-4 shadow-[0_0_20px_#0008] flex flex-col justify-center items-center w-full bg-gradient-to-r from-teal-600 to-blue-800">
        <h2 className="text-lg text-slate-200 font-bold">
          by KarlinCoder (Giancarlo Dennis)
        </h2>
        <div className="flex justify-center gap-1 items-center text-slate-200 text-2xl">
          <a
            href="https://github.com/KarlinCoder"
            className="hover:text-slate-400"
          >
            <FaGithub />
          </a>
          <a
            href="https://www.instagram.com/its.karlin.coder"
            className="hover:text-slate-400"
          >
            <FaInstagram />
          </a>
        </div>
      </footer>
    </div>
  );
};
