import React, { FC } from "react";

interface IProps {
  children: React.ReactNode;
}

/**
 * @author
 * @function @AuthLayout
 **/

const AuthLayout: FC<IProps> = ({ children }) => {
  return (
    <div>
      <h2>User login/signup</h2>
      {children}
    </div>
  );
};

export default AuthLayout;
