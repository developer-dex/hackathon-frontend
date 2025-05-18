import React from "react";
import { Select, SelectProps } from "@/components/atoms/Select";

export interface LabeledSelectProps extends SelectProps {
  label: string;
}

export const LabeledSelect: React.FC<LabeledSelectProps> = ({
  label,
  ...props
}) => (
  <div className="flex items-center gap-2 flex-row">
    <label className="text-gray-700">{label}</label>
    <Select {...props} />
  </div>
);
