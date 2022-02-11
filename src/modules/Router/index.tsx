import React, {Suspense} from "react";
import {ErrorBoundary} from "react-error-boundary";
import {HashRouter, Redirect, Route, Switch} from "react-router-dom";
import {useRecoilValue} from "recoil";
import {SystemSettingsState} from "../../core/state/system";
import FullPageError from "../../shared/Components/Errors/FullPageError";
import {FullPageLoader} from "../../shared/Components/Loaders";

const Main = React.lazy(() => import("../Main"));

const ScorecardView = React.lazy(() =>
    import("../Main/Components/ScorecardView")
);

const ScorecardMigration = React.lazy(() =>
    import("../Main/Components/ScorecardMigration")
);

const pages = [
    {
        pathname: "/migrate",
        component: ScorecardMigration,
    },
    {
        pathname: "/view/:id",
        component: ScorecardView,
    },
    {
        pathname: "/",
        component: Main,
    },
];

export default function Router(): React.ReactElement {
    useRecoilValue(SystemSettingsState);
    return (
        <HashRouter>
            <ErrorBoundary FallbackComponent={FullPageError}>
                <Suspense fallback={<FullPageLoader/>}>
                    <Switch>
                        {pages.map(({pathname, component}) => {
                            const Component = component;
                            return (
                                <Route key={pathname} path={pathname}>
                                    <ErrorBoundary FallbackComponent={FullPageError}>
                                        <Component/>
                                    </ErrorBoundary>
                                </Route>
                            );
                        })}
                        <Route path="/*">
                            <Redirect to={"/"}/>
                        </Route>
                    </Switch>
                </Suspense>
            </ErrorBoundary>
        </HashRouter>
    );
}
