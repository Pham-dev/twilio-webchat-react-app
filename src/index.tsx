import merge from "lodash.merge";
import { render } from "react-dom";
import { Provider } from "react-redux";

import { store } from "./store/store";
import { WebchatWidget } from "./components/WebchatWidget";
import { sessionDataHandler } from "./sessionDataHandler";
import { initConfig } from "./store/actions/initActions";
import { ConfigState } from "./store/definitions";
import { initLogger } from "./logger";

const defaultContainer = "root";
const defaultConfig: ConfigState = {
    serverUrl: "http://localhost:3001",
    theme: {
        isLight: true
    },
    fileAttachment: {
        enabled: true,
        maxFileSize: 16777216, // 16 MB
        acceptedExtensions: ["jpg", "jpeg", "png", "amr", "mp3", "mp4", "pdf", "txt"]
    },
    webchatContainer: defaultContainer
};

const initWebchat = async (config: ConfigState) => {
    const mergedConfig = merge({}, defaultConfig, config);
    sessionDataHandler.setEndpoint(mergedConfig.serverUrl);
    store.dispatch(initConfig(mergedConfig));
    initLogger();
    const { webchatContainer } = mergedConfig
    const rootElement = document.getElementById(webchatContainer ?? defaultContainer);

    render(
        <Provider store={store}>
            <WebchatWidget />
        </Provider>,
        rootElement
    );
};

declare global {
    interface Window {
        Twilio: {
            initWebchat: (config: ConfigState) => void;
        };
    }
}

// Expose `initWebchat` function to window object
Object.assign(window, {
    Twilio: {
        initWebchat
    }
});
