Reproducing problem with closing context for Playwright.
Just run `npm i` + `npm test` and compare context closing time between 2nd and 3d tests:
✓ 2 create and close context WITH video recording (8149ms)
  pw:api => browserContext.close started +0ms
  pw:api   "networkidle" event fired +674ms
  pw:api <= browserContext.close succeeded +22s

✓ 3 create and close context WITH video recording (12010ms)
  pw:api => browserContext.close started +0ms
  pw:api   navigated to "about:blank" +54ms
  pw:api   "load" event fired +0ms
  pw:api   "domcontentloaded" event fired +1ms
  pw:api   "networkidle" event fired +613ms
  pw:api <= browserContext.close succeeded +38s
