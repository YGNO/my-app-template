import { Calendar } from "vanilla-calendar-pro";

export const styles = {
  calendar: "vc datpicker-calendar",
  year: "vc-year datpicker-year",
};

export const locale = {
  months: {
    long: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    short: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
  },
  weekdays: {
    long: ["日", "月", "火", "水", "木", "金", "土"],
    short: ["日", "月", "火", "水", "木", "金", "土"],
  },
};

export const getLayout = (cv: Calendar) => {
  const { styles, labels } = cv;
  return {
    default: `
        <div class="${styles.header}" data-vc="header" role="toolbar" aria-label="${labels.navigation}">
          <#ArrowPrev [month] />
          <div class="${styles.headerContent}" data-vc-header="content">
            <#Year /><#Month />
          </div>
          <#ArrowNext [month] />
        </div>
        <div class="${styles.wrapper}" data-vc="wrapper">
          <#WeekNumbers />
          <div class="${styles.content}" data-vc="content">
            <#Week />
            <#Dates />
            <#DateRangeTooltip />
          </div>
        </div>
        <#ControlTime />
      `,
    month: `
      <div class="${styles.header}" data-vc="header" role="toolbar" aria-label="${labels.navigation}">
        <div class="${styles.headerContent}" data-vc-header="content">
          <#Year /><#Month />
        </div>
      </div>
      <div class="${styles.wrapper}" data-vc="wrapper">
        <div class="${styles.content}" data-vc="content">
          <#Months />
        </div>
      </div>
    `,
    year: `
    <div class="${styles.header}" data-vc="header" role="toolbar" aria-label="${labels.navigation}">
      <#ArrowPrev [year] />
      <div class="${styles.headerContent}" data-vc-header="content">
        <#Year />
        <#Month />
      </div>
      <#ArrowNext [year] />
    </div>
    <div class="${styles.wrapper}" data-vc="wrapper">
      <div class="${styles.content}" data-vc="content">
        <#Years />
      </div>
    </div>
  `,
  };
};
