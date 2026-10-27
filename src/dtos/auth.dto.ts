export type LoginUserDto = {
    email: string;
    password: string;
};

export type ResetPasswordDto = {
    newPassword: string;
    confirmPassword: string;
};