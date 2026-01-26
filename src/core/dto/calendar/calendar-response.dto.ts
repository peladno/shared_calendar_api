export interface CalendarResponseDTO {
  id: string;
  name: string;
  description?: string;
  color: string;
  isShared: boolean;
  createdAt: Date;
  updatedAt: Date;
}
