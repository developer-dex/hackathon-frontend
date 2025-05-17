import React from "react";
import styles from "./TimePeriodSelector.module.css";
import {
  ITimePeriodSelectorProps,
  ETimePeriod,
} from "./TimePeriodSelector.types";

const TIME_PERIODS: ETimePeriod[] = ["Daily", "Weekly", "Monthly", "Yearly"];

export const TimePeriodSelector: React.FC<ITimePeriodSelectorProps> = ({
  value,
  onChange,
  label = "Time Period",
}) => (
  <div className={styles.container}>
    <label htmlFor="time-period-select" className={styles.label}>
      {label}
    </label>
    <select
      id="time-period-select"
      className={styles.select}
      value={value}
      onChange={(e) => onChange(e.target.value as ETimePeriod)}
    >
      {TIME_PERIODS.map((period) => (
        <option key={period} value={period}>
          {period}
        </option>
      ))}
    </select>
  </div>
);
