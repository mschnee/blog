import * as React from 'react';
import { Banner } from '../controls/Banner';
import { MainNavigation } from '../controls/MainNavigation';
import { AboutView } from './AboutView';

export class IndexView extends React.Component<any, void>  {
    render() {
        return (
            <div>
                <Banner/>
                <div className='App'>
                    <MainNavigation />
                    <div className='AppContent'>
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}
