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
        } else if (files[i].endsWith('.route.ts') || files[i].endsWith('.route.js')) {
            importPromises.push(import(fullPath));
        }
    }

    const routes = await Promise.all(importPromises);
    routes.forEach(route => route.default(app));
}

export default async (app: ApplicationWithCustomRoutes) => {
    app.use('/assets', express.static(path.resolve(__dirname, '../../assets')));
    app.get('/', (req, res) => {
        const filePath = path.resolve(__dirname, '../../assets/permanently_moving.html');
        res.status(200).sendFile(filePath, (err) => {
            if (err) {
                res.status(404).send('File not found');
            }
        });
    });
    await importAllRoutesInside(path.resolve(__dirname, '../controllers'), app);
};
