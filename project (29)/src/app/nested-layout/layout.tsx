import React, { FC } from "react";

interface IProps {}

/**
 * @author
 * @function @NestedLayout
 **/

const NestedLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <h2 style={{ color: "pink" }}>Nested Layout</h2>
      {children}
    </div>
  );
};

export default NestedLayout;
