"use client";

import { Input } from "@/components/ui/input";
import { SDGGoal } from "@prisma/client";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define SDG goals for client-side rendering
const sdgGoals = [
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

interface ProjectSearchProps {
  onSearch: (search: string) => void;
  onSDGChange: (goal: SDGGoal | null) => void;
  selectedSDG: SDGGoal | null;
}

export function ProjectSearch({
  onSearch,
  onSDGChange,
  selectedSDG,
}: ProjectSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="space-y-4 mb-8">
      <div className="flex gap-4">
        <Input
          type="search"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="bg-gray-800 border-gray-700 text-gray-100 flex-1"
        />
        <Select
          value={selectedSDG || "all"}
          onValueChange={(value: string) => {
            if (value === "all") {
              onSDGChange(null);
            } else {
              const sdgValue = Object.values(SDGGoal).find(
                (sdg) => sdg === value
              );
              onSDGChange(sdgValue || null);
            }
          }}
        >
          <SelectTrigger className="w-[280px] bg-gray-800 border-gray-700 text-gray-100">
            <SelectValue placeholder="Filter by SDG Goal" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="all" className="text-gray-100 hover:bg-gray-700">
              All SDG Goals
            </SelectItem>
            {sdgGoals.map((goal) => (
              <SelectItem
                key={goal.value}
                value={goal.value}
                className="text-gray-100 hover:bg-gray-700"
              >
                {goal.number}. {goal.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
