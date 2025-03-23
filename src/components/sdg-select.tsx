"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { SDGGoal } from "@prisma/client";

export interface SDGGoalType {
  value: SDGGoal;
  label: string;
  number: number;
}

export const sdgGoals: SDGGoalType[] = [
  { value: SDGGoal.NO_POVERTY, label: "No Poverty", number: 1 },
  { value: SDGGoal.ZERO_HUNGER, label: "Zero Hunger", number: 2 },
  {
    value: SDGGoal.GOOD_HEALTH,
    label: "Good Health and Well-being",
    number: 3,
  },
  { value: SDGGoal.QUALITY_EDUCATION, label: "Quality Education", number: 4 },
  { value: SDGGoal.GENDER_EQUALITY, label: "Gender Equality", number: 5 },
  {
    value: SDGGoal.CLEAN_WATER,
    label: "Clean Water and Sanitation",
    number: 6,
  },
  {
    value: SDGGoal.AFFORDABLE_ENERGY,
    label: "Affordable and Clean Energy",
    number: 7,
  },
  {
    value: SDGGoal.DECENT_WORK,
    label: "Decent Work and Economic Growth",
    number: 8,
  },
  {
    value: SDGGoal.INDUSTRY_INNOVATION,
    label: "Industry, Innovation and Infrastructure",
    number: 9,
  },
  {
    value: SDGGoal.REDUCED_INEQUALITIES,
    label: "Reduced Inequalities",
    number: 10,
  },
  {
    value: SDGGoal.SUSTAINABLE_CITIES,
    label: "Sustainable Cities and Communities",
    number: 11,
  },
  {
    value: SDGGoal.RESPONSIBLE_CONSUMPTION,
    label: "Responsible Consumption and Production",
    number: 12,
  },
  { value: SDGGoal.CLIMATE_ACTION, label: "Climate Action", number: 13 },
  { value: SDGGoal.LIFE_BELOW_WATER, label: "Life Below Water", number: 14 },
  { value: SDGGoal.LIFE_ON_LAND, label: "Life on Land", number: 15 },
  {
    value: SDGGoal.PEACE_JUSTICE,
    label: "Peace, Justice and Strong Institutions",
    number: 16,
  },
  {
    value: SDGGoal.PARTNERSHIPS,
    label: "Partnerships for the Goals",
    number: 17,
  },
];

interface SDGSelectProps {
  selected: SDGGoal[];
  onChange: (values: SDGGoal[]) => void;
}

export function SDGSelect({ selected, onChange }: SDGSelectProps) {
  const [open, setOpen] = useState(false);

  const toggleSelection = (value: SDGGoal) => {
    const newSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];
    onChange(newSelected);
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
          >
            Select SDG Goals
            <span className="ml-2 text-xs text-gray-400">
              {selected.length} selected
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-2 bg-gray-800 border-gray-700">
          <div className="max-h-[300px] overflow-y-auto">
            {sdgGoals.map((goal) => (
              <div
                key={goal.value}
                onClick={() => toggleSelection(goal.value)}
                className="flex items-center space-x-2 p-2 cursor-pointer text-gray-300 hover:bg-gray-700 rounded-sm"
              >
                <div
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded border border-gray-600",
                    selected.includes(goal.value)
                      ? "bg-purple-600 border-purple-600"
                      : "bg-transparent"
                  )}
                >
                  {selected.includes(goal.value) && (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </div>
                <span className="text-sm">
                  {goal.number}. {goal.label}
                </span>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      <div className="flex flex-wrap gap-2">
        {selected.map((value) => {
          const goal = sdgGoals.find((g) => g.value === value);
          return goal ? (
            <Badge
              key={value}
              variant="secondary"
              className="bg-purple-900/50 text-purple-300 hover:bg-purple-900"
              onClick={() => toggleSelection(value)}
            >
              {goal.label}
              <button
                className="ml-1 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSelection(value);
                }}
              >
                ×
              </button>
            </Badge>
          ) : null;
        })}
      </div>
    </div>
  );
}
