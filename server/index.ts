import * as express from 'express';
import * as helmet from 'helmet';

const app = express();
app.use(helmet());

export default function devServer(port: number) {
    app.listen(port, 'localhost', ()=> {
        console.log('server started');
    });
};
