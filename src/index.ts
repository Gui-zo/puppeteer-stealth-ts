const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const CONCURRENCY = 15; 

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--proxy-server=zproxy.lum-superproxy.io:22225'
    ],
    defaultViewport: null,
  });

  const tasks = [];

  for (let i = 0; i < CONCURRENCY; i++) {
    const task = (async (index) => {
      const context = await browser.createIncognitoBrowserContext();
      const page = await context.newPage();

      await page.authenticate({
        username: 'brd-customer-hl_d8b5cfdb-zone-sweepy_devfaizy_vzw_v5_s_1',
        password: 'bvdz6vv70xsk'
      });

      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      );

      await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
      });

      await page.evaluateOnNewDocument(() => {
        const navigatorHandler = {
          get: (target: any, key: any) => {
            if (key === 'webdriver') return undefined;
            if (key === 'languages') return ['en-US', 'en'];
            if (key === 'plugins') return [1, 2, 3];
            if (key === 'hardwareConcurrency') return 8;
            if (key === 'deviceMemory') return 8;
            if (key === 'maxTouchPoints') return 1;
            if (key === 'userAgentData') {
              return {
                brands: [
                  { brand: "Not=A?Brand", version: "99" },
                  { brand: "Google Chrome", version: "122" },
                  { brand: "Chromium", version: "122" }
                ],
                mobile: false,
                platform: "Windows"
              };
            }
            return Reflect.get(target, key);
          },
          getOwnPropertyDescriptor: (target: any, key: any) => {
            if (key === 'webdriver') return undefined;
            return Reflect.getOwnPropertyDescriptor(target, key);
          },
          has: (target: any, key: any) => {
            if (key === 'webdriver') return false;
            return Reflect.has(target, key);
          }
        };
      
        const proxyNavigator = new Proxy(navigator, navigatorHandler);
        Object.defineProperty(window, 'navigator', {
          get: () => proxyNavigator
        });
      
        const getParameter = WebGLRenderingContext.prototype.getParameter;
        WebGLRenderingContext.prototype.getParameter = function (param) {
          if (param === 37445) return 'Intel Inc.';
          if (param === 37446) return 'Intel Iris Xe Graphics';
          return getParameter.call(this, param);
        };
      
        const originalQuery = window.navigator.permissions.query;
        window.navigator.permissions.query = function (parameters: any): Promise<any> {
          if (parameters.name === 'notifications') {
            return Promise.resolve({ state: Notification.permission });
          }
          return originalQuery(parameters);
        };
      
        (window as any).chrome = {
          runtime: {},
          loadTimes: () => null,
          csi: () => null,
        };
      
        const nativeToString = Function.prototype.toString;
        Function.prototype.toString = function () {
          if (this === Function.prototype.toString) {
            return 'function toString() { [native code] }';
          }
          return nativeToString.call(this);
        };
      
        Object.defineProperty(HTMLIFrameElement.prototype, 'contentWindow', {
          get: function () {
            return window;
          }
        });
      
        console.debug = () => null;
      });
      

      // await page.goto('https://www.browserscan.net/bot-detection', {
      //   waitUntil: 'networkidle2',
      //   timeout: 0,
      // });

      await page.goto('https://mblogin.verizonwireless.com/account/business/ilogin', {
        waitUntil: 'networkidle2',
        timeout: 0,
      });

      // await page.screenshot({ path: `browserscan-result-${index}.png`, fullPage: true });
      await page.screenshot({ path: `verizon-login-result-${index}.png`, fullPage: true });
      console.log(`✔ Tab ${index} done`);

      await context.close();
    })(i);

    tasks.push(task);
  }

  await Promise.all(tasks);
  await browser.close();
})();
