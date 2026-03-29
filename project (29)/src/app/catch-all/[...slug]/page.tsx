import React, { FC } from "react";

interface IProps {}

/**
 * @author
 * @function @CatchAllRoute
 **/

const CatchAllRoute = async ({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) => {
  const { slug } = await params;
  return (
    <div>
      <h1>Catch All Route</h1>
      <p>Catch all params {JSON.stringify(slug)}</p>
    </div>
  );
};

export default CatchAllRoute;
