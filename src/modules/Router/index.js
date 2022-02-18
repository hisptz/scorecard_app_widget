import React, {Suspense} from "react";
import {ErrorBoundary} from "react-error-boundary";
import {HashRouter, Redirect, Route, Switch} from "react-router-dom";
import {useRecoilValue} from "recoil";
import {SystemSettingsState} from "../../core/state/system";
import FullPageError from "../../shared/Components/Errors/FullPageError";
import {FullPageLoader} from "../../shared/Components/Loaders";
import Main from "../Main/index";
import ScorecardView from "../Main/Components/ScorecardView/index";
import ScorecardMigration from "../Main/Components/ScorecardMigration";

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
        component: Main
    },
];

export default function Router() {
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
