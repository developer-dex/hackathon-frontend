import React from "react";
import styles from "./TimePeriodFilter.module.css";
import { ITimePeriodFilterProps } from "./TimePeriodFilter.types";

export const TimePeriodFilter: React.FC<ITimePeriodFilterProps> = ({
  value,
  onChange,
  options,
}) => {
  return (
    <select
      className={styles.timePeriodFilter}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      data-testid="time-period-filter"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
