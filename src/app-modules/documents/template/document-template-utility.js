// Constant Variables
export const templateTypeInt = { assesment: 1, note: 2 };
export const templateTypeString = ["Assessment", "Document"];
export const templateControls = {
  paragraph: "Paragraph",
  textBox: "Text Box",
  textArea: "Text Area",
  // table: "Table",
  radio: "Radio Button",
  checkbox: "Checkbox",
  dropDown: "Drop Down List",
  signLine: "Signature Line",
  datePicker: "Date Picker",
  timePicker: "Time Picker",
  textEditor: "Text Editor",
  heading3: "Heading",
};

let availTemplateControl1 = [];
for (const item in templateControls) {
  availTemplateControl1.push(templateControls[item]);
}

export const availTemplateControls = availTemplateControl1;

export function mapDocumentTemplate(template) {
  const controlList =
    template.documentTemplatesFields || template.documentTemplatesFieldsDetails;

  return {
    id: template.id,
    name: template.templateName,
    type: template.templateTypeId,
    posType: template.posType,
    timeRecordingMethod: template.timeRecordingMethod,
    canAddNextAppt: template.canAddNextAppt,
    canApplyClientSig: template.canApplyClientSig,
    showClientProgress: template.showClientProgress,
    showTreatmentPlan: template.showTreatmentPlan,
    showSiteOfService: template.showSiteOfService,
    showServiceControl: template.showServiceControl,
    showFileAttachment:template.showFileAttachment,
    showVisitType:template.showVisitType,
    isHtmlFileTypeTemplate: template.isHtmlFileTypeTemplate,
    htmlFileName: template.htmlFileName,
    typeString: templateTypeString[template.templateTypeId - 1],
    controlListLength: controlList.length,
    templateTypeName: template.templateTypeName,
    isDefault:template.isDefault,
    templateTypeId:template.templateTypeId,
    templateName: template.templateName,
    showClientDiags: template.showClientDiags,
    timeRecordingMethodId:template.timeRecordingMethodId,
    posTypeId:template.posTypeId,
    controlList: controlList.map((control) => {
      return {
        id: control.htmlAttributePropertyName,
        title: control.displayLabel,
        type: control.htmlControlType,
        columnNumber: control.divideInColumns,
        minInputChar: control.minCharacters,
        maxInputChar: control.maxCharacters,
        sequenceNumber: control.sequenceNumber,
        isRequired: control.isRequired,
        isHeader: control.isHeader,
        text: control.textOrPlaceholder,
        textHtml: control.textHtml
          ? control.textHtml
          : `<p>${control.textOrPlaceholder}</p>`,
        itemList: !control.htmlControlHasMasterData
          ? []
          : control.htmlControlMasterData.map((x) => x.keyValue),
        row: 3, // TODO: Assisgn value from server
        hint: control.hint,
      };
    }),
  };
}
