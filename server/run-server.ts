import * as express from 'express';
import * as helmet from 'helmet';

import { config, logger } from './global';

// this is partially generated: check for tsc errors!
import initRoutes from './generated/router';

const app = express();
app.use(helmet());

export default function runServer(port: number = 8081) {
    initRoutes(app);
    app.listen(port || config.port, config.hostname || 'localhost', () => {
        logger.info(`Started production API server at ${config.hostname}:${config.port}`);
    });
};
