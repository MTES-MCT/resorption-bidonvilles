// import { postApi } from '#helpers/api/main';

export function create() {
    return new Promise((success, failure) => {
        setTimeout(() => {
            failure({
                user_message: 'Une erreur est survenue',
                fields: {
                    name: ['Le nom est invalide'],
                },
            });
        }, 2000);
    });
    // return postApi('/operators', data);
}

export default create;
