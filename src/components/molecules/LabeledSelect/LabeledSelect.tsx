import React from "react";
import { Select, SelectProps } from "@/components/atoms/Select";

export interface LabeledSelectProps extends SelectProps {
  label: string;
}

export const LabeledSelect: React.FC<LabeledSelectProps> = ({
  label,
  ...props
}) => (
  <div className="flex items-center gap-3 flex-row">
    <label className="text-gray-700 font-medium whitespace-nowrap">{label}</label>
    <div className="min-w-[140px]">
      <Select {...props} />
    </div>
  </div>
);
