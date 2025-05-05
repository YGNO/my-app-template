import { useEffect, useRef, useState } from "react";
import { Calendar } from "vanilla-calendar-pro";
import { getDateString } from "vanilla-calendar-pro/utils";
import { Input } from "@my-app/shadcn";
import { getLayout, locale, styles } from "./datePickerOptions.ts";

interface DatePickerProps extends React.ComponentProps<"input"> {
  value?: string;
  disableDatesPast?: boolean;
  disableToday?: boolean;
}

function DatePiker({
  disableDatesPast,
  disableToday,
  ...attributes
}: DatePickerProps) {
  const ref = useRef(null);
  const [calendar, setCalendar] = useState<Calendar | null>(null);
  const [value, setValue] = useState<string>(attributes.value ?? "");

  useEffect(() => {
    if (!ref.current) return;
    const vc = new Calendar(ref.current, {
      styles,
      locale,
      type: "default",
      inputMode: true,
      selectedTheme: "light",
      enableJumpToSelectedDate: true,
      disableDatesPast: disableDatesPast || false,
      disableToday: disableToday || false,
      firstWeekday: 0,
      selectedDates: [value !== "" ? new Date(value) : new Date()],
      positionToInput: "auto",
      onClickDate(self) {
        const newDate = new Date(self.context.selectedDates[0]!);
        self.selectedDates = self.context.selectedDates;
        self.update();
        setValue(getDateString(newDate));
      },
    });
    vc.set({
      layouts: getLayout(vc),
    });
    setCalendar(vc);
  }, [ref]);

  useEffect(() => {
    if (!calendar) return;
    calendar.init();
  }, [calendar]);

  return (
    <Input
      placeholder="yyyy-mm-dd"
      {...attributes}
      ref={ref}
      value={value}
      readOnly
      style={{
        ...attributes.style,
        width: "135px",
      }}
      onKeyDown={(e) => {
        if (e.key === "Backspace") {
          e.preventDefault();
          setValue("");
          if (calendar) {
            calendar.selectedDates = [new Date()];
            calendar.update();
          }
        }
      }}
    />
  );
}

export default DatePiker;
