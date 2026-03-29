import React, { FC, useEffect, useState } from "react";
import styles from "./style.module.css";
import { EarningData } from "../../apis/earningApi";
import { fetchLogo } from "../../apis/logoApi";
import { getDayName } from "../../utils";
import { FormattedEarning } from "../../helpers";

interface IProps {
  date?: string;
  data?: FormattedEarning;
}

/**
 * @author
 * @function @CalendarColumn
 **/

export const CalendarColumn: FC<IProps> = ({ date, data }) => {
  return (
    <div className={styles.columnContainer}>
      {/* before open */}
      <div className={styles.beforeOpenContainer}>
        {data?.before_open.map((earningData: EarningData, index: number) => (
          <CalendarCell
            logo={earningData.imageUrl || ""}
            ticker={earningData.ticker}
          />
        ))}
      </div>

      {/* after open */}
      <div className={styles.beforeOpenContainer}>
        {data?.after_close.map((earningData: EarningData, index: number) => (
          <CalendarCell
            logo={earningData.imageUrl || ""}
            ticker={earningData.ticker}
          />
        ))}
      </div>
    </div>
  );
};

const CalendarCell: FC<{ logo: string; ticker: string }> = ({
  logo,
  ticker,
}) => {
  // useEffect(() => {
  //   fetchLogo(logo).then((result) => {
  //     if (result.data) {
  //       setLogoUrl(result.data[0].files.mark_vector_light || "");
  //     }
  //   });
  // }, []);

  return (
    <a
      target="_blank"
      href={`https://www.benzinga.com/quote/${ticker}`}
      className={styles.companyLink}
    >
      <div className={styles.companyContainer}>
        <div className={styles.companyName}>
          <span>{ticker}</span>
        </div>
        <div className={styles.companyLogo}>
          <img src={logo} className={styles.companyLogoImg} alt="" />
        </div>
      </div>
    </a>
  );
};
