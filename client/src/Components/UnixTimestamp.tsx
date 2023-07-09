import React from "react";

interface UnixTimestampProps {
  unixTime: string;
}

const UnixTimestamp: React.FC<UnixTimestampProps> = ({ unixTime }) => {
  const date = new Date(Number(unixTime) * 1000);
  const formattedDate = date.toLocaleString();

  return <span>{formattedDate}</span>;
};

export default UnixTimestamp;
