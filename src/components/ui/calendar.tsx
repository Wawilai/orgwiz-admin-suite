import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(props.month || new Date());

  const months = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 50 + i);

  const handleMonthChange = (monthIndex: string) => {
    const newMonth = new Date(currentMonth.getFullYear(), parseInt(monthIndex), 1);
    setCurrentMonth(newMonth);
    props.onMonthChange?.(newMonth);
  };

  const handleYearChange = (year: string) => {
    const newMonth = new Date(parseInt(year), currentMonth.getMonth(), 1);
    setCurrentMonth(newMonth);
    props.onMonthChange?.(newMonth);
  };

  return (
    <div className={cn("p-3 pointer-events-auto", className)}>
      {/* Custom Header with Month/Year Selectors */}
      <div className="flex justify-between items-center mb-4">
        <Select 
          value={currentMonth.getMonth().toString()}
          onValueChange={handleMonthChange}
        >
          <SelectTrigger className="w-[120px] h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {months.map((month, index) => (
              <SelectItem key={index} value={index.toString()}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select 
          value={currentMonth.getFullYear().toString()}
          onValueChange={handleYearChange}
        >
          <SelectTrigger className="w-[80px] h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DayPicker
        month={currentMonth}
        showOutsideDays={showOutsideDays}
        className="p-0"
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-3",
          caption: "hidden", // Hide default caption since we use custom selectors
          nav: "hidden", // Hide default navigation
          table: "w-full border-collapse",
          head_row: "flex border-b",
          head_cell: "text-muted-foreground w-9 h-9 font-normal text-xs flex items-center justify-center",
          row: "flex w-full",
          cell: "h-9 w-9 text-center text-sm p-0 relative hover:bg-accent rounded-sm transition-colors",
          day: cn(
            "h-9 w-9 p-0 font-normal flex items-center justify-center hover:bg-accent rounded-sm transition-colors cursor-pointer",
            "aria-selected:bg-primary aria-selected:text-primary-foreground aria-selected:hover:bg-primary"
          ),
          day_range_end: "day-range-end",
          day_selected: "bg-primary text-primary-foreground hover:bg-primary focus:bg-primary",
          day_today: "bg-accent text-accent-foreground font-semibold",
          day_outside: "text-muted-foreground opacity-50 hover:opacity-75",
          day_disabled: "text-muted-foreground opacity-30 cursor-not-allowed hover:bg-transparent",
          day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...classNames,
        }}
        components={{
          IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
          IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
        }}
        {...props}
      />
    </div>
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
