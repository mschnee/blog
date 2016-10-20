import * as React from 'react';
import { InjectedRouter } from 'react-router';
import { Avatar } from './Avatar';
require('./MainNavigation.scss');

interface MainNavigationProps extends React.Props<MainNavigation> {
    selectedItem?: string;
}

interface MainNavigationState {
    offScreen?: boolean;
}

// this will eventually come from a service and be made up of frequent post tags
const navItems = new Map<string, string>([
    ['/', 'Home'],
    ['/about', 'About'],
    ['/news', 'News'],
    ['/sports', 'Sports'],
    ['/etc', 'Brain-Droppings']
]);

export class MainNavigation extends React.Component<MainNavigationProps, MainNavigationState> {
    static contextTypes: React.ValidationMap<any> = {
        router: React.PropTypes.object.isRequired
    };
    context: {
        router: InjectedRouter
    };

    render() {
        let items: JSX.Element[] = [];
        navItems.forEach((value, key) => {
            items.push(
                <div className='item' key={key} data-href={key}>
                    {value}
                </div>
            );
        });

        return (
            <div className='MainNavigation app-container' onClick={this.onClickLink}>
                <div className='NavContainer'>
                    <Avatar />
                    {items}
                </div>
            </div>
        );
    }

    onClickLink = (e: any) => {
        console.log(e.target.dataset);
        if (e.target.dataset && e.target.dataset.href) {
            this.context.router.push(e.target.dataset.href);
        }
    }
}
