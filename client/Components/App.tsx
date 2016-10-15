import * as React from 'react';

import { MuiThemeProvider } from 'material-ui/styles/MuiThemeProvider';
import { AppBar } from 'material-ui';


export const App = () => (
        <MuiThemeProvider>
                <AppBar 
                        title='test'
                />
        </MuiThemeProvider>
);
