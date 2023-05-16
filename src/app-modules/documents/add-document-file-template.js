import { Error } from "@progress/kendo-react-labels";
import { useEffect, useRef, useState } from "react";
import { TemplateFile1 } from "./file-template/templateFile1";
import { TemplateFile2 } from "./file-template/templateFile2";

export function AddDocumentFileTemplate({
    name,
    controlErrors,
    showValidationError,
    focusEnable,
    setHtmlFileValidationError,
}) {

    const itemsRef = useRef([])
    const [errorList, setErrorList] = useState([])

    useEffect(() => {
        const handleChange = (_) => {
            setHtmlFileValidationError()
        };

        const formEl = document.getElementById(name);
        formEl?.addEventListener("change", handleChange);

        return () => {
            formEl?.removeEventListener("change", handleChange);
        };
    }, []);

    useEffect(() => {
        let errorList = !showValidationError || !controlErrors || controlErrors.length < 1 ? [] : controlErrors
        setErrorList(errorList)
    }, [showValidationError, controlErrors])

    useEffect(() => {
        if (focusEnable && errorList && errorList.length > 0) {
            const uniqueIndex = errorList[0].id
            if (itemsRef.current && itemsRef.current[uniqueIndex] && itemsRef.current[uniqueIndex].focus) {
                itemsRef.current[uniqueIndex].focus()
            }
        }
    }, [errorList, focusEnable])

    function showErrorFor(id) {
        if (!errorList) return <></>
        const error = errorList.find(error => error.id == id);
        if (!error) return <></>
        return <Error>{error.msg}</Error>
    }

    switch (name) {

        case "templateFile1":
            return <TemplateFile1 itemsRef={itemsRef} showErrorFor={showErrorFor} />

        case "templateFile2":
            return <TemplateFile2 itemsRef={itemsRef} showErrorFor={showErrorFor} />
    }
}