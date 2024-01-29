import path from 'path';
import fs from 'fs';
import express from 'express';
import { ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';

async function importAllRoutesInside(directory: string, app: ApplicationWithCustomRoutes): Promise<void> {
    const files = fs.readdirSync(directory);
    const importPromises = [];

    for (let i = 0; i < files.length; i += 1) {
        const fullPath = path.join(directory, files[i]);

        if (fs.statSync(fullPath).isDirectory()) {
            importAllRoutesInside(fullPath, app);
        } else if (files[i].endsWith('.route.ts')) {
            importPromises.push(import(fullPath));
        }
    }

    const routes = await Promise.all(importPromises);
    routes.forEach(route => route.default(app));
}

export default async (app: ApplicationWithCustomRoutes) => {
    app.use('/assets', express.static(path.resolve(__dirname, '../../assets')));
    app.get('/', (req, res) => res.status(200).send('Bienvenue sur l\'API de Résorption Bidonvilles'));
    await importAllRoutesInside(path.resolve(__dirname, '../controllers'), app);
};
