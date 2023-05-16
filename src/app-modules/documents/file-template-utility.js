
import $ from 'jquery';
import moment from "moment";

function converFileTemplate(fieldsMapping, documentId, isDraft) {


  if (isDraft) {
    // for show only
    for (var i = 0; i < fieldsMapping.length; i++) {
      let type = $('input[name="' + fieldsMapping[i].keyName + '"]').attr('type')
      if (type == "checkbox" || type == "radio") {
        $('input[name="' + fieldsMapping[i].keyName + '"]').each(function () {
          if ($(this).val() == fieldsMapping[i].keyValue) {
            $(this).attr("checked", "checked")
          }
        })
      }
       else {
        var value = fieldsMapping[i].keyValue;
        var newValue = value.substr(0, 1).toUpperCase() + value.substr(1);
        $('.file-' + documentId + ' [name="' + fieldsMapping[i].keyName + '"]').val(newValue);
        $('.file-' + documentId + ' .' + fieldsMapping[i].keyName).html(newValue);
        $('[name="' + fieldsMapping[i].keyName + '"]').hide();
        $('.add-only').hide();
        $('.view-only').show();
      }
      $(".file-" + documentId + " input, .file-" + documentId + " textarea, .file-" + documentId + " select").attr('disabled', 'ture')
      $('.file-' + documentId + ' .' + fieldsMapping[i].keyName).parent(".form-group").find("label").addClass("lable-style")
    }
  } else {
    if (fieldsMapping && fieldsMapping.length > 0) {
      // for save only
      for (var i = 0; i < fieldsMapping.length; i++) {
        let type = $('input[name="' + fieldsMapping[i].keyName + '"]').attr('type')
        if (type == "checkbox" || type == "radio") {
          $('input[name="' + fieldsMapping[i].keyName + '"]').each(function () {
            if ($(this).val() == fieldsMapping[i].keyValue) {
              $(this).attr("checked", "checked")
            }
          })
        } else if(type == "date"){
          var now = new Date(fieldsMapping[i].keyValue);
          var day = ("0" + now.getDate()).slice(-2);
          var month = ("0" + (now.getMonth() + 1)).slice(-2);
          var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
            $('input[name="' + fieldsMapping[i].keyName + '"]').val(today)
        } 
        else {
          $('[name="' + fieldsMapping[i].keyName + '"]').val(fieldsMapping[i].keyValue)
          $('.view-only').hide();
          $('.add-only').show();
        }
      }
    }
  }
}

export function onShowFileTempFields(fieldsMapping, documentId, isDraft) {
  return converFileTemplate(fieldsMapping, documentId, isDraft)
}

export function onShowFileValidations(setControlErrors) {
  let check = 0;
  let radioCheck = 0;
  let name = [];
  let arryName = [];
  let errors = []

  $('.form-control-input').each(function () {
    if ($(this).prop('required')) {

      var currentVal = $(this).val().length;
      if (currentVal <= 0) {

        errors.push({
          id: $(this).attr('id'),
          name: $(this).attr('name'),
          required: true,
          msg: $(this).attr('msg')
        })
      }
    }
  })

  $('.form-control-textarea').each(function () {
    if ($(this).prop('required')) {

      var currentVal = $(this).val();
      if (currentVal == "" || currentVal == null) {

        errors.push({
          id: $(this).attr('id'),
          name: $(this).attr('name'),
          required: true,
          msg: $(this).attr('msg'),
        })
      }
    }
  })

  $('.form-control-select').each(function () {
    if ($(this).prop('required')) {

      var currentVal = $(this).find('option:selected').val();
      if (currentVal <= 0) {

        errors.push({
          id: $(this).attr('id'),
          name: $(this).attr('name'),
          required: true,
          msg: $(this).attr('msg'),
        })
      }
    }

  });

  $('.form-control-checkbox').each(function () {
    if ($(this).prop('required')) {

      let nameVal = ($(this).attr('name'));
      if ($.inArray(nameVal, name) == -1) {
        name.push(nameVal);

        $("input:checkbox[name='" + nameVal + "']").each(function () {
          if ($(this).prop('checked')) {
            check = 1;
          }
        })
        if (check != 1) {
          errors.push({
            id: $(this).attr('id'),
            name: $(this).attr('name'),
            required: true,
            msg: "please select " + nameVal
          })
        }
      }
    }
  })

  $('.form-control-radio').each(function () {
    if ($(this).prop('required')) {

      let nameVal = ($(this).attr('name'));
      if ($.inArray(nameVal, arryName) == -1) {
        arryName.push(nameVal);

        $("input:radio[name='" + nameVal + "']").each(function () {
          if ($(this).prop('checked')) {
            radioCheck = 1;
          }
        })
        if (radioCheck != 1) {
          errors.push({
            id: $(this).attr('id'),
            name: $(this).attr('name'),
            required: true,
            msg: "please select " + nameVal
          })
        }
      }
    }
  })

  // Sorting helps to know which element needs the focus first if they are not filled.
  errors.sort((a, b) => a.id - b.id)

  setControlErrors(errors)
  return errors
}
