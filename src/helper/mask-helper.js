

export const MaskFormatted = (value, mask) => {
  if (value) {
    const rules = ['0', '9', '#', '&', '?', 'A', 'C', 'L', 'a'];
    let tempValue = [...value];
    let maskedValue = '';
    for (var i = 0; i < mask.length; i++) {
      let currentRule = mask[i];
      if (rules.indexOf(mask[i]) >= 0) {
        let nextChar = tempValue.shift();
        maskedValue += nextChar ? nextChar : '';
      } else {
        maskedValue += currentRule;
      }
    }
    return maskedValue;
  };

}


