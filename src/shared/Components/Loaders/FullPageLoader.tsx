import {CenteredContent, CircularLoader, colors} from "@dhis2/ui";
import React from "react";

export default function FullPageLoader({text, small}:any):React.ReactElement {
    return (
        <div className="column center" style={{height: "100%", width: '100%'}}>
            <CenteredContent>
                <div>
                    <CircularLoader small={small}/>
                    <p style={{color: colors.default}}>{text}</p>
                </div>
            </CenteredContent>
        </div>
    );
}
