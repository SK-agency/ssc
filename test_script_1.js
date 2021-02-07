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

  $(`[data-key=${bind}]`) && (bind === "Country" || bind === "Carrier" || bind === "Agency Reported To")
    ? $(`[data-key=${bind}]`).parent().addClass("show-line")
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

function updateCountryItem(bind, value) {
  $(`[data-update=${bind}]`).closest($(".result-table")).attr("style", "");
  $(`[data-key=${bind}]`).text(bind);
  $(`[data-update=${bind}]`).text(value);
}

function updateAccountTableItem(bind, value) {
  $($(`#item-${tableAccountIndex}  [data-update=${bind}]`)).text(value);
}

function updateAgenciesTableItem(bind, value) {
  $($(`#agencyItem-${tableAgenciesIndex}  [data-update=${bind}]`)).text(value);
}

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

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
const datepickerWidth = () => {
  const datepickerWidthNum = $(".datepicker-wrap").innerWidth();
  document.documentElement.style.setProperty(
    "--datepicker-width",
    `${datepickerWidthNum}px`
  );
};

datepickerWidth();
$(window).on("resize", datepickerWidth);

$(document).ready(function () {
  $(".datepicker").datepicker({
    dateFormat: "mm-dd-yy",
    duration: "fast",
    changeYear: true,
    changeMonth: true,
    dateFormat: "mm/dd/yy",
    gotoCurrent: true,
    maxDate: 1,
    beforeShow: function (input, inst) {
      setTimeout(function () {
        inst.dpDiv.css({
          top: $(".datepicker").offset().top + 35,
        });
      }, 0);
    },
    nextText: "",
    prevText: "",
  });

  $.datepicker.setDefaults({
    dayNamesMin: $.datepicker._defaults.dayNamesShort,
    monthNamesShort: $.datepicker._defaults.monthNames,
  });

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
