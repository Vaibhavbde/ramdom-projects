import React, { FC, useEffect, useState } from "react";
import {
  EarningData,
  EarningResponse,
  fetchEarnings,
  Params,
} from "./apis/earningApi";
import { getFormattedCurrentDate, getFormattedDate } from "./utils";
import { FormattedEarningsData, parseEarningsData } from "./helpers";

import styles from "./style.module.css";
import { CalendarColumn } from "./components/CalendarColumn";
import EarningWishpersLogo from "./components/EarningWishperLogo";
import { fetchLogo, LogoResponse } from "./apis/logoApi";
import { CalendarColumnHeader } from "./components/CalendarColumnHeader";

interface IProps {
  fromDate: string;
  toDate: string;
}

/**
 * @author
 * @function @EarningCalendarWidget
 **/

const EarningCalendarWidget: FC<IProps> = ({ fromDate, toDate }) => {
  const [earnings, setEarnings] = useState<FormattedEarningsData>({});
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const getEarningImages = async (data: EarningData[]) => {
      const promises: Promise<any>[] = [];
      const earningMap: Map<string, EarningData> = new Map();
      data.forEach((earningData: EarningData) => {
        promises.push(fetchLogo(earningData.ticker));
        earningMap.set(earningData.ticker, earningData);
      });

      const imagesResp: LogoResponse[] = await Promise.all(promises);

      imagesResp.forEach((imgData: LogoResponse) => {
        if (imgData.data && imgData.data.length > 0) {
          const { files, search_key } = imgData.data[0];
          const earningData = earningMap.get(search_key);
          if (earningData) {
            earningData.imageUrl = files.mark_vector_light;
          }
        }
      });

      return data;
    };
    const init = async () => {
      const params: Params = {
        from_date: fromDate,
        to_date: toDate,
      };

      setLoader(true);
      const result: EarningResponse = await fetchEarnings(params);
      if (result.error) {
        alert(JSON.stringify(result));
      } else if (result.earnings) {
        const earningsCopy = [...result.earnings];
        const updatedEarnings = await getEarningImages(earningsCopy);
        const formattedEarnings = parseEarningsData(updatedEarnings);

        console.log(formattedEarnings);
        setEarnings(formattedEarnings);
      }
      setLoader(false);
    };

    init();
  }, []);

  return (
    <div className={styles.earningWidgetContainer}>
      <div className={styles.earningWidgetHeader}>
        <EarningWishpersLogo />
        <div className={styles.headertitle}>
          <h1>Most Anticipated Earnings Releases</h1>
          <h2>{getFormattedCurrentDate()}</h2>
        </div>
      </div>

      <div className={styles.calendarColumnContainer}>
        {loader ? (
          <p>loading...</p>
        ) : (
          <div className={styles.columnWrapper}>
            {Object.keys(earnings).map((day, index) => (
              <CalendarColumnHeader key={index} day={day} />
            ))}
          </div>
        )}

        <div className={styles.columnBodyWrapper}>
          {Object.keys(earnings).map((day, index) => (
            <CalendarColumn key={index} data={earnings[day]} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EarningCalendarWidget;
