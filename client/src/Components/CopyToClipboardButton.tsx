import React from "react";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface CopyToClipboardButtonProps {
    text: string;
}

const CopyToClipboardButton: React.FC<CopyToClipboardButtonProps> = ({ text }) => {
  const handleCopyClick = () => {
    navigator.clipboard.writeText(text)
      .then(() => {
        console.log("Text copied to clipboard");
      })
      .catch((error) => {
        console.error("Failed to copy text to clipboard:", error);
      });
  };

  return (
    <ContentCopyIcon onClick={handleCopyClick} />
  );
};

export default CopyToClipboardButton;
