import * as React from 'react';
import * as ReactDOM from 'react-dom';

declare var require: {
    <T>(path: string): T;
    (paths: string[], callback: (...modules: any[]) => void): void;
    ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
};

require('!style!css!sass!./app.scss');

ReactDOM.render(
    React.createElement('div', {}, ['test']),
    document.getElementById('app')
);
