export type ETimePeriod = "Weekly" | "Quarterly" | "Monthly" | "Yearly";

export interface ITimePeriodSelectorProps {
  value: ETimePeriod;
  onChange: (value: ETimePeriod) => void;
  label?: string;
}
