export interface UpdateEventDTO {
  title?: string;
  description?: string;
  startTime?: Date | string;
  endTime?: Date | string;
  isAllDay?: boolean;
  location?: string;
  color?: string;
  isRecurring?: boolean;
  recurrence?: string;
  calendarId?: string; // e.g. moving event to another calendar
}
