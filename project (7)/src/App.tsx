import "./App.css";
import EarningCalendarWidget from "./widgets/EarningCalendarWidget";
import {
  getFormattedDate,
  getLastQuarterDates,
} from "./widgets/EarningCalendarWidget/utils";

function App() {
  const { startDate, endDate } = getLastQuarterDates();

  return (
    <div className="App">
      <EarningCalendarWidget
        fromDate={getFormattedDate(startDate)}
        toDate={getFormattedDate(endDate)}
      />
    </div>
  );
}

export default App;
