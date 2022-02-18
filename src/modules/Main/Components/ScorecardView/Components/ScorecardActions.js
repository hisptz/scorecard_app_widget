import i18n from "@dhis2/d2-i18n";
import {Button, ButtonStrip, DropdownButton} from "@dhis2/ui";
import PropTypes from "prop-types";
import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import {useRecoilCallback, useRecoilState, useRecoilValue, useSetRecoilState,} from "recoil";
import ScorecardDataEngine from "../../../../../core/models/scorecardData";
import RouterState from "../../../../../core/state/router";
import {ScorecardIdState, ScorecardRequestId, ScorecardViewState,} from "../../../../../core/state/scorecard";
import {UserAuthorityOnScorecard} from "../../../../../core/state/user";
import ScorecardOptionsModal from "../../../../../shared/Components/ScorecardOptionsModal";
import DownloadMenu from "./Download/Components/DownloadMenu";
import useDownload from "./ScorecardViewHeader/hooks/useDownload";
import {useConfig} from "@dhis2/app-runtime";
import {constructAppUrl} from "../utils/constructUrl"

export default function ScorecardActions({downloadAreaRef, dataEngine}) {
    const setRoute = useSetRecoilState(RouterState);
    const [scorecardOptions, setScorecardOptions] = useRecoilState(
        ScorecardViewState("options")
    );
    const [optionsOpen, setOptionsOpen] = useState(false);
    const {download: onDownload} = useDownload(downloadAreaRef, dataEngine);
    const scorecardId = useRecoilValue(ScorecardIdState);
    const userAuthority = useRecoilValue(UserAuthorityOnScorecard(scorecardId));
    const {serverVersion, baseUrl} = useConfig();
    const writeAccess = userAuthority?.write;
    const history = useHistory();

    const onRefresh = useRecoilCallback(({reset, set}) => () => {
        set(ScorecardRequestId(scorecardId), prevValue => prevValue + 1)
        reset(ScorecardViewState(scorecardId))
    });

    const onEdit = () => {
        if (true) {
            setRoute((prevRoute) => ({
                ...prevRoute,
                previous: `/view/${scorecardId}`,
            }));
            console.log("history ",window.parent.location)
            console.log("server version",serverVersion)
   const appUrl =   constructAppUrl(baseUrl,{
            name:"hisptz-Scorecard",
            title:"Interactive Dashboard"
        },serverVersion)
console.log("app url ",appUrl)
        return window.parent.location.href(appUrl + "/edit/" + scorecardId)
        //window.parent.location.href("/edit/" + scorecardId);
            // history.push(`/edit/${scorecardId}`);
        }
    };

//     const baseUrl = async()=>{
  
// const [, apiVersion] = (await fetch(`${manifest.activities.dhis.href}/api/system/info.json`)
// .then(res => res.json())
// .then((systemInfo) => systemInfo.version))
//     }



    return (
        <div className="row end print-hide">
            <div className="column align-items-end">
                <ButtonStrip>
                    {true && (
                        <Button
                            dataTest={"edit-scorecard-button"}
                            className="scorecard-view-edit-button"
                            onClick={onEdit}
                        >
                            {i18n.t("Edit")}
                        </Button>
                    )}
                </ButtonStrip>
            </div>

            {optionsOpen && (
                <ScorecardOptionsModal
                    onClose={() => setOptionsOpen(false)}
                    initialValues={scorecardOptions}
                    onSelect={setScorecardOptions}
                />
            )}
        </div>
    );
}

ScorecardActions.propTypes = {
    dataEngine: PropTypes.instanceOf(ScorecardDataEngine).isRequired,
    downloadAreaRef: PropTypes.any.isRequired,
};
