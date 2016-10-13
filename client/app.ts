import * as React from 'react';
import * as ReactDOM from 'react-dom';

ReactDOM.render(
    React.createElement('div', {}, ['test']),
    document.querySelector('#app') as HTMLDivElement,
);
