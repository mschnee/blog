import * as express from 'express';
import * as helmet from 'helmet';

// this is partially generated: check for tsc errors!
import initRoutes from './generated/router';

const app = express();
app.use(helmet());

export default function runServer(port: number = 8081) {
    initRoutes(app);
    app.listen(port, 'localhost', () => {
        console.log(`server started on port ${port}`);
    });
};
