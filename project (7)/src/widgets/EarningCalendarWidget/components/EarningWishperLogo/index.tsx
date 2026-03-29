import React, { FC } from "react";
import styles from "./style.module.css";

interface IProps {}

/**
 * @author
 * @function @EarningWishpersLogo
 **/

const EarningWishpersLogo: FC<IProps> = () => {
  return (
    <div className={styles.earningWishperLogo}>
      <p className={styles.earningText}>EARNINGS</p>
      <p className={styles.wishperText}>WISHPERS</p>
    </div>
  );
};

export default EarningWishpersLogo;
