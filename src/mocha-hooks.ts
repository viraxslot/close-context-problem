import * as fs from 'fs';
import * as config from 'config';
import { browser } from './browser';

exports.mochaHooks = async (): Promise<any> => {
    return {
        async beforeAll(): Promise<void> {},

        async beforeEach(): Promise<void> {
            const dir = config.get('videosDir') as string;
            fs.rmdirSync(dir, { recursive: true });
            fs.mkdirSync(dir);
        },

        async afterEach(): Promise<void> {
            await browser.freeAllContexts();
            await browser.closeAllContextsExceptOne();
        },

        async afterAll(): Promise<void> {},
    };
};
