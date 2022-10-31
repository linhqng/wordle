import { memo } from "react";

const Cell = ({ status, children }) => {
  return <div className={`cell ${status}`}>{children}</div>;
};

export default memo(Cell);
