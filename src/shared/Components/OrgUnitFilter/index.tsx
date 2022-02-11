import i18n from "@dhis2/d2-i18n";
import {
  Box,
  CenteredContent,
  CheckboxField,
  CircularLoader,
  colors,
  MultiSelectField,
  MultiSelectOption,
  OrganisationUnitTree,
} from "@dhis2/ui";
import { cloneDeep, find, isEmpty, remove } from "lodash";
import React, { useMemo } from "react";
import useOrgUnitLevelsAndGroups from "./hooks/getLevelsAndGroups";
import useOrgUnitsRoot from "./hooks/useOrgUnitsRoot";

export default function OrgUnitFilter({ value, onUpdate }:any):React.ReactElement {
  const { roots, error, loading }:any = useOrgUnitsRoot();
  const {
    orgUnits: selectedOrgUnits = [],
    levels: selectedLevels,
    groups: selectedGroups,
    userOrgUnit,
    userSubUnit,
    userSubX2Unit,
  } = value || {};
  const {
    groups,
    levels,
    error: levelsAndGroupsError,
    loading: levelsAndGroupsLoading,
  }:any = useOrgUnitLevelsAndGroups();

  function isOrgUnitSelected(orgUnit:any) {
    return !isEmpty(find(selectedOrgUnits, ["id", orgUnit?.id]));
  }

  const onSelectOrgUnit = (orgUnit:any) => {
    onUpdate({
      ...value,
      orgUnits: [...selectedOrgUnits, orgUnit],
    });
  };

  const onDeselectOrgUnit = (orgUnit:any) => {
    const updateValue = cloneDeep(selectedOrgUnits);
    remove(updateValue, ["id", orgUnit.id]);
    onUpdate({
      ...value,
      orgUnits: updateValue,
    });
  };
  const onLevelSelect = ({ selected }:any) => {
    onUpdate({
      ...value,
      levels: selected,
    });
  };

  const onGroupSelect = ({ selected }:any) => {
    onUpdate({
      ...value,
      groups: selected,
    });
  };

  const onUserOrUnitChange = ({ checked }:any) => {
    onUpdate({
      ...value,
      userOrgUnit: checked,
      orgUnits: [],
      levels: [],
      groups: [],
    });
  };
  const onUserSubUnitsChange = ({ checked }:any) => {
    onUpdate({
      ...value,
      userSubUnit: checked,
      orgUnits: [],
      levels: [],
      groups: [],
    });
  };

  const onUserSubX2Units = ({ checked }:any) => {
    onUpdate({
      ...value,
      userSubX2Unit: checked,
      orgUnits: [],
      levels: [],
      groups: [],
    });
  };

  const disableSelections = useMemo(
    () => userOrgUnit || userSubX2Unit || userSubUnit,
    [userOrgUnit, userSubUnit, userSubX2Unit]
  );

  return (
    <Box minHeight="400px">
      <div
        style={{ minHeight: 400, maxHeight: 400, overflow: "hidden" }}
        className="container-bordered"
      >
        <div
          style={{ background: colors.grey200 }}
          className="row space-between p-16"
        >
          <CheckboxField
            checked={userOrgUnit}
            onChange={onUserOrUnitChange}
            label={i18n.t("User organisation unit")}
          />
          <CheckboxField
            checked={userSubUnit}
            onChange={onUserSubUnitsChange}
            label={i18n.t("User sub-units")}
          />
          <CheckboxField
            checked={userSubX2Unit}
            onChange={onUserSubX2Units}
            label={i18n.t("User sub-x2-units")}
          />
        </div>
        {error && (
          <CenteredContent>
            <p>{error?.message || error.toString()}</p>
          </CenteredContent>
        )}
        <div className="p-16" style={{ maxHeight: 400, overflow: "auto" }}>
          {roots && (
            <div
              style={
                disableSelections ? { opacity: 0.3, cursor: "not-allowed" } : {}
              }
            >
              <OrganisationUnitTree
                disableSelection={disableSelections}
                selected={selectedOrgUnits?.map(({ path }:any) => path)}
                initiallyExpanded={selectedOrgUnits?.map(({ path }:any) => path)}
                roots={roots?.map(({ id }:any) => id)}
                onChange={(orgUnit:any) => {
                  if (isOrgUnitSelected(orgUnit)) {
                    onDeselectOrgUnit(orgUnit);
                  } else {
                    onSelectOrgUnit(orgUnit);
                  }
                }}
                singleSelection
              />
            </div>
          )}
          {loading && !error && (
            <CenteredContent>
              <CircularLoader small />
            </CenteredContent>
          )}
        </div>
      </div>
      <div className="row pt-32 w-75">
        <div className="column">
          <MultiSelectField
            disabled={disableSelections}
            clearable
            loading={levelsAndGroupsLoading}
            error={levelsAndGroupsError}
            validationText={levelsAndGroupsError?.message}
            onChange={onLevelSelect}
            selected={selectedLevels}
            clearText={i18n.t("Clear")}
            label={i18n.t("Select Level(s)")}
          >
            {levels?.map(({ displayName, id }:any) => (
              <MultiSelectOption label={displayName} value={id} key={id} />
            ))}
          </MultiSelectField>
        </div>
        <div className="column">
          <MultiSelectField
            disabled={disableSelections}
            clearable
            loading={levelsAndGroupsLoading}
            error={levelsAndGroupsError}
            validationText={levelsAndGroupsError?.message}
            onChange={onGroupSelect}
            selected={selectedGroups}
            dataTest={"select-facility-group"}
            clearText={i18n.t("Clear")}
            label={i18n.t("Select Group(s)")}
          >
            {groups?.map(({ displayName, id }:any) => (
              <MultiSelectOption label={displayName} value={id} key={id} />
            ))}
          </MultiSelectField>
        </div>
      </div>
    </Box>
  );
}

