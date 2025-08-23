import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

// Predefined popular categories
export const PREDEFINED_CATEGORIES = [
  "Health & Fitness",
  "Career & Professional",
  "Personal Development",
  "Finance & Money",
  "Education & Learning",
  "Relationships & Social",
  "Home & Family",
  "Hobbies & Recreation",
  "Travel & Adventure",
  "Creativity & Arts",
] as const;

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  existingCategories?: string[];
  placeholder?: string;
  label?: string;
  id?: string;
}

export default function CategorySelect({
  value,
  onChange,
  existingCategories = [],
  placeholder = "Select or create category",
  label = "Category",
  id = "category",
}: CategorySelectProps) {
  const [isCustom, setIsCustom] = useState(false);
  const [customValue, setCustomValue] = useState("");

  // Combine predefined categories with existing user categories (unique)
  const allCategories = [
    ...PREDEFINED_CATEGORIES,
    ...existingCategories.filter(
      (cat) => cat && !PREDEFINED_CATEGORIES.includes(cat as any)
    ),
  ];

  const handleSelectChange = (selectedValue: string) => {
    if (selectedValue === "__custom__") {
      setIsCustom(true);
      setCustomValue("");
    } else {
      setIsCustom(false);
      onChange(selectedValue);
    }
  };

  const handleCustomSubmit = () => {
    if (customValue.trim()) {
      onChange(customValue.trim());
      setIsCustom(false);
      setCustomValue("");
    }
  };

  const handleCustomCancel = () => {
    setIsCustom(false);
    setCustomValue("");
  };

  const handleCustomKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCustomSubmit();
    } else if (e.key === "Escape") {
      handleCustomCancel();
    }
  };

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      {isCustom ? (
        <div className="flex gap-2">
          <Input
            id={id}
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            onKeyDown={handleCustomKeyDown}
            placeholder="Enter custom category"
            autoFocus
            className="flex-1"
          />
          <Button
            type="button"
            size="sm"
            onClick={handleCustomSubmit}
            disabled={!customValue.trim()}
            className="px-3"
          >
            <Plus className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleCustomCancel}
            className="px-3"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <Select value={value} onValueChange={handleSelectChange}>
          <SelectTrigger id={id}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {/* Predefined categories */}
            {PREDEFINED_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
            
            {/* Existing user categories that aren't predefined */}
            {existingCategories
              .filter((cat) => cat && !PREDEFINED_CATEGORIES.includes(cat as any))
              .map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            
            {/* Custom option */}
            <SelectItem value="__custom__" className="text-primary font-medium">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add custom category
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
