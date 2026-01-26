export interface AuthResponseDTO {
  token: string;
  user: {
    id: string;
    email: string;
    username: string;
    fullName?: string;
    avatarUrl?: string;
  };
}
