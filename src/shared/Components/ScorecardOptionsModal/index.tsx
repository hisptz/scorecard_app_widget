import {
  Button,
  ButtonStrip,
  Modal,
  ModalActions,
  ModalContent,
  ModalTitle,
} from "@dhis2/ui";
import React, { useState } from "react";
import ScorecardOptions from "../../../core/models/scorecardOptions";
import ScorecardOptionsForm from "../ScorecardOptionsForm";

export default function ScorecardOptionsModal({
  onSelect,
  onClose,
  initialValues,
}:any):React.ReactElement {
  const [values, setValues] = useState(initialValues);

  const onChange = (key:any) => (newValue:any) => {
    setValues((prevState:any) => {
      return ScorecardOptions.set(
        prevState,
        key,
        newValue?.checked ?? newValue
      );
    });
  };

  const onUpdateClick = () => {
    onSelect(values);
    onClose();
  };

  return (
    <Modal onClose={onClose} large>
      <ModalTitle>Options</ModalTitle>
      <ModalContent>
        <div className="column">
          <ScorecardOptionsForm options={values} onChange={onChange} />
        </div>
      </ModalContent>
      <ModalActions>
        <ButtonStrip>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            dataTest={"update-button-on-options"}
            primary
            onClick={onUpdateClick}
          >
            Update
          </Button>
        </ButtonStrip>
      </ModalActions>
    </Modal>
  );
}

