import React, { FC } from "react";
import styles from "./style.module.css";
import { getDayName } from "../../utils";

interface IProps {
  day: string;
}

/**
 * @author
 * @function @CalendarColumnHeader
 **/

export const CalendarColumnHeader: FC<IProps> = ({ day }) => {
  return (
    <div className={styles.columnHeaderContainer}>
      <p className={styles.day}>{day}</p>
      <div className={styles.openClose}>
        <p>Before Open</p>
        <p>After Close</p>
      </div>
    </div>
  );
};
