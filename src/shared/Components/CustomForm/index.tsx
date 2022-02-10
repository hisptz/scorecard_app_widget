import { ReactFinalForm } from "@dhis2/ui";
import { map } from "lodash";
import React from "react";
import CustomField from "./components/CustomField";

const { Form, FormSpy } = ReactFinalForm;
export default function CustomForm({
  onSubmit,
  fields,
  formReference,
  initialValues,
  onChange,
}:any):React.ReactElement {
  return (
    <Form onSubmit={onSubmit} initialValues={initialValues}>
      {({ handleSubmit }:any) => (
        <form ref={formReference} onSubmit={handleSubmit}>
          <FormSpy onChange={onChange} />
          {map(fields, (field:any) => (
            <CustomField key={field?.id} field={field} />
          ))}
        </form>
      )}
    </Form>
  );
}

