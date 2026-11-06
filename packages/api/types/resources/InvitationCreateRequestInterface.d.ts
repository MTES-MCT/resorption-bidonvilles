import { type Request } from 'express';

export interface InvitationGuest {
    first_name: string;
    last_name: string;
    email: string;
}

export interface InvitationGreeter {
    first_name: string;
    last_name: string;
    email: string;
}

export interface InvitationCreateRequest extends Request {
    body: {
        greeter: InvitationGreeter;
        guests: InvitationGuest[];
        invite_from: string;
    };
}
