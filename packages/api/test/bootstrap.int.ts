import './bootstrap';
import * as child_process from 'child_process';
import config from '#db/config/config';

function runCommandAsync(command) {
    return new Promise((resolve, reject) => {
        child_process.exec(
            command,
            error => (!error ? resolve(true) : reject(error)),
        );
    });
}

let dbIsInitialized = false;

exports.mochaHooks = {
    async beforeAll() {
        if (!dbIsInitialized) {
            console.log('-- Création d\'une base de test');
            this.timeout(20000);

            const DB_NAME = `resorption_bidonvilles_tests_${process.pid}`;
            process.env.DB_NAME = DB_NAME;

            await runCommandAsync(`docker exec -t rb_database_data createdb -U ${config.username} --template resorption_bidonvilles_tests_template ${DB_NAME}`);
            dbIsInitialized = true;
        }
    },
};
