export type UserInvitationNotificationDto = {
    name: string;
    email: string;
    temporaryPassword: string;
    role: 'ADMIN' | 'MANAGER';
};