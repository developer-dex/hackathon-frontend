export interface ITimePeriodFilterOption {
  value: string;
  label: string;
}

export interface ITimePeriodFilterProps {
  value: string;
  onChange: (value: string) => void;
  options: ITimePeriodFilterOption[];
}
