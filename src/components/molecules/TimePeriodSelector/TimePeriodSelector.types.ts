export type ETimePeriod = "Daily" | "Weekly" | "Monthly" | "Yearly";

export interface ITimePeriodSelectorProps {
  value: ETimePeriod;
  onChange: (value: ETimePeriod) => void;
  label?: string;
}
