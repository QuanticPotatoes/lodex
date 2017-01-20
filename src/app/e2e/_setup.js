import http from 'http';
import path from 'path';

import api from '../../api';
import driver from '../../common/tests/chromeDriver';
import staticServer from '../../common/tests/staticServer';

before(async function () {
    this.apiServer = http.createServer(api.callback());
    this.apiServer.listen(3010);
});

after(async function () {
    this.apiServer.close();
    await driver.quit();
});
