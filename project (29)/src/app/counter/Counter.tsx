"use client";

import React, { FC, useState } from "react";

interface IProps {}

/**
 * @author
 * @function @Counter
 **/

const Counter: FC<IProps> = (props) => {
  const [count, setCount] = useState(0);
  return <div>Counter: {count}</div>;
};

export default Counter;
