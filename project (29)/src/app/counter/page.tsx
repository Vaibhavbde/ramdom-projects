import React, { FC } from "react";
import Counter from "./Counter";

interface IProps {}

/**
 * @author
 * @function @CounterPage
 **/

// metadata allow only on server components
export const metadata = {
  title: "Counter test",
};

const CounterPage: FC<IProps> = (props) => {
  return (
    <div>
      CounterPage
      <Counter />
    </div>
  );
};

export default CounterPage;
