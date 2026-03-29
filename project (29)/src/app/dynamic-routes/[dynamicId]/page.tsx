import React, { FC } from "react";

interface IProps {}

/**
 * @author
 * @function @DynamicRoutesExample
 **/

const DynamicRoutesExample = ({
  params: { dynamicId },
}: {
  params: { dynamicId: string };
}) => {
  return (
    <div>
      <h1>Dynamic Routes Example</h1>
      <p>Dynamic Id: {dynamicId}</p>
    </div>
  );
};

export default DynamicRoutesExample;
