import { PeriodDimension } from "@dhis2/analytics";
import {
  Button,
  ButtonStrip,
  Modal,
  ModalActions,
  ModalContent,
  ModalTitle,
} from "@dhis2/ui";
import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { CalendarTypes } from "../../../core/constants/calendar";
import { SystemSettingsState } from "../../../core/state/system";
import EthiopianPeriodDimension from "./Components/EthiopianPeriodDimension";

export default function PeriodSelectorModal({
  initialValue,
  onSelect,
  onClose,
}:any):React.ReactElement {
  const [value, setValue] = useState(initialValue ?? { periods: [] });
  const { calendar } = useRecoilValue(SystemSettingsState) ?? {};
  const onPeriodSelect = (value:any) => {
    setValue((prevValue:any) => ({
      ...prevValue,
      periods: value?.items,
    }));
  };
  const onUpdateClick = () => {
    onSelect(value);
    onClose();
  };

  return (
    <Modal large onClose={onClose}>
      <ModalTitle>Select Period(s)</ModalTitle>
      <ModalContent>
        <div className="row center align-items-center">
          {calendar === CalendarTypes.ETHIOPIAN ? (
            <EthiopianPeriodDimension
              onSelect={onPeriodSelect}
              selectedPeriods={value?.periods ?? []}
            />
          ) : (
            <PeriodDimension
              onSelect={onPeriodSelect}
              selectedPeriods={value?.periods ?? []}
            />
          )}
        </div>
      </ModalContent>
      <ModalActions>
        <ButtonStrip>
          <Button onClick={onClose}>Cancel</Button>
          <Button primary onClick={onUpdateClick}>
            Update
          </Button>
        </ButtonStrip>
      </ModalActions>
    </Modal>
  );
}
