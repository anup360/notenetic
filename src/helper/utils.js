import filter from "lodash/filter"
import join from "lodash/join"

const rgba2hex = (rgbaColor, prefixHash) => {
    let a, isPercent,
        rgb = rgbaColor.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i),
        alpha = (rgb && rgb[4] || "").trim(),
        hex = rgb ?
            (rgb[1] | 1 << 8).toString(16).slice(1) +
            (rgb[2] | 1 << 8).toString(16).slice(1) +
            (rgb[3] | 1 << 8).toString(16).slice(1) : rgbaColor;

    return (prefixHash && prefixHash === true ? `#${hex}` : hex);
};
const splitReplaceRemoveJoinString = (arr, spliter, removeItem) => {
    return join(filter(arr.split(spliter), x => x != removeItem), spliter);
};
const Utils = { rgba2hex, splitReplaceRemoveJoinString };

export default Utils;