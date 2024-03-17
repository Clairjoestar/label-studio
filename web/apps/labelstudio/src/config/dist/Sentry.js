"use strict";
exports.__esModule = true;
exports.SentryRoute = exports.initSentry = void 0;
var Sentry = require("@sentry/browser");
var ReactSentry = require("@sentry/react");
var tracing_1 = require("@sentry/tracing");
var react_router_dom_1 = require("react-router-dom");
exports.initSentry = function (history) {
    setTags();
    Sentry.init({
        dsn: "https://5f51920ff82a4675a495870244869c6b@o227124.ingest.sentry.io/5838868",
        integrations: [
            new tracing_1.Integrations.BrowserTracing({
                routingInstrumentation: ReactSentry.reactRouterV5Instrumentation(history)
            }),
        ],
        environment: process.env.NODE_ENV,
        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 0.25,
        release: getVersion()
    });
};
var setTags = function () {
    var tags = {};
    if (APP_SETTINGS.user.email) {
        Sentry.setUser({
            email: APP_SETTINGS.user.email,
            username: APP_SETTINGS.user.username
        });
    }
    if (APP_SETTINGS.version) {
        Object.entries(APP_SETTINGS.version).forEach(function (_a) {
            var packageName = _a[0], data = _a[1];
            var _b = data !== null && data !== void 0 ? data : {}, version = _b.version, commit = _b.commit;
            if (version) {
                tags['version-' + packageName] = version;
            }
            if (commit) {
                tags['commit-' + packageName] = commit;
            }
        });
    }
    Sentry.setTags(tags);
};
var getVersion = function () {
    var _a, _b;
    var version = (_b = (_a = APP_SETTINGS.version) === null || _a === void 0 ? void 0 : _a["label-studio-os-package"]) === null || _b === void 0 ? void 0 : _b.version;
    return version ? version : process.env.RELEASE_NAME;
};
exports.SentryRoute = ReactSentry.withSentryRouting(react_router_dom_1.Route);
