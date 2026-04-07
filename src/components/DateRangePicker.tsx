import { ChevronLeft, ChevronRight, Calendar, X } from 'lucide-react';

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  currentMonth: Date;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  onCurrentMonthChange: (date: Date) => void;
  onClear: () => void;
}

export function DateRangePicker({
  startDate,
  endDate,
  currentMonth,
  onStartDateChange,
  onEndDateChange,
  onCurrentMonthChange,
  onClear,
}: DateRangePickerProps) {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    onCurrentMonthChange(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    onCurrentMonthChange(newMonth);
  };

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    if (!startDate || (startDate && endDate)) {
      // Start new range
      onStartDateChange(selectedDate);
      onEndDateChange(null);
    } else if (startDate && !endDate) {
      // Complete the range
      if (selectedDate < startDate) {
        onStartDateChange(selectedDate);
        onEndDateChange(startDate);
      } else {
        onEndDateChange(selectedDate);
      }
    }
  };

  const isDateInRange = (day: number) => {
    if (!startDate || !endDate) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date >= startDate && date <= endDate;
  };

  const isDateSelected = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateStr = date.toDateString();
    return (
      (startDate && dateStr === startDate.toDateString()) ||
      (endDate && dateStr === endDate.toDateString())
    );
  };

  const isStartDate = (day: number) => {
    if (!startDate) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date.toDateString() === startDate.toDateString();
  };

  const isEndDate = (day: number) => {
    if (!endDate) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date.toDateString() === endDate.toDateString();
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-8" />);
  }

  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const inRange = isDateInRange(day);
    const selected = isDateSelected(day);
    const isStart = isStartDate(day);
    const isEnd = isEndDate(day);

    days.push(
      <button
        key={day}
        onClick={() => handleDateClick(day)}
        className={`h-8 rounded-lg text-sm transition-colors ${
          selected
            ? 'bg-[#9473ff] text-white font-semibold'
            : inRange
            ? 'bg-[#e9d5ff] text-[#051046]'
            : 'text-[#051046] hover:bg-gray-100'
        } ${
          isStart && !isEnd ? 'rounded-r-none' : ''
        } ${
          isEnd && !isStart ? 'rounded-l-none' : ''
        } ${
          inRange && !isStart && !isEnd ? 'rounded-none' : ''
        }`}
      >
        {day}
      </button>
    );
  }

  const formatDateRange = () => {
    if (!startDate) return 'Select range';
    if (!endDate) return startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  return (
    <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-4 w-80" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-[#051046]" />
        </button>
        <div className="font-semibold text-[#051046]">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </div>
        <button
          onClick={handleNextMonth}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-[#051046]" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <div key={day} className="h-8 flex items-center justify-center text-xs font-semibold text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {days}
      </div>

      {/* Selected range display and clear button */}
      {(startDate || endDate) && (
        <div className="flex items-center justify-between pt-3 border-t border-[#e2e8f0]">
          <div className="text-sm text-[#051046]">
            {formatDateRange()}
          </div>
          <button
            onClick={onClear}
            className="text-sm text-[#8b5cf6] hover:underline"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}