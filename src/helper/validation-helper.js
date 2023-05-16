import { useCallback } from "react";
import DateTimeHelper from "./date-time-helper";
import { some } from "lodash";
const ValidationHelper = (props) => {
    const hasError = (errors) => {
        return some(errors, function (x) {
            if (x) return true; return false;
        })
    };
    const reduceErrors = useCallback(
        (arrErrors) => (arrErrors.filter(Boolean).reduce((current, acc) => current || acc, "")),
        []
    );
    const requiredValidator = useCallback(
        (value, fieldTitle) => {
            if (Array.isArray(value))
                return (value && value.length > 0 ? undefined : `${fieldTitle} is  required`)
            else if (typeof (value) != "string")
                return (!value ? `${fieldTitle} is required` : undefined)
            else {
                if (!value) {
                    return `${fieldTitle} is required`;
                }
                else if (value) {
                    value = value.trim();
                    if (value === "")
                        return `${fieldTitle} is required`;
                }
                return undefined;
            }
        },
        []
    );
    const startDateLessThanEndDateValidator = useCallback(
        (start, end, startLabel, endLabel) => {
            if (start && end && DateTimeHelper.isStartDateGreaterThanEndDate(start, end)) {
                return `${startLabel} must be before ${endLabel}`;
            }
            return "";
        },
        []
    );
    const startDateGreaterThanValidator = useCallback(
        (start, end, startLabel, endLabel) => {
            if (start && end && DateTimeHelper.isStartDateGreaterThanEndDate(start, end)) {
                return `${startLabel} should be greater than in compare of ${endLabel}`;
            }
            return "";
        },
        []
    );
    return { reduceErrors, requiredValidator, startDateLessThanEndDateValidator, hasError, startDateGreaterThanValidator };
};

export default ValidationHelper;