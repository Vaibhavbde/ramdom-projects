import React, { FC } from "react";

interface IProps {}

/**
 * @author
 * @function @PrivateFile
 **/

export const PrivateFile: FC<IProps> = (props) => {
  return (
    <div>
      <h1>This is a Private Page</h1>
      <p>Any file name that begins with _ are considered private page</p>
    </div>
  );
};

export default PrivateFile;
