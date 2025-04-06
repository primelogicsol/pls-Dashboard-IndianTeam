import { forwardRef } from "react"

export const DateRangePicker = forwardRef(function DateRangePickerComponent({ value, onValueChange, ...props }, ref) {
  return <DateRangePicker ref={ref} value={value} onChange={onValueChange} {...props} />
})

