import * as React from 'react';
import { Icon, IAdaptiveItem } from '@epam/uui';
import cx from 'classnames';
import { ButtonProps, IconContainer } from '@epam/uui-components';
import * as css from './MainMenuIcon.scss';

export interface MainMenuIconProps extends ButtonProps, IAdaptiveItem {
    icon: Icon;
}

export const MainMenuIcon = (props: MainMenuIconProps) => (
    <div onClick={ props.onClick } className={ cx(props.cx, css.container) }>
        <IconContainer icon={ props.icon } />
    </div>
);