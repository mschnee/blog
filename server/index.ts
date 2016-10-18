import * as express from 'express';
import * as helmet from 'helmet';

import initRoutes from './routing';

const app = express();
app.use(helmet());

export default function devServer(port: number = 8081) {
    initRoutes(app);
    app.listen(port, 'localhost', () => {
        console.log(`server started on port ${port}`);
    });
};
