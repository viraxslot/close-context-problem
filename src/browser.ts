import { IConfig } from 'config';
import * as _ from 'lodash';
import { Browser, BrowserContext, chromium, firefox, Page, webkit } from 'playwright';
import * as config from 'config';

class BrowserInstance {
    private _instance: Browser;
    private _contexts: Array<{ ctx: BrowserContext; occupied: boolean }> = [];
    private _pages: Array<{ page: Page; occupied: boolean }> = [];
    private _name: string;

    public async createInstance(browserName: string, browserConfig: IConfig): Promise<void> {
        this._instance = await { chromium, webkit, firefox }[browserName].launch(browserConfig);
        this._name = browserName;
    }

    public get name(): string {
        return this._name;
    }

    public async close(): Promise<void> {
        if (!this._instance) {
            throw new Error('Create browser instance first');
        }

        await this._instance.close();
    }

    public contexts(): Array<BrowserContext> {
        return this._contexts.map((c) => c.ctx);
    }

    public pages(): Array<Page> {
        return this._pages.map((p) => p.page);
    }

    public async getContext(): Promise<BrowserContext> {
        const ctx = _.find(this._contexts, (ctx) => !ctx.occupied);
        if (!ctx) {
            await this.createContextAndPage();
            return _.last(this._contexts).ctx;
        }

        ctx.occupied = true;
        return ctx.ctx;
    }

    public async getPage(parameters): Promise<Page> {
        const page = _.find(this._pages, (page) => !page.occupied);
        if (!page) {
            await this.createContextAndPage(parameters);
            return _.last(this._pages).page;
        }

        page.occupied = true;
        return page.page;
    }

    public async freeAllContexts(): Promise<void> {
        for (const context of this._contexts) {
            context.occupied = false;
        }

        for (const page of this._pages) {
            page.occupied = false;
        }
    }

    public async closeAllContexts(): Promise<void> {
        for (const context of this._contexts) {
            await context.ctx.close();
        }

        this._contexts = [];
        this._pages = [];
    }

    public async closeAllContextsExceptOne(): Promise<void> {
        for (let i = 1; i < this._contexts.length; i++) {
            await this._contexts[i].ctx.close();
            this._contexts.splice(i, 1);
            this._pages.splice(i, 1);
        }
    }

    private async createContextAndPage(parameters?): Promise<void> {
        if (!this._instance) {
            throw new Error('Create browser instance first');
        }

        let contextParameters = {};
        if (parameters?.recordVideo) {
            contextParameters = {
                recordVideo: {
                    dir: 'videos',
                },
            };
        }

        const ctx = await this._instance.newContext(contextParameters);
        this._contexts.push({
            ctx: ctx,
            occupied: true,
        });

        const page = await ctx.newPage();
        page.setDefaultTimeout(15000);
        this._pages.push({
            page: page,
            occupied: true,
        });
    }

    public enableExceptionLogging(): void {
        _.forEach(this._pages, (pageObj) => {
            pageObj.page.on('pageerror', (exception) => {
                console.log(`Uncaught exception: ${exception.message}}`);
                console.log(JSON.stringify(exception.stack));
            });
        });
    }

    public enableErrorLogging(excludeMessages: Array<string>): void {
        _.forEach(this._pages, (pageObj) => {
            pageObj.page.on('console', async (msg) => {
                if (msg.type() === 'error' && !excludeMessages.some((v) => msg.text().includes(v))) {
                    console.log(`Error text: "${JSON.stringify(msg.text())}"`);
                }
            });
        });
    }
}

export const browser = new BrowserInstance();
