import { serialized as authUser } from './user';
import { AuthUser } from '#server/middlewares/authMiddleware';

// Définir l'interface SimplifiedUser
interface SimplifiedUser {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    position: string;
    organization: string;
    organization_id: number;
}

// Fonction pour simplifier un AuthUser
export function serialized(override: Partial<AuthUser> = {}): SimplifiedUser {
    const defaultUser: SimplifiedUser = {
        id: authUser().id,
        email: authUser().email,
        first_name: authUser().first_name,
        last_name: authUser().last_name,
        role: authUser().role,
        position: authUser().position,
        organization: authUser().organization.name,
        organization_id: authUser().organization.id,
    };
    return Object.assign(defaultUser, override);
}

export default serialized;
