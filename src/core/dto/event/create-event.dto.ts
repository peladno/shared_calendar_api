export interface CreateEventDTO {
  title: string;
  description?: string;
  startTime: Date | string; // Allow string for easy parsing from JSON
  endTime: Date | string;
  isAllDay?: boolean;
  location?: string;
  color?: string;
  isRecurring?: boolean;
  recurrence?: string;
  calendarId: string;
}
