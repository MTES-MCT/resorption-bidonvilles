import { type Request } from 'express';
import { type User } from '#root/types/resources/User.d';

export type InvitationPerson = Pick<User, 'first_name' | 'last_name' | 'email'>;
export interface InvitationCreateRequest extends Request {
    body: {
        greeter: InvitationPerson;
        guests: InvitationPerson[];
        invite_from: string;
    };
}
