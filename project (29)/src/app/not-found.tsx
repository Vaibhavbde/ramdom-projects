import React, { FC } from "react";

interface IProps {}

/**
 * @author
 * @function @NotFound
 **/

const NotFound: FC<IProps> = (props) => {
  return (
    <div>
      <h1>404 Page</h1>
      <p>What are you trying to mess here</p>
    </div>
  );
};

export default NotFound;
