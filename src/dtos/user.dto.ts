export type CreateUserDto = {
    name: string;
    email: string;
    phoneNo: string;
    role: 'ADMIN' | 'MANAGER';
};