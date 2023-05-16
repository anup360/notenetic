
import $ from "jquery";

const TemplateValidator = () => {

  const inputValidator = () => {
    let message;
    $('.form-control-input').each(function () {
      if ($(this).prop('required')) {
        var currentVal = $(this).val().length;
        if (currentVal <= 0) {
          message = $(this).attr('textName');
        }
      }
    })
    return message;
  };

  const textAreaValidator = () => {
    let message;
    $('.form-control-textarea').each(function () {
      if ($(this).prop('required')) {
        var currentVal = $(this).val();
        // var current = currentVal.length;
        if (currentVal == "" || currentVal == null) {
          message = $(this).attr('textName'); 
        }
      }
    })
    return message;
  };

  return { inputValidator,textAreaValidator };
}

export default TemplateValidator;




