export class Calendar {
  constructor(
    public id: string,
    public name: string,
    public ownerId: string,
    public description?: string | null,
    public color?: string | null,
    public isShared: boolean = false,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}
