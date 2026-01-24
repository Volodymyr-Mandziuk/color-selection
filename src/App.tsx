import { useEffect, useState } from "react";
import chroma from "chroma-js";
import ColorColumn from "./components/ColorColumn";
import type { ColorColumnType } from "./types";
import html2canvas from "html2canvas";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";
import Spinner from "./components/Spinner";
import { FiCamera, FiCopy, FiShuffle } from "react-icons/fi";

const COLUMN_COUNT = 5;

const App = () => {
  const [columns, setColumns] = useState<ColorColumnType[]>([]);
  const [screenshotUrl, setScreenshotUrl] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const takeScreenshot = async (): Promise<string | null> => {
    const element = document.getElementById("palette-container");
    if (!element) return null;

    const canvas = await html2canvas(element);
    return canvas.toDataURL("image/png");
  };

  const uploadPaletteScreenshot = async (
    imageBase64: string,
    name: string,
  ): Promise<string> => {
    const fileName = `${name}_${Date.now()}.png`;
    const imageRef = ref(storage, `palettes/${fileName}`);

    await uploadString(imageRef, imageBase64, "data_url");
    return await getDownloadURL(imageRef);
  };

  const handleSavePalette = async () => {
    const name = prompt("Enter palette name:");
    if (!name) return;

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const image = await takeScreenshot();
      if (!image) return;

      const url = await uploadPaletteScreenshot(image, name);
      setScreenshotUrl(url);

      setSaveSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Failed to save palette");
    } finally {
      setIsSaving(false);
    }
  };

  const copyUrlToClipboard = () => {
    if (!screenshotUrl) return;
    navigator.clipboard.writeText(screenshotUrl);
    alert("Screenshot URL copied!");
  };

  useEffect(() => {
    const initialColumns = Array.from({ length: COLUMN_COUNT }).map(() => ({
      color: chroma.random().hex(),
      locked: false,
    }));
    setColumns(initialColumns);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        generateColors();
        setScreenshotUrl("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const generateColors = () => {
    setColumns((prev) =>
      prev.map((col) =>
        col.locked ? col : { ...col, color: chroma.random().hex() },
      ),
    );
  };

  const toggleLock = (index: number) => {
    setColumns((prev) =>
      prev.map((col, i) =>
        i === index ? { ...col, locked: !col.locked } : col,
      ),
    );
  };

  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color);
  };

  return (
    <div className="app">
      <div id="palette-container" className="palette">
        {isSaving && <Spinner />}
        {saveSuccess && !isSaving && screenshotUrl && (
          <div className="save-success">Palette screenshot saved!</div>
        )}
        {columns.map((col, index) => (
          <ColorColumn
            key={index}
            color={col.color}
            locked={col.locked}
            onToggleLock={() => toggleLock(index)}
            onCopy={() => copyToClipboard(col.color)}
          />
        ))}

        {!isSaving && (
          <button
            className="action-btn generate-btn"
            onClick={() => {
              generateColors();
              setScreenshotUrl("");
            }}
          >
            <FiShuffle size={18} />
            Generate colors
          </button>
        )}

        {!screenshotUrl && !isSaving && (
          <button className="action-btn save-btn" onClick={handleSavePalette}>
            <FiCamera size={18} />
            Save palette
          </button>
        )}

        {screenshotUrl && (
          <div className="screenshot-panel">
            <input type="text" value={screenshotUrl} readOnly />
            <button onClick={copyUrlToClipboard} title="Copy link">
              <FiCopy size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
