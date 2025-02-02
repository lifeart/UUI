import React from 'react';
import { render } from "react-dom";
import { FlexRow, skinContext as promoSkinContext } from "@epam/promo";
import { ContextProvider, UuiContexts } from "@epam/uui";
import "@epam/uui-components/styles.css";
import "@epam/promo/styles.css";
import "@epam/loveship/styles.css";
import Example from "./Example";
import { svc, getApi } from './api';

type TApi = ReturnType<typeof getApi>;

const rootElement = document.getElementById("root");
const origin = process.env.REACT_APP_PUBLIC_URL;

render(
    <ContextProvider<TApi, UuiContexts>
        apiDefinition={ processRequest => getApi(processRequest, origin) }
        onInitCompleted={(context) => Object.assign(svc, context)}
        skinContext={promoSkinContext}
    >
        <FlexRow vPadding='48' padding='24' borderBottom='gray40' alignItems='top' spacing='12'>
            <Example />
        </FlexRow>
    </ContextProvider>,
    rootElement
);