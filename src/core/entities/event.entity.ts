export class Event {
  constructor(
    public id: string,
    public title: string,
    public startTime: Date,
    public endTime: Date,
    public calendarId: string,
    public creatorId: string,
    public description?: string | null,
    public isAllDay: boolean = false,
    public location?: string | null,
    public color?: string | null,
    public isRecurring: boolean = false,
    public recurrence?: string | null,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}
