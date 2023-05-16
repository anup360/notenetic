const getValue = (formProps, field) => {
    return formProps.valueGetter(field)
};

const setValue = (formProps, field, objectValues) => {
    formProps.onChange(field, objectValues);
};

const KendoFormHelper = { getValue, setValue };

export default KendoFormHelper;