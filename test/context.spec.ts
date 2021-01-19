import { Page } from 'playwright';
import { browser } from '../src/browser';

describe('suite', function () {
    before('init', async function () {
        await browser.createInstance('chromium', chromiumOptions);
    });

    it('1 create and close context without video recording', async function () {
        const page1 = await browser.getPage({ recordVideo: true });
        await page1.goto(GooglePage.link);
        await searchSomething(page1, 'speedtest', 'text=Internet speed test');
    });

    it('2 create and close context WITH video recording', async function () {
        const page1 = await browser.getPage({ recordVideo: true });
        const page2 = await browser.getPage({ recordVideo: true });

        // 1 statement
        await Promise.all([page1.goto(GooglePage.link), page2.goto(GooglePage.link)]);
        await searchSomething(page1, 'speedtest', 'text=Internet speed test');
        await searchSomething(page2, 'speedtest', 'text=Internet speed test');

        // 2 statement
        await Promise.all([page1.goto(GooglePage.link), page2.goto(GooglePage.link)]);
        await searchSomething(page1, 'speedtest', 'text=Internet speed test');
        await searchSomething(page2, 'speedtest', 'text=Internet speed test');
    });

    it('3 create and close context WITH video recording', async function () {
        const page1 = await browser.getPage({ recordVideo: true });
        const page2 = await browser.getPage({ recordVideo: true });

        // 1 statement
        await Promise.all([page1.goto(GooglePage.link), page2.goto(GooglePage.link)]);
        await searchSomething(page1, 'speedtest', 'text=Internet speed test');
        await searchSomething(page2, 'speedtest', 'text=Internet speed test');

        // 2 statement
        await Promise.all([page1.goto(GooglePage.link), page2.goto(GooglePage.link)]);
        await searchSomething(page1, 'speedtest', 'text=Internet speed test');
        await searchSomething(page2, 'speedtest', 'text=Internet speed test');

        // 3 statement
        await Promise.all([page1.goto(GooglePage.link), page2.goto(GooglePage.link)]);
        await searchSomething(page1, 'speedtest', 'text=Internet speed test');
        await searchSomething(page2, 'speedtest', 'text=Internet speed test');

        // 4 statement
        await Promise.all([page1.goto(GooglePage.link), page2.goto(GooglePage.link)]);
        await searchSomething(page1, 'speedtest', 'text=Internet speed test');
        await searchSomething(page2, 'speedtest', 'text=Internet speed test');
    });

    it('4 create and close context without video recording', async function () {
        const page1 = await browser.getPage({ recordVideo: true });

        await page1.goto(GooglePage.link);
        await searchSomething(page1, 'speedtest', 'text=Internet speed test');
    });

    async function searchSomething(page: Page, inputValue: string, expectedValue: string) {
        await page.fill(GooglePage.searchInput, inputValue);
        await page.click(GooglePage.searchButton);
        await page.waitForSelector(expectedValue);
    }

    after('close browser', async function () {
        await browser.close();
    });
});

const chromiumOptions = {
    timeout: 5000,
    headless: false,
    devtools: false,
    args: [
        '--disable-dev-shm-usage',
        '--shm-size=2gb',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-user-media-security',
        '--disable-settings-window',
        '--disable-restore-session-state',
        '--disable-session-crashed-bubble',
        '--autoplay-policy=no-user-gesture-required',
        '--use-fake-ui-for-media-stream',
        '--use-fake-device-for-media-stream',
        '--allow-file-access-from-files',
        '--disable-translate',
    ],
    fakeAudio: 'test-data/fakes/fake_audio.wav',
    fakeVideo: 'test-data/fakes/fake_video.mjpeg',
};

const GooglePage = {
    link: 'https://google.com',
    searchInput: '[name="q"]',
    searchButton: '[name="btnK"]',
};
