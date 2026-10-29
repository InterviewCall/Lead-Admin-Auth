import { Queue } from 'bullmq';

import { bullMqConnection } from '../configs/bullMq.config.js';

export const USER_INVITATION_NOTIFICATION_QUEUE =
    'user-invitation-notification-queue';

export const USER_INVITATION_NOTIFICATION_PAYLOAD =
    'payload:user-invitation-notification';

export type UserInvitationNotificationPayload = {
    userId: number;
    name: string;
    email: string;
    role: 'ADMIN' | 'MANAGER';
    temporaryPassword: string;
    loginUrl: string;
};

const userInvitationNotificationQueue =
    new Queue<UserInvitationNotificationPayload>(
        USER_INVITATION_NOTIFICATION_QUEUE,
        {
            connection: bullMqConnection,
            defaultJobOptions: {
                attempts: 5,
                backoff: {
                    type: 'exponential',
                    delay: 30_000,
                },
                removeOnComplete: true,

                // Keep failed jobs briefly because the payload contains
                // a temporary password.
                removeOnFail: {
                    age: 60 * 60,
                    count: 100,
                },
            },
        },
    );

export async function enqueueUserInvitationNotification(
    payload: UserInvitationNotificationPayload,
): Promise<void> {
    await userInvitationNotificationQueue.add(
        USER_INVITATION_NOTIFICATION_PAYLOAD,
        payload,
    );
}