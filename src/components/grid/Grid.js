import { memo } from "react";
import Cell from "./Cell";

const Grid = ({ chars }) => {
  return (
    <div className="grid">
      {chars.map((char, index) => (
        <Cell key={index} status={char?.result}>
          {char?.guess}
        </Cell>
      ))}
    </div>
  );
};

export default memo(Grid);
