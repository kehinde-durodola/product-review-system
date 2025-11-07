export interface UpdateUserDto {
  name?: string;
  email?: string;
}

export interface UpdatePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  isVerified: boolean;
  createdAt: Date;
}
