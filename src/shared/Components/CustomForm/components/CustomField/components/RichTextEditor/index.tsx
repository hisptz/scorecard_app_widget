import { Field } from "@dhis2/ui";
import JoditEditor from "jodit-react";
import React, { useRef } from "react";

export default function RichTextEditor({
  name,
  label,
  value,
  onChange,
  ...props
}:any):React.ReactElement {
  const editorRef = useRef(null);
  const config = {
    readonly: false,
    defaultFontSizePoints: "pt",
  };
  return (
    <Field name={name} label={label} value={value?.value} {...props}>
      <JoditEditor
        ref={editorRef}
        value={value}
        onBlur={(newValue) => onChange({ name, value: newValue })}
        config={config}
      />
    </Field>
  );
}

