import React, { useCallback } from "react";
import { ContextProvider } from "@epam/uui";
import { svc } from "../../../services";
import { AmplitudeClient, getInstance} from "amplitude-js";
import { IAnalyticsListener, AnalyticsEvent } from "@epam/uui";

/**An example of creation AmplitudeClientListener */
class AmplitudeListener implements IAnalyticsListener {
    public ampCode: string;
    public client: AmplitudeClient;

    constructor(ampCode: string) {
        this.ampCode = ampCode;
        this.client = this.getAmplitudeClient();
    }

    private getAmplitudeClient(): AmplitudeClient {
        const ampclient = getInstance();
        ampclient.init(this.ampCode, undefined, {includeReferrer: true, includeUtm: true, saveParamsReferrerOncePerSession: false});
        return ampclient;
    }

    public sendEvent(event: AnalyticsEvent, parameters: Omit<AnalyticsEvent, "name">, eventType: string) {
        if (eventType !== "event") return;
        this.client.logEvent(event.name, parameters);
    }
}

const AnalyticsContextBase: React.FC = () => {
    const loadAppContext = useCallback((api: any) => Promise.resolve(), []);

    const onInitCompleted = useCallback((context) => {
        Object.assign(svc, context);

        /**Here you can create AmplitudeClient and add it to the listener*/
        const listener = new AmplitudeListener("Your amplitude secret key");
        context.uuiAnalytics.addListener(listener);
    }, []);

    return (
        <ContextProvider
            loadAppContext={ loadAppContext }
            onInitCompleted={ onInitCompleted }
            gaCode='Your google analytics secret key'
        >
            Your app component
        </ContextProvider>
    );
};

export default AnalyticsContextBase;