import { EarningData } from "../apis/earningApi";
import { getDayName } from "../utils";

export interface FormattedEarningsData {
  [key: string]: FormattedEarning
}

export interface FormattedEarning {
  before_open: EarningData[],
  after_close: EarningData[]
}

export const parseEarningsData = (earnings: EarningData[]): FormattedEarningsData => {
  const formattedEarnings: FormattedEarningsData = {};
  earnings.forEach((earning: EarningData, index: number) => {
    const { date, time } = earning;
    const day = getDayName(date);
    if(day === "Sunday") return;

    if (!formattedEarnings[day]) {
      formattedEarnings[day] = {
        before_open: [],
        after_close: [],
      };
    }

    if(time < "09:30:00") {
      formattedEarnings[day].before_open.push(earning);
    }else if (time >= "16:00:00") {
      formattedEarnings[day].after_close.push(earning);
     
    } 
  });

  const orderedDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const sortedFormattedEarnings: FormattedEarningsData = {};

  orderedDays.forEach(day => {
    if (formattedEarnings[day]) {
      sortedFormattedEarnings[day] = formattedEarnings[day];
    }
  });

  return sortedFormattedEarnings;

};
