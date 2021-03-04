import { withMods } from '@epam/uui';
import { Accordion as uuiAccordion, AccordionProps } from '@epam/uui-components';
import { systemIcons } from '../../icons/icons';
import * as styles from '../../assets/styles/colorvars/layout/accordion-colorvars.scss';
import * as css from './Accordion.scss';

export interface AccordionMods {
    mode?: 'block' | 'inline';
    padding?: '0' | '6' | '12' | '18';
}

function applyAccordionMods(mods: AccordionMods & AccordionProps) {
    return [
        css.root,
        styles.accordionColors,
        css['mode-' + (mods.mode || 'block')],
        mods.padding && css['padding-' + mods.padding],
    ];
}

export const Accordion = withMods<AccordionProps, AccordionMods>(uuiAccordion, applyAccordionMods, (mods: AccordionMods & AccordionProps) => ({
    dropdownIcon: systemIcons[mods.mode === 'block' ? '60' : '30'].foldingArrow,
}));
