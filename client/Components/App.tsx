import * as React from 'react';

import { AppBar } from 'material-ui';
import { MuiThemeProvider } from 'material-ui/styles';

interface AppProps extends React.Props<any> {

}

export const App: React.StatelessComponent<AppProps> = (props: AppProps) => (
    <MuiThemeProvider>
        <AppBar 
            title='test'
        />
    </MuiThemeProvider>
);
