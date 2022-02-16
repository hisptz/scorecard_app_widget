import {useAlert} from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import {Button, ButtonStrip, colors} from "@dhis2/ui";
import PropTypes from "prop-types";
import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import {useRecoilValue, useSetRecoilState} from "recoil";
import RouterState from "../../../../../../core/state/router";
import {createWidget} from "../../../../../../core/services/widgetservice";
import {UserAuthorityOnScorecard} from "../../../../../../core/state/user";
import {scoreCardWidgetState} from "../../../../../../core/state/scorecardWidget";
import holderImage from "../../../../../../resources/images/img.png";
import DeleteConfirmation from "../../../../../../shared/Components/DeleteConfirmation";
import {useDeleteScorecard} from "../../../../../../shared/hooks/datastore/useScorecard";
import {truncateDescription} from "../../../../../../shared/utils/utils";
import { EngineState } from "../../../../../../core/state/engine";

export default function ScorecardListCard({scorecard, grid}) {
    const setRoute = useSetRecoilState(RouterState);
    const useCurrentDashboardIdState = useRecoilValue(scoreCardWidgetState);
    const {write, delete: deletePermission} = useRecoilValue(
        UserAuthorityOnScorecard(scorecard?.id)
    );
    const engineState = useRecoilValue(EngineState);
    const {title, description, id} = scorecard;
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const history = useHistory();
    const {remove} = useDeleteScorecard(id);
    const {show} = useAlert(
        ({message}) => message,
        ({type}) => ({...type, duration: 3000})
    );

    const onView = () => {
        setRoute((prevRoute) => ({...prevRoute, previous: `/`}));
        history.push(`/view/${id}`);
    };

    const onEdit = () => {
        if (write) {
            setRoute((prevRoute) => ({...prevRoute, previous: `/`}));
            history.push(`/edit/${id}`);
        }
    };

    const onDelete = async () => {
        if (deletePermission) {
            try {
                await remove();
            } catch (e) {
                show({
                    message: e.message,
                    type: {info: true},
                });
            }
            setDeleteConfirmOpen(false);
            show({
                message: i18n.t("Scorecard deleted successfully"),
                type: {success: true},
            });
        }
    };

    return grid ? (
        <div
            className="container-bordered p-16 "
            data-test="scorecard-thumbnail-view"
            style={{margin: 16, background: "white"}}
            onClick={onView}
        >
            <div className="column space-between h-100">
                <div className="text-center p-8">
                    <img
                        alt="img"
                        src={holderImage}
                        style={{height: 100, width: 200}}
                    />
                </div>
                <div className="flex-1 column align-items-center">
                    <h4 className="scorecard-list-card-title">{title}</h4>
                    <p
                        className="scorecard-list-card-description"
                        style={{color: colors.grey700}}
                    >
                        {description?.length > 100 ? (
                            <div
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setShowFullDescription((prevState) => !prevState);
                                }}
                                className="row space-between align-content-end"
                            >
                                {showFullDescription
                                    ? description
                                    : truncateDescription(description)}
                            </div>
                        ) : (
                            description
                        )}
                    </p>
                </div>
                <div style={{margin: "0 8px"}}>
                    <ButtonStrip middle>
                    <Button
                                dataTest="scorecard-select-button"
                                onClick={function (_, e) {
                                    e.stopPropagation();
                                    setDeleteConfirmOpen(true);
                                }}
                            >
                                {i18n.t("Select")}
                            </Button>
                    </ButtonStrip>
                </div>
                {deleteConfirmOpen && (
                    <DeleteConfirmation
                        component={
                            <p>
                                {i18n.t("Are you sure you want to select scorecard ")}:
                                <b>{title}</b>
                            </p>
                        }
                        onConfirm={function (_, e) {
                            e.stopPropagation();
                            onDelete();
                        }}
                        onCancel={function (_, e) {
                            e.stopPropagation();
                            setDeleteConfirmOpen(false);
                        }}
                    />
                )}
            </div>
        </div>
    ) : (
        <div
            data-test="scorecard-thumbnail-view"
            className="container-bordered p-32"
            style={{margin: 16, background: "white"}}
            onClick={onView}
        >
            <div className="row space-between align-items-center">
                <div className="row align-items-center">
                    <div>
                        <img
                            alt="img"
                            src={holderImage}
                            style={{height: 100, width: 200}}
                        />
                    </div>
                    <div className="column start">
                        <h4 className="scorecard-list-card-title">{title}</h4>
                        <p
                            className="scorecard-list-card-description"
                            style={{color: colors.grey700}}
                        >
                            {description?.length > 100 ? (
                                <div
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        setShowFullDescription((prevState) => !prevState);
                                    }}
                                    className="row space-between align-content-end"
                                >
                                    {showFullDescription
                                        ? description
                                        : truncateDescription(description)}
                                </div>
                            ) : (
                                description
                            )}
                        </p>
                    </div>
                </div>
                <div className="row end">
                    <ButtonStrip middle>
                    <Button
                                dataTest="scorecard-delete-button"
                                onClick={function (_, e) {
                                    e.stopPropagation();
                                    /**
                                     * Todo: Save this scorecard reference into a datastore
                                     */
                                    setDeleteConfirmOpen(true);
                                }}
                            >
                                {i18n.t("Select")}
                            </Button>
                    </ButtonStrip>
                    {deleteConfirmOpen && (
                        <DeleteConfirmation
                            component={
                                <p>
                                    {i18n.t("Are you sure you want to select scorecard")}:
                                    <b>{title}</b>
                                </p>
                            }
                            onConfirm={function (_, e) {
                                e.stopPropagation();
                                onDelete();
                            }}
                            onCancel={function (_, e) {
                                e.stopPropagation();
                                setDeleteConfirmOpen(false);
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

ScorecardListCard.propTypes = {
    grid: PropTypes.bool.isRequired,
    scorecard: PropTypes.object,
};
