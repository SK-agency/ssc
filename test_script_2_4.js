//Function for forbid select2 opening above
(function ($) {
  var Defaults = $.fn.select2.amd.require("select2/defaults");

  $.extend(Defaults.defaults, {
    dropdownPosition: "auto",
  });

  var AttachBody = $.fn.select2.amd.require("select2/dropdown/attachBody");

  var _positionDropdown = AttachBody.prototype._positionDropdown;

  AttachBody.prototype._positionDropdown = function () {
    var $window = $(window);

    var isCurrentlyAbove = this.$dropdown.hasClass("select2-dropdown--above");
    var isCurrentlyBelow = this.$dropdown.hasClass("select2-dropdown--below");

    var newDirection = null;

    var offset = this.$container.offset();

    offset.bottom = offset.top + this.$container.outerHeight(false);

    var container = {
      height: this.$container.outerHeight(false),
    };

    container.top = offset.top;
    container.bottom = offset.top + container.height;

    var dropdown = {
      height: this.$dropdown.outerHeight(false),
    };

    var viewport = {
      top: $window.scrollTop(),
      bottom: $window.scrollTop() + $window.height(),
    };

    var enoughRoomAbove = viewport.top < offset.top - dropdown.height;
    var enoughRoomBelow = viewport.bottom > offset.bottom + dropdown.height;

    var css = {
      left: offset.left,
      top: container.bottom,
    };

    // Determine what the parent element is to use for calciulating the offset
    var $offsetParent = this.$dropdownParent;

    // For statically positoned elements, we need to get the element
    // that is determining the offset
    if ($offsetParent.css("position") === "static") {
      $offsetParent = $offsetParent.offsetParent();
    }

    var parentOffset = $offsetParent.offset();

    css.top -= parentOffset.top;
    css.left -= parentOffset.left;

    var dropdownPositionOption = this.options.get("dropdownPosition");

    if (
      dropdownPositionOption === "above" ||
      dropdownPositionOption === "below"
    ) {
      newDirection = dropdownPositionOption;
    } else {
      if (!isCurrentlyAbove && !isCurrentlyBelow) {
        newDirection = "below";
      }

      if (!enoughRoomBelow && enoughRoomAbove && !isCurrentlyAbove) {
        newDirection = "above";
      } else if (!enoughRoomAbove && enoughRoomBelow && isCurrentlyAbove) {
        newDirection = "below";
      }
    }

    if (
      newDirection == "above" ||
      (isCurrentlyAbove && newDirection !== "below")
    ) {
      css.top = container.top - parentOffset.top - dropdown.height;
    }

    if (newDirection != null) {
      this.$dropdown
        .removeClass("select2-dropdown--below select2-dropdown--above")
        .addClass("select2-dropdown--" + newDirection);
      this.$container
        .removeClass("select2-container--below select2-container--above")
        .addClass("select2-container--" + newDirection);
      if (this.$dropdown.find('.input-label-report').length === 0) {
          this.$dropdown.append(this.$container.siblings(".input-label-report").clone())
	  }
    }

    this.$dropdownContainer.css(css);
  };
})(window.jQuery);

$(document).ready(function () {

  let selectElements = $("select.js-example-basic-single");
  for (var i = 0; i < selectElements.length; i++) {
    const $select = $(selectElements[i]);

    //let placeholder = "Type to search";
    let placeholder = $select.attr('placeholder') || "Type to search";

    $select.select2({
      allowClear: false,
      placeholder: placeholder,
      minimumResultsForSearch: 0,
      minimumInputLength: 1,
      dropdownPosition: "below",
      tags: true,
      sorter: (data) => data.sort((a, b) => a.text.localeCompare(b.text)),
    });

    // Trigger focus
    $select.on("click", function (e) {
      $(this).trigger("focus").select2("focus");
    });

    // Trigger search
    $select.on("keydown", function (e) {
      let $select = $(this);
      let $select2 = $select.data("select2");
      let $container = $select2.$container;

      // Unprintable keys
      if (
        typeof e.which === "undefined" ||
        $.inArray(e.which, [
          0,
          8,
          9,
          12,
          16,
          17,
          18,
          19,
          20,
          27,
          33,
          34,
          35,
          36,
          37,
          38,
          39,
          44,
          45,
          46,
          91,
          92,
          93,
          112,
          113,
          114,
          115,
          116,
          117,
          118,
          119,
          120,
          121,
          123,
          124,
          144,
          145,
          224,
          225,
          57392,
          63289,
        ]) >= 0
      ) {
        return true;
      }

      // Opened dropdown
      if ($container.hasClass("select2-container--open")) {
        return true;
      }

      $select.select2("open");

      // Default search value
      let $search = $select2.dropdown.$search || $select2.selection.$search,
        query =
          $.inArray(e.which, [13, 40, 108]) < 0
            ? String.fromCharCode(e.which)
            : "";
      if (query !== "") {
        $search.val(query).trigger("keyup");
      }
    });

    // Format, placeholder
    $select.on("select2:open", function (e) {
      var $select = $(this),
        $select2 = $select.data("select2"),
        $search = $select2.dropdown.$search || $select2.selection.$search,
        data = $select.select2("data");

      $select2.dropdown.$dropdown.find('.select2-results').removeClass('padding-bottom');

      // Placeholder
      $search.attr(
        "placeholder",
        data[0].text !== "" ? data[0].text : $select.placeholder
      );


      $search.on("input", function () {
        const searchInput = $(this);
        const optionsObject = $select.find("option");
        let optionsArray = [];

        searchInput.val() !== "" ?
        $select2.dropdown.$dropdown.find('.select2-results').addClass('padding-bottom') :
            $select2.dropdown.$dropdown.find('.select2-results').removeClass('padding-bottom');

        for (let i = 0; i < optionsObject.length; i++) {
          optionsArray.push(optionsObject[i]);
        }

        let index = optionsArray.length;
        const lastOption = optionsArray[index - 1];

        if (lastOption.value == searchInput.val()) {
          searchInput
            .closest(".select2-container")
            .find(
              `.select2-results__options li:contains("${lastOption.value}")`
            )
            .filter(function () {
              return $(this).text() === lastOption.value;
            })
            .addClass("custom");

          const currentOptionValue =  searchInput
              .closest(".select2-container")
              .find(
                  `.select2-results__options li:contains("${lastOption.value}")`
              )
              .filter(function () {
                return $(this).text() === lastOption.value;
              }).text();

          searchInput
              .closest(".select2-container")
              .find(
                  `.select2-results__options li:contains("${lastOption.value}")`
              )
              .filter(function () {
                return $(this).text() === lastOption.value;
              }).text(`Not listed? Add manually "${currentOptionValue}"`);
        }
      });
    });
  }

});

let dropArea = document.getElementById("drop-area");
let droppedFile;
const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif|\.bmp|\.tex|\.xls|\.xlsx|\.doc|\.docx|\.odt|\.txt|\.pdf|\.pptx|\.ppt|\.rtf)$/i;
const numberRegex = /\d|[.,]/g;
let formData = new FormData();

$(".field-add-files").each(function () {
  const mainWrapper = $(this);

  // Prevent default drag behaviors
  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    dropArea.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
  });

  // Handle dropped files
  dropArea.addEventListener("drop", handleDrop, false);

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }


  function handleDrop(e) {
    var dt = e.dataTransfer;
    const droppedFiles = dt.files;

    handleFiles(droppedFiles);
  }

  function handleFiles(files) {
    files = [...files];
    previewFile(files);

    let file;
    for (let i = 0; i < droppedFile.length; i++) {
      file = droppedFile[i];
        formData.append("files[]", file);

    }
  }

  function previewFile(files) {
    droppedFile = files;
    for (let i = 0; i < files.length; i++) {
      let file = files[i];

      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        mainWrapper.find(".add-files").removeClass("not-allowed");
        if (
          file.size <=
          parseInt(mainWrapper.find(".add-files").data("max-size"), 10)
        ) {
          if (allowedExtensions.exec(files[i].name)) {
            mainWrapper.removeClass("error");
            listNode = document.createElement("LI");
            listNode.innerHTML =
              `<span class="icon"></span><span class="file-name">` +
              file.name +
              `</span><span class="remove-file"></span>`;
            mainWrapper
              .closest(".form-block")
              .find(".list-files")
              .append(listNode);
            mainWrapper.find("label").append(`<div id="progress-bar"></div>`);
            mainWrapper.find("#progress-bar").css("width", "96%");
            setTimeout(function () {
              mainWrapper.find("#progress-bar").remove();
              mainWrapper.find("#progress-bar").attr("style", "");
            }, 1500);
          } else {
            mainWrapper
              .find(".size")
              .removeClass("hidden")
              .siblings()
              .addClass("hidden");
            mainWrapper.find(".add-files").addClass("not-allowed");
          }
        } else {
          mainWrapper
            .find(".size")
            .removeClass("hidden")
            .siblings()
            .addClass("hidden");
          mainWrapper.addClass("error");
        }
      };
    }
  }

  mainWrapper.find(".input-file").on("change", function (e) {
    $(this).closest(".field").removeClass("error");
    mainWrapper.find(".add-files").removeClass("not-allowed");
    var files = $(this).get(0).files;
    let listNode;

    for (var i = 0; i < files.length; i++) {
      console.log(files[i].size);
      if (
        files[i].size <=
        parseInt(mainWrapper.find(".add-files").data("max-size"), 10)
      ) {
        if (allowedExtensions.exec(files[i].name)) {
          listNode = document.createElement("LI");
          listNode.innerHTML =
            `<span class="icon"></span><span class="file-name">` +
            files[i].name +
            `</span><span class="remove-file"></span>`;
          mainWrapper.parent().parent().find(".list-files").append(listNode);
          mainWrapper.find("label").append(`<div id="progress-bar"></div>`);
          mainWrapper.find("#progress-bar").css("width", "96%");
          setTimeout(function () {
            mainWrapper.find("#progress-bar").remove();
            mainWrapper.find("#progress-bar").attr("style", "");
          }, 1500);

          formData.append("files[]", files[i]);

        } else {
          mainWrapper
            .find(".size")
            .removeClass("hidden")
            .siblings()
            .addClass("hidden");
          mainWrapper.find(".add-files").addClass("not-allowed");
        }
      } else {
        mainWrapper
          .find(".size")
          .removeClass("hidden")
          .siblings()
          .addClass("hidden");
        mainWrapper.addClass("error");
      }
    }
  });
});

let error = false;
let errorProhibitedSymbol = false;
let tableAmountIndex = 1;
let tableAccountIndex = 1;
let tableAgenciesIndex = 1;
let countryOption;
const formReportSimCrime = $(".report-sim-form");
$(".field-hidden").attr("style", "");
$(".result-table").css("display", "none");
$(".result-table-multiple").css("display", "none");

function matchProhibitedSymbols(input) {
  const inputValue = input.val();
  const prohibitedSymbols = /[\"\{\}\[\]\|\\\~`\^]/g;
  const match = inputValue.match(prohibitedSymbols);
  if (match) {
    input.closest("label").addClass("prohibited-symbols");
    errorProhibitedSymbol = true;
  } else {
    input.closest("label").removeClass("prohibited-symbols");
    errorProhibitedSymbol = false;
  }
}

if (document.querySelector("[type='number']")) {
  document.querySelector("[type='number']").addEventListener("keypress", function (evt) {
    if (evt.which != 8 && evt.which != 0 && evt.which < 48 || evt.which > 57)
    {
      evt.preventDefault();
    }
  });

}

$('.field-general select[data-bind="Country"]').each(function () {
  let newCountryOption;
  for (let i = 0; i < jsonCountry.length; i++) {
    newCountryOption = new Option(
      jsonCountry[i].value,
      jsonCountry[i].value,
      false,
      false
    );
    $(this).append(newCountryOption).trigger("change");
  }
});
$('.field select[name="amount"]').each(function () {
  let newCurrencyOption;
  for (let i = 0; i < jsonCurrency.length; i++) {
    newCurrencyOption = new Option(
        jsonCurrency[i].value,
        jsonCurrency[i].value,
      false,
      false
    );
    $(this).append(newCurrencyOption).trigger("change");
  }
});
$('.field select[name="stolen-from"]').each(function () {
  let newStolenOption;
  for (let i = 0; i < jsonStolenFrom.length; i++) {
    newStolenOption = new Option(
        jsonStolenFrom[i].value,
        jsonStolenFrom[i].value,
        false,
        false
    );
    $(this).append(newStolenOption).trigger("change");
  }
});

$(".field-general [data-bind]").on("change keyup", function () {
  formReportSimCrime.find(".btn-submit").removeClass("error-form");
  formReportSimCrime.find(".btn-submit").prop("disabled", false);
  error = false;
  $(this).closest(".field").removeClass("error");
  const bind = $(this).data("bind");
  const value = $(this).val();

  if (bind === "Money Stolen") {
    value === "YES"
      ? $(".field-hidden").css("display", "block")
      : $(".field-hidden").attr("style", "");
  }

  bind === "Country" ? (countryOption = $(this).val()) : "";
  updateCountryItem(bind, value);

  $(`[data-key=${bind.replace(/\s/g,'-')}]`) && (bind === "Country" || bind === "Carrier" || bind === "Agency Reported To")
    ? $(`[data-key=${bind.replace(/\s/g,'-')}]`).parent().addClass("show-line")
    : "";

  if (countryOption && bind === "Country") {
    $('select[name="carrier"]').empty();
    $('select[name="carrier"]').append(`<option></option>`);
    $('select[name="carrier"]').prop("disabled", false);
    $('select[name="carrier"]')
      .parent()
      .find(".title-field")
      .removeClass("disabled-label");

    let newCountryOptionObject;
    for (let i = 0; i < jsonCountry.length; i++) {
      newCountryOptionObject = jsonCountry[i];
      if (newCountryOptionObject.value === countryOption) {
        let newCarrierOptions = newCountryOptionObject.items;
        let newCarrierOption;
        for (let j = 0; j < newCarrierOptions.length; j++) {
          const newCarrierOptionObject = newCarrierOptions[j];
          newCarrierOption = new Option(
            newCarrierOptionObject.value,
            newCarrierOptionObject.value,
            false,
            false
          );
          $('select[name="carrier"]').append(newCarrierOption);
        }
      }
    }
  }

  if (
    bind === "Carrier"
  ) {
    $(".result-table-accounts").attr("style", "");

    if (
        $(`#item-${tableAccountIndex}`).has('[data-update="account"]').length !== 0 ||
        $(`#item-${tableAccountIndex}`).has('[data-update="stolen-from"]').length !== 0
    ) {
      tableAccountIndex++;
    }

    if ($(`#item-${tableAccountIndex}`).length !== 0) {
      updateAccountTableItem(bind, value);
    } else {
      createAccountTableSpecialItem();

      updateAccountTableItem(bind, value);
    }

  }

  matchProhibitedSymbols($(this));
});

function updateCheckboxItem(bind, value) {
  $(`[	=${bind}]`).closest($(".result-table")).attr("style", "");
  $(`[data-update=${bind.replace(/\s/g,'-')}]`).text(value);
  $(`[data-key=${bind.replace(/\s/g,'-')}]`).attr(
    "src",
    `https://stopsimcrime.org/wp-content/themes/stopsimcrime/img/${bind}.svg`
  );
}


function updateCountryItem(bind, value) {
  $(`[data-update=${bind.replace(/\s/g,'-')}]`).closest($(".result-table")).attr("style", "");
  $(`[data-key=${bind.replace(/\s/g,'-')}]`).text(bind);
  $(`[data-update=${bind.replace(/\s/g,'-')}]`).text(value);
}

function updateAmountTableItem(bind, value) {
  $($(`#row-${tableAmountIndex}  [data-key=${bind.replace(/\s/g,'-')}]`)).text(bind);
  $($(`#row-${tableAmountIndex}  [data-update=${bind.replace(/\s/g,'-')}]`)).text(value);

  if (bind === "stolen-amount") {
    updateAmountTableItem("currency", $('[name="amount"]').val());
  }
}


function updateAccountTableItem(bind, value) {
  $($(`#item-${tableAccountIndex}  [data-update=${bind.replace(/\s/g,'-')}]`)).text(value);
}

function updateAgenciesTableItem(bind, value) {
  $($(`#agencyItem-${tableAgenciesIndex}  [data-update=${bind.replace(/\s/g,'-')}]`)).text(value);
}

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

$(".field-hidden [data-bind]").on("change keyup", function (e) {
  formReportSimCrime.find(".btn-submit").removeClass("error-form");
  formReportSimCrime.find(".btn-submit").prop("disabled", false);
  const bind = $(this).data("bind");
  const value = $(this).val();
  $(".result-table-multiple").attr("style", "");

  if ($(`#row-${tableAmountIndex}`).length !== 0) {
    updateAmountTableItem(bind, value);
  } else {
    createAmountTableItem();

    updateAmountTableItem(bind, value);
  }

  if (bind === "stolen-from" || bind === "accessed-additional") {
    $(".result-table-accounts").attr("style", "");

    if (
        $(`#item-${tableAccountIndex}`).has('[data-update="account"]').length !== 0 ||
        $(`#item-${tableAccountIndex}`).has('[data-update="Carrier"]').length !== 0
    ) {
      tableAccountIndex++;
    }

    if ($(`#item-${tableAccountIndex}`).length !== 0) {
      updateAccountTableItem(bind, value);
    } else {
      createAccountTableItemFromAmounts();

      updateAccountTableItem(bind, value);
    }
  }

  if(bind === 'stolen-amount') {
    let formattedNumber = formatNumber($($(`#row-${tableAmountIndex}  [data-update=${bind.replace(/\s/g,'-')}]`)).text());
    $($(`#row-${tableAmountIndex}  [data-update=${bind.replace(/\s/g,'-')}]`)).text(formattedNumber);
  }
});
$(".fields-account [data-bind]").on("change keyup", function () {
  formReportSimCrime.find(".btn-submit").removeClass("error-form");
  formReportSimCrime.find(".btn-submit").prop("disabled", false);
  error = false;
  $(this).closest(".field").removeClass("error");
  const bind = $(this).data("bind");
  const value = $(this).val();
  $(".result-table-accounts").attr("style", "");

  if ($(`#item-${tableAccountIndex}`).has('[data-update="Carrier"]').length !== 0 ||
    $(`#item-${tableAccountIndex}`).has('[data-update="stolen-from"]')
      .length !== 0) {
    tableAccountIndex++;
  }

  if ($(`#item-${tableAccountIndex}`).length !== 0) {
    updateAccountTableItem(bind, value);
  } else {
    createAccountTableItem();

    updateAccountTableItem(bind, value);
  }
});
$(".field-agencies [data-bind]").on("change keyup", function () {
  const bind = $(this).data("bind");
  const value = $(this).val();

  if(bind !== 'was-reported') {
    $(".result-table-agencies").attr("style", "");

    if ($(`#agencyItem-${tableAgenciesIndex}`).length !== 0) {
      updateAgenciesTableItem(bind, value);
    } else {
      createAgenciesTableItem();

      updateAgenciesTableItem(bind, value);
    }
  } else {
    value === "Yes"
        ? $(".field-agency").css("display", "block")
        : $(".field-agency").attr("style", "");
  }
});

$(".field-hidden.btn-add").on("click", function (e) {
  e.preventDefault();
  $(".field-hidden:not(.field-radio) [data-bind]").val("");
  $('input[name="accessed-additional"]').prop("checked", false);
  setTimeout(() => {
    $('select[data-bind="stolen-from"]').val(null).trigger("change");
    $('select[name="amount"]')
      .val('')
      .trigger("change");
  }, 50);

  tableAmountIndex++;
  tableAccountIndex++;

});

$(".fields-account .btn-add").on("click", function (e) {
  e.preventDefault();
  $('[data-bind="accessed"]').prop("checked", false);
  setTimeout(() => {
    $('.fields-account [data-bind="account"]').val("").trigger("change");
  }, 50);

  //if(tableAccountIndex !== 1) {
    tableAccountIndex++;
  //}
});

$(".field-agencies .btn-add").on("click", function (e) {
  e.preventDefault();
  setTimeout(() => {
    $('.field-agency [name="agency"]').val(null).trigger("change");
  }, 50);

  //if(tableAccountIndex !== 1) {
  tableAgenciesIndex++;
  //}
});

$("table.result-table-multiple").on("click", "td.remove-item", function () {
  const accountsBind =  $('.result-table-accounts').find('[data-update="stolen-from"]');
  const amountsBind =  $(this).closest("tr.table-row-item").find('[data-update="stolen-from"]').text();

    accountsBind.each(function() {
      if($(this).text() === amountsBind) {
        $(this).parent().find(".remove-item").trigger("click");
      }
    });

  $(this).closest("tr.table-row-item").remove();
  let i = 1;

  let tables = document.querySelectorAll(
    ".result-table-multiple tr.table-row-item"
  );
  for (i = 0; i < tables.length; i++) {
      tables[i].setAttribute("id", `row-${i + 1}`);
      tables[i].querySelector(".row").textContent = i + 1;
  }

  tableAmountIndex = i;

  if(tableAmountIndex === 0) {
    tableAmountIndex++;
     $(".field-hidden:not(.field-radio) [data-bind]").val("");
     $('input[name="accessed-additional"]').prop("checked", false);
  //  setTimeout(() => {
      $('select[data-bind="stolen-from"]').val(null).trigger("change");
      $('select[name="amount"]')
          .val('').trigger("change");
   // }, 150);

  }

 // setTimeout(() => {
  tables.length
      ? $(".result-table-multiple").attr("style", "")
      : $(".result-table-multiple").css("display", "none");
  //}, 160)
});


function createAmountTableItem() {
  $(".result-table-multiple .multiple").append(`
  
  <div class="input-stolen-wrapper" id="row-${tableAmountIndex}">
  <div id="w-node-_79d40cca-7b7e-8d05-1d19-a2ef7a522391-ce03a58a" class="table-num">${tableAmountIndex}</div>
  <div data-key="Money-Stolen" class="table-stolen">stolen from</div>
  <div data-update="Money-Stolen" class="table-amount">amount</div>
  <div data-update="Money-Stolen" class="table-currency">currency</div>
  <div data-update="Money-Stolen" class="table-remove"></div>
	  <div id="w-node-_79d40cca-7b7e-8d05-1d19-a2ef7a52239a-ce03a58a">
	  <div class="table-crypto-key"></div>
	  <div class="table-crypto-update"></div>
	  </div>
  </div>`);
}


function createAccountTableSpecialItem() {
  $(".result-table-accounts tbody.multiple").append(`
	<tr id="item-${tableAccountIndex}" class="accounts-item">
			<td class="row">${tableAccountIndex}</td>
			<td data-update='Carrier'></td>
			<td data-update="accessed" class="table-accessed">Lost control</td>
			<td class="remove-file remove-item" style="visibility: hidden;
    z-index: -99"></td>
	</tr>
	`);
}
function createAccountTableItemFromAmounts() {
  $(".result-table-accounts tbody.multiple").append(`
	<tr id="item-${tableAccountIndex}" class="accounts-item">
			<td class="row">${tableAccountIndex}</td>
			<td data-update='stolen-from'></td>
			<td class="table-accessed" data-update='accessed-additional'></td>
			<td class="remove-file remove-item" style="visibility: hidden;
    z-index: -99"></td>
	</tr>
	`);
}


$(".btn-submit").on("click", function (e) {
  const $that = $(this);
  var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  var form = $(this).closest("form");
  var inputsRequired = form.find("[required]");
  const textInputs = form.find('input[type="text"], textarea, input[type="number"]');
  let errorEmail = false;
  let errorInput;
  form.find(".field").removeClass("error");

  // if ($(".g-recaptcha-response").length) {
  //   if (!$(".g-recaptcha-response").val()) {
  //     $(".g-recaptcha-response").closest(".field").addClass("error");
  //     error = true;
  //   }
  // }

  inputsRequired.each(function () {
    if (!$(this).val() || $(this).val() === 0) {
      $(this).closest(".field").addClass("error");
      error = true;
    }

    if ($('input[name="was-stolen"]:checked').length === 0) {
      $('input[name="was-stolen"]').closest(".field").addClass("error");
      error = true;
    }

    if ($(this).attr("type") === "email" && !emailRegex.test($(this).val())) {
      errorEmail = true;
    }
  });

  textInputs.each(function () {
    matchProhibitedSymbols($(this));
    if (errorProhibitedSymbol) {
      return (errorInput = true);
    }
  });

  if (error) {
    e.preventDefault();
    $that.addClass("error-form");
    $that.prop("disabled", true);
  }

  if (errorInput) {
    e.preventDefault();
    $that.addClass("error-form");
    $that.prop("disabled", true);
  }

  if (errorEmail) {
    setTimeout(function () {
      $that.addClass("error-form");
      $that.prop("disabled", true);
    }, 200);
  }
});
