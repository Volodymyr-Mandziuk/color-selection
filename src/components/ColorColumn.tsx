import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faLockOpen } from "@fortawesome/free-solid-svg-icons";
import chroma from "chroma-js";

type Props = {
  color: string;
  locked: boolean;
  onToggleLock: () => void;
  onCopy: () => void;
};

const ColorColumn = ({ color, locked, onToggleLock, onCopy }: Props) => {
  const textColor = chroma(color).luminance() > 0.5 ? "#000" : "#fff";
  return (
    <div
      className="col"
      style={
        {
          "--bg-color": color,
          "--text-color": textColor,
        } as React.CSSProperties
      }
    >
      <h2 className="color-code" onClick={onCopy}>
        {color}
      </h2>

      <button style={{ color: textColor }} onClick={onToggleLock}>
        <FontAwesomeIcon icon={locked ? faLock : faLockOpen} />
      </button>
    </div>
  );
};

export default ColorColumn;
