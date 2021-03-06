  jsonCountryString  = document.getElementsByClassName("json_country");
  jsonCountry = eval(jsonCountryString[0].innerText);
  jsonCurrencyString  = document.getElementsByClassName("json_currency");
  jsonCurrency = eval(jsonCurrencyString[0].innerText);
  jsonStolenFromString  = document.getElementsByClassName("json_stolen_from");
  jsonStolenFrom = eval(jsonStolenFromString[0].innerText);	
  jsonAgencyString  = document.getElementsByClassName("json_agency");
  jsonAgency = eval(jsonAgencyString[0].innerText);
  jsonAccountsString  = document.getElementsByClassName("json_accounts");
  jsonAccounts = eval(jsonAccountsString[0].innerText);

const numberRegex = /\d|[.,]/g;
let formData = new FormData();

$(document).on("click", ".result-table .remove-file-table", function () {
  if ($(".result-table-accounts .accounts-item").length > 2) {
    $(this).closest(".accounts-item").remove();
  } else {
    $(this).closest(".result-table-wrap").parent().find("input").val("");
    $(this)
      .closest(".result-table-wrap")
      .parent()
      .find("input:checked")
      .prop("checked", false);
    $(".result-table-accounts .result-table-wrap").remove();
  }
});



let error = false;
let errorProhibitedSymbol = false;
let tableAmountIndex = 1;
let tableAccountIndex = 1;
let tableAgenciesIndex = 1;
let countryOption;
const formReportSimCrime = $(".custom-form");
$(".field-hidden").attr("style", "");
$(".field-agency").attr("style", "");
$(".result-table").css("display", "none");
$(".result-table-multiple").css("display", "none");
$(".result-table-accounts").css("display", "none");
$(".result-table-agencies").css("display", "none");

function matchProhibitedSymbols(input) {
  const inputValue = input.val();
  const prohibitedSymbols = /[\"\{\}\[\]\|\\`\^]/g;
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

$('.field-agencies select[name="agency"]').each(function () {
  let newAgencyOption;
  for (let i = 0; i < jsonAgency.length; i++) {
    newAgencyOption = new Option(
        jsonAgency[i].value,
        jsonAgency[i].value,
        false,
        false
    );
    $(this).append(newAgencyOption).trigger("change");
  }
});

$('.field select[name="account"]').each(function () {
  let newAccountOption;
  for (let i = 0; i < jsonAccounts.length; i++) {
    newAccountOption = new Option(
        jsonAccounts[i].value,
        jsonAccounts[i].value,
        false,
        false
    );
    $(this).append(newAccountOption).trigger("change");
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

$(".field-checkbox [data-bind]").on("change keyup", function () {
  formReportSimCrime.find(".btn-submit").removeClass("error-form");
  formReportSimCrime.find(".btn-submit").prop("disabled", false);
  $(".next-inner-form-disabled").removeClass("error-form");
  let bind = $(this).data("bind");
  let value = $(this).parent().find(".text").text();

  if ($(this).prop("checked")) {
    value = value;
    updateCheckboxItem(bind, value);
    $(`[data-key=${bind}]`).fadeIn();
  } else {
    value = "";
    updateCheckboxItem(bind, value);
    $(`[data-key=${bind}]`).fadeOut();
  }
});


$(".field-general [data-bind]").on("change keyup", function () {
  formReportSimCrime.find(".btn-submit").removeClass("error-form");
  formReportSimCrime.find(".btn-submit").prop("disabled", false);
  $(".next-inner-form-disabled").removeClass("error-form");
  country_set = true;
  carrier_set = true;
  error = false;
  $(this).closest(".field").removeClass("error");
  const bind = $(this).data("bind");
  const value = $(this).val();

  if (bind === "Money Stolen") {
    value === "YES"
      ? $(".total-amount").css("display", "block")
      : $(".total-amount").attr("style", "");
  }
  
  if (bind === "detail-amounts") {
    value === "Add Amount Details"
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
    $('.next-inner-form.slick-arrow').removeClass("btn-disabled");
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
  $(`[data-update=${bind}]`).closest($(".result-table")).attr("style", "");	
  $(`[data-update=${bind.replace(/\s/g,'-')}]`).text(value);
}


function updateCountryItem(bind, value) {
  $(`[data-update=${bind.replace(/\s/g,'-')}]`).closest($(".result-table")).attr("style", "");
  $(`[data-key=${bind.replace(/\s/g,'-')}]`).text(bind);
  
  if(bind === 'Total Amount Stolen') {
  $(`[data-update=${bind.replace(/\s/g,'-')}]`).text("$" + formatNumber(value));
  }
  else {
  $(`[data-update=${bind.replace(/\s/g,'-')}]`).text(value);
  }
  
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
  $(".next-inner-form-disabled").removeClass("error-form");
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


$(".field-wrap-accounts [data-bind]").on("change keyup", function () {
  formReportSimCrime.find(".btn-submit").removeClass("error-form");
  formReportSimCrime.find(".btn-submit").prop("disabled", false);
  $(".next-inner-form-disabled").removeClass("error-form");
  country_set = true;
  carrier_set = true;
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

$(".field-hidden .btn-add").on("click", function (e) {
  e.preventDefault();
  $(".field-hidden:not(.field-radio) [data-bind]").val("");
  $('input[name="accessed-additional"]').prop("checked", false);
  $('input[name="accessed-additional"]').siblings(".w-form-formradioinput").removeClass("w--redirected-checked")
  setTimeout(() => {
    $('select[data-bind="stolen-from"]').val(null).trigger("change");
    $('select[name="amount"]')
      .val('')
      .trigger("change");
  }, 50);

  tableAmountIndex++;
  tableAccountIndex++;

});

$(".field-wrap-accounts .btn-add").on("click", function (e) {
  e.preventDefault();
  $('[data-bind="accessed"]').prop("checked", false);
  $('input[name="accessed"]').siblings(".w-form-formradioinput").removeClass("w--redirected-checked")
  setTimeout(() => {
    $('.field-wrap-accounts [data-bind="account"]').val("").trigger("change");
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

$(".result-table-multiple").on("click", ".remove-item", function () {
  const accountsBind =  $('.result-table-accounts').find('[data-update="stolen-from"]');
  const amountsBind =  $(this).closest(".input-stolen-wrapper").find('[data-update="stolen-from"]').text();

    accountsBind.each(function() {
      if($(this).text() === amountsBind) {
        $(this).parent().find(".remove-item").trigger("click");
      }
    });

  $(this).closest(".input-stolen-wrapper").remove();
  let i = 1;

  let tables = document.querySelectorAll(
    ".result-table-multiple .input-stolen-wrapper.data"
  );
  for (i = 0; i < tables.length; i++) {
      tables[i].setAttribute("id", `row-${i + 1}`);
      tables[i].querySelector(".table-num").textContent = i + 1;
  }

  tableAmountIndex = i;

  if(tableAmountIndex === 0) {
    tableAmountIndex++;
     $(".field-hidden:not(.field-radio) [data-bind]").val("");
     $('input[name="accessed-additional"]').prop("checked", false);
     $('input[name="accessed-additional"]').siblings(".w-form-formradioinput").removeClass("w--redirected-checked")
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

$(".result-table-accounts").on("click", ".remove-item", function () {
  $(this).closest(".accounts-item.data").remove();
  let i = 1;
  const trs = document.querySelectorAll(".result-table-accounts .accounts-item.data");

  for (i = 0; i < trs.length; i++) {
    trs[i].setAttribute("id", `item-${i + 1}`);
    trs[i].querySelector(".row").textContent = i + 1;
  }
  tableAccountIndex = i;

  if(tableAccountIndex === 0) {
    tableAccountIndex++
     $('[data-bind="accessed"]').prop("checked", false);
     $('.field-wrap-accounts [data-bind="account"]').val("");
  }

    trs.length
        ? $(".result-table-accounts").attr("style", "")
        : $(".result-table-accounts").css("display", "none");
});


$(".result-table-agencies").on("click", ".remove-item", function () {
  $(this).closest(".agencies-item.data").remove();
  let i = 1;
  const trs = document.querySelectorAll(".result-table-agencies .agencies-item.data");

  for (i = 0; i < trs.length; i++) {
    trs[i].setAttribute("id", `agencyItem-${i + 1}`);
    trs[i].querySelector(".row").textContent = i + 1;
  }
  tableAgenciesIndex = i;

  if(tableAgenciesIndex === 0) {
    tableAgenciesIndex++
    $('.field-agency [data-bind="Agency Reported To"]').val("");
  }

  trs.length
      ? $(".result-table-agencies").attr("style", "")
      : $(".result-table-agencies").css("display", "none");
});

function createAmountTableItem() {
  $(".result-table-multiple .multiple").append(`
  
  <div class="input-stolen-wrapper data" id="row-${tableAmountIndex}">
	  <div class="table-num row">${tableAmountIndex}</div>
	  <div data-update='stolen-from' class="table-stolen"></div>
	  <div data-update='stolen-amount' class="table-amount"></div>
	  <div data-update='currency' class="table-currency"></div>
	  <div data-update='accessed-additional' class="hide"></div>
	  
	  <div class="remove-file remove-item table-remove remove-btn">
		  <div class="remove-line opposite"></div>
		  <div class="remove-line"></div>
	  </div>
	  
	  <div></div>
	  <div class="additional-wrapper">
		  <div data-key='crypto' class="table-crypto-key"></div>
		  <div data-update='crypto' class="table-crypto-update"></div>
	  </div>
  </div>`);

}

function createAccountTableItem() {
  $(".result-table-accounts .multiple").append(`
	<div id="item-${tableAccountIndex}" class="accounts-item data">
	<div class="row">${tableAccountIndex}</div>
	<div data-update='account' class='account'></div>
	<div data-update='accessed' class="table-accessed"></div>
	  
	  <div class="remove-file remove-item remove-btn">
		  <div class="remove-line opposite"></div>
		  <div class="remove-line"></div>
	  </div>
	</div>
	
	`);
}

function createAgenciesTableItem() {
  $(".result-table-agencies .multiple").append(`
	<div id="agencyItem-${tableAgenciesIndex}" class="agencies-item data">
	   <div class="row">${tableAgenciesIndex}</div>
	   <div data-update='Agency-Reported-To' class="agency"></div>
	<div class="remove-file remove-item remove-btn">
		<div class="remove-line opposite"></div>
		<div class="remove-line"></div>
	</div>
</div>
	`);
}

function createAccountTableSpecialItem() {
  $(".result-table-accounts .multiple").append(`	
	<div id="item-${tableAccountIndex}" class="accounts-item data">
	<div class="row">${tableAccountIndex}</div>
	<div data-update='Carrier' class='account'></div>
	<div data-update='accessed' class="table-accessed">Lost control</div>
	  
	  <div class="remove-file remove-item remove-btn" style="visibility: hidden;
    z-index: -99">
		  <div class="remove-line opposite"></div>
		  <div class="remove-line"></div>
	  </div>
	</div>
	`);
}
function createAccountTableItemFromAmounts() {
  $(".result-table-accounts .multiple").append(`
	<div id="item-${tableAccountIndex}" class="accounts-item data">
	<div class="row">${tableAccountIndex}</div>
	<div data-update='stolen-from' class='account'></div>
	<div data-update='accessed-additional' class="table-accessed"></div>
	  
	  <div class="remove-file remove-item remove-btn" style="visibility: hidden;
    z-index: -99">
		  <div class="remove-line opposite"></div>
		  <div class="remove-line"></div>
	  </div>
	</div>
	`);
}

$(".next-inner-form-disabled").on("click", function (e) {

  const $that = $(this);
  var form = $(this).closest("form");
  var inputsRequired = form.find("[required]");
  var currentSlide = $('.custom-form').slick('slickCurrentSlide');
  form.find(".field").removeClass("error");
  
  inputsRequired.each(function () {
    if (currentSlide === 1) {
	    if (!$('select[name="country"]').val() || $('select[name="country"]').val() === 0) {
	      $('select[name="country"]').closest(".field").addClass("error");
	      error = true;
	      country_set = false;
	    }
    
	    if (!$('select[name="carrier"]').val() || $('select[name="carrier"]').val() === 0) {
	      $('select[name="carrier"]').closest(".field").addClass("error");
	      error = true;
	      carrier_set = false;
	    }
	    
	    if (country_set && carrier_set) {
	      $(".custom-form").slick('slickNext');
	    }
	}
	
	if (currentSlide === 2) {
		if ($('input[name="was-stolen"]:checked').length === 0) {
         $('input[name="was-stolen"]').closest(".field").addClass("error");
         error = true;
		}
		else {
		  $(".custom-form").slick('slickNext');
		}
	
	}
    });

  if (error) {
    $that.addClass("error-form");
    $('.next-inner-form.slick-arrow').addClass("btn-disabled");   
  }

});

$(".btn-submit").on("click", function (e) {
  const $that = $(this);
  var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  var form = $(this).closest("form");
  var inputsRequired = form.find("[required]");
  const textInputs = form.find('input[type="text"], input[type="number"]');
  let errorEmail = false;
  let errorInput;
  form.find(".field").removeClass("error");

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

$(".custom-form").on("submit", function (e) {
  const $this = this;
  $(".field-hidden").css("display", "block");

  var _this = $(this);
  e.preventDefault();

  $(this)
    .find(
      ".field:not(.field-carrier):not(.field-add-files):not(.field-checkbox):not(.field-radio):not(.field-hidden):not(.fields-account .field):not(.field-agency)"
    )
    .each(function () {
      let el = $(this).find("input, textarea, select")[0];
      let name = el.getAttribute("name") || el.getAttribute("data-bind");
      let value = el.value;
      formData.append(name, value);
    });

  if ($(this).find(".field-hidden")) {
    let tableArray = [];

    $(this)
      .find(".result-table-multiple .input-stolen-wrapper.data")
      .each(function () {
        let itemObject = {};
        $(this)
          .find("[data-update]")
          .each(function () {
            let el = $(this);
            let name = el.attr("data-update");

            if (name === "accessed-additional") {
              name = 'accessed'
            }

            let value = el.text();
            itemObject[name] = value;
          });
        tableArray.push(itemObject);
      });
    formData.append("amounts", JSON.stringify(tableArray));
  }

  if ($(this).find(".field-wrap-accounts .field")) {
    let tableArray = [];

    $(this)
      .find(".result-table-accounts .accounts-item.data")
      .each(function () {
        let itemObject = {};
        $(this)
          .find("[data-update]")
          .each(function () {
            let el = $(this);
            let name = el.attr("data-update");

            if(name === "account" || name === "stolen-from" || name === "Carrier"){
              name = 'account';
            }

            if(name === "accessed" || name === "accessed-additional"){
              name = 'accessed';
            }

            let value = el.text();
            itemObject[name] = value;
          });
        tableArray.push(itemObject);
      });
    formData.append("accounts", JSON.stringify(tableArray));
  }

  if ($(this).find(".field-agency")) {
    let tableArray = [];

    $(this)
        .find(".result-table-agencies .agencies-item.data")
        .each(function () {
          let itemObject = {};
          $(this)
              .find("[data-update]")
              .each(function () {
                let el = $(this);
                let name = 'agency';
                let value = el.text();
                itemObject[name] = value;
              });
          tableArray.push(itemObject);
        });
    formData.append("agencies", JSON.stringify(tableArray));
  }

  if($(this).find(".field-carrier")) {
    let el = $(".field-carrier select");
    let name = el.attr("name");
    let value;
    if(el.next().find('.select2-selection__rendered').attr('title') !== 'Type to search') {
      value = el.val();
    } else {
      value = '';
    }
      formData.append(name, value);
  }

  if ($(this).find(".field-general.field-radio").length) {
    let radioFields = $(this).find(".field-general.field-radio .radio-inputs, .field-general .field-radio .radio-inputs");
    radioFields.each(function () {
      let labels = $(this).find("label");
      labels.each(function () {
        if ($(this).find("input").prop("checked")) {
          let name = $(this).find("input").attr("name");
          let value = $(this).find("input").val();
          formData.append(name, value);
        }
      });
    });
  }

  if ($(this).find(".field-reported.field-radio").length) {
    let radioFields = $(this).find(".field-reported.field-radio .radio-inputs");
    radioFields.each(function () {
      let labels = $(this).find("label");
      labels.each(function () {
        if ($(this).find("input").prop("checked")) {
          let name = $(this).find("input").attr("name");
          let value = $(this).find("input").val();
          formData.append(name, value);
        }
      });
    });
  }

  if ($(this).find(".field-checkbox").length) {
    let checkboxesFields = $(this).find(".field-checkbox");
    checkboxesFields.each(function () {
      let labels = $(this).find("label");
      let name = $(this).find("input").attr("name");
      let values = [];
      labels.each(function () {
        if ($(this).find("input").prop("checked")) {
          let value = $(this).find("input").val();
          values.push(value);
        }
      });

      formData.append(name, values);
    });
  }

  new Response(formData).text().then(console.log);
  for(var pair of formData.entries()) {
//    $(".custom-form").append('<input type="text" type: "hidden" name="' + JSON.stringify(pair[0]) + '"value="' + JSON.stringify(pair[1]) + '">');
    console.log(pair[0]+ ', '+ pair[1]);
//   }
    $('<input>', {
		type: 'hidden',
		name: pair[0],
		value: pair[1]
    }).appendTo('.custom-form');
  }
  
});
