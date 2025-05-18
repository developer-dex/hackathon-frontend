import React from "react";
import { LabeledSelect } from "@/components/molecules/LabeledSelect";
import {
  ITimePeriodSelectorProps,
  ETimePeriod,
} from "./TimePeriodSelector.types";

const TIME_PERIODS: ETimePeriod[] = [
  "Weekly",
  "Quarterly",
  "Monthly",
  "Yearly",
];

export const TimePeriodSelector: React.FC<ITimePeriodSelectorProps> = ({
  value,
  onChange,
  label = "Time Period",
}) => (
  <LabeledSelect
    label={label}
    options={TIME_PERIODS.map((period) => ({ value: period, label: period }))}
    value={value}
    onChange={(e) => onChange(e.target.value as ETimePeriod)}
  />
);
