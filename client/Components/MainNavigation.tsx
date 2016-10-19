import * as React from 'react';

require('./MainNavigation.scss');

interface MainNavigationProps extends React.Props<MainNavigation> {
    selectedItem?: string;
}

interface MainNavigationState {
    offScreen?: boolean;
}

const navItems = [
    'Home',
    'About',
    'Tech',
    'News',
    'Sports',
    'Brain-Droppings',
];

export class MainNavigation extends React.Component<MainNavigationProps, MainNavigationState> {
    render() {
        const items = navItems.map(item => (
            <div className='item' key={item}>
                {item}
            </div>
        ));

        return (
            <div className='MainNavigation'>
                {items}
            </div>
        );
    }
}
