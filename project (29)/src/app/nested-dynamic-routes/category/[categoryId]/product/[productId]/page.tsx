import React, { FC } from "react";

interface IProps {}

/**
 * @author
 * @function @NestedDynamicRoutes
 *
 **/

const NestedDynamicRoutes = ({
  params: { categoryId, productId },
}: {
  params: { categoryId: string; productId: string };
}) => {
  return (
    <div>
      <h1>Nested Dynamic Routes</h1>
      <p>Category {categoryId}</p>
      <p>Product {productId}</p>
    </div>
  );
};

export default NestedDynamicRoutes;
