import * as React from 'react';
import { Banner } from '../controls/Banner';
import { MainNavigation } from '../controls/MainNavigation';

export class IndexView extends React.Component<any, void>  {
    render() {
        return (
            <div>
                <Banner/>
                <div className='App'>
                    <div id='MainNavigationContainer'>
                        <MainNavigation />
                    </div>
                    <div id='AppContent'>
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}
