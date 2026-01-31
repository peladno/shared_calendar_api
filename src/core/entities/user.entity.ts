export class User {
  constructor(
    public id: string,
    public email: string,
    public username: string,
    public passwordHash: string,
    public fullName?: string | null,
    public avatarUrl?: string | null,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}
