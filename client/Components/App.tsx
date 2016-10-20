import * as React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import { IndexView } from './views/IndexView';
import { AboutView } from './views/AboutView';

require('./App.scss');

interface AppProps extends React.Props<App> {

}

interface AppState {

}

export class App extends React.Component<AppProps, AppState> {
    render() {
        return(
            <Router history={browserHistory}>
                <Route path='/' component={IndexView}>
                    <IndexRoute component={AboutView} />
                    <Route path='/about' component={AboutView} />
                </Route>
            </Router>
        );
    }
}

