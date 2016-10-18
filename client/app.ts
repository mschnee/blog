import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './Components';
import * as injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

declare var require: {
    <T>(path: string): T;
    (paths: string[], callback: (...modules: any[]) => void): void;
    ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
};

require('./app.scss');

ReactDOM.render(
    React.createElement(App, {}),
    document.getElementById('app')
);
