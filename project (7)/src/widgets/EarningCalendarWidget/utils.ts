export const getFormattedDate = (date: Date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
};


export const getDayName = (d: string) => {
    const date = new Date(d);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
};

export const getFormattedCurrentDate = () => {
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: '2-digit' };
  return date.toLocaleDateString('en-US', options);
}

export const getLastQuarterDates = () => {
  const now = new Date();
  const currentQuarter = Math.floor((now.getMonth() + 3) / 3); // Get current quarter (1 to 4)
  const lastQuarter = currentQuarter - 1 || 4; // If current quarter is 1, last quarter is 4
  const year = lastQuarter === 4 ? now.getFullYear() - 1 : now.getFullYear(); // Adjust year for Q4 case

  // Define quarter start months
  const quarterStartMonths: { [key: number]: number } = { 1: 0, 2: 3, 3: 6, 4: 9 }; // Jan, Apr, Jul, Oct
  const startMonth = quarterStartMonths[lastQuarter];

  // Create start and end date objects
  const startDate = new Date(year, startMonth, 1);
  const endDate = new Date(year, startMonth + 3, 0); // Last day of the last quarter

  return { startDate, endDate };
}