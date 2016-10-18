import * as React from 'react';

import { Banner } from './Banner';

require('!style!css!sass!./App.scss');

interface AppProps extends React.Props<App> {

}

interface AppState {

}

export class App extends React.Component<AppProps, AppState> {
    render() {
        return <div>
            <Banner/>
        </div>;
    }
}

