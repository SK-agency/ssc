country_result = document.getElementsByClassName('country-result')[0];
stolen_result = document.getElementsByClassName('was-stolen-result')[0];
hacked_accounts_result = document.getElementsByClassName('hacked-accounts-result')[0];
compromised_info_result = document.getElementsByClassName('compromised-info-result')[0];
additional_info_result = document.getElementsByClassName('additional-info-result')[0];
agencies_reported_result = document.getElementsByClassName('agencies-reported-result')[0];

country_result_inner = document.querySelectorAll('.result-table-country');
stolen_result_inner = document.querySelectorAll('.result-table-was-stolen');
hacked_accounts_inner = document.querySelectorAll('.result-table-hacked-accounts');
compromised_info_inner = document.querySelectorAll('.result-table-compromised-info');
additional_info_inner = document.querySelectorAll('.result-table-additional-info');
agencies_reported_info_inner = document.querySelectorAll('.result-table-agencies-reported');

country_review = document.getElementsByClassName('country-review')[0];
stolen_review = document.getElementsByClassName('stolen-review')[0];
hacked_accounts_review = document.getElementsByClassName('hacked-accounts-review')[0];
compromised_info_review = document.getElementsByClassName('compromised-info-review')[0];
additional_info_review = document.getElementsByClassName('additional-info-review')[0];
agencies_reported_review = document.getElementsByClassName('agencies-reported-review')[0];

function appendResults (start_wrapper, start_inner, goal_append) {
	if (start_wrapper.hasChildNodes()) {
	start_inner.forEach( function(move) {
	goal_append.appendChild(move);
	});
    }
}


function updateProgressBar (currentSlide) {
	
	if ($(window).width() < 768) {
		step_color_mob = "linear-gradient(210deg, #016eb8, #56b4f0)";
		$(".form-progress-green-line").css("background", step_color_mob);
	}
	else {
		step_color_mob = "#32d74b";
	}
	
  switch (currentSlide) {
  
  case 0:
    $(".form-progress-indicator.ss").css("background-color", "#dedede");
    if ($(window).width() < 768) {
    $(".form-progress-bar").css("display", "none");
    $(".form-h").css("display", "block");
    }
    break;  

  case 1:
    $(".form-progress-indicator.ss").css("background", step_color_mob);
    $(".form-progress-indicator.details").css("background-color", "#dedede");
    $(".form-progress-indicator.accounts").css("background-color", "#dedede");
    $(".form-progress-indicator.ai").css("background-color", "#dedede");
    $(".form-progress-indicator.review").css("background-color", "#dedede");
    $(".form-progress-green-line").animate({ width:'0%' });  
    if ($(window).width() < 768) {
    $(".form-progress-bar").css("display", "flex");
    $(".form-h").css("display", "none");
    }
    appendResults(country_review, country_result_inner, country_result);

    break;

  case 2:
    $(".form-progress-indicator.details").css("background", step_color_mob);
    $(".form-progress-indicator.accounts").css("background-color", "#dedede");
    $(".form-progress-indicator.ai").css("background-color", "#dedede");
    $(".form-progress-indicator.review").css("background-color", "#dedede");
    $(".form-progress-green-line").animate({ width:'20%' }); 
    appendResults(stolen_review, stolen_result_inner, stolen_result);
    break;

  case 3:
    $(".form-progress-indicator.accounts").css("background", step_color_mob);
    $(".form-progress-indicator.ai").css("background-color", "#dedede");
    $(".form-progress-indicator.review").css("background-color", "#dedede");
    $(".form-progress-green-line").animate({ width:'40%' }); 
    appendResults(hacked_accounts_review, hacked_accounts_inner, hacked_accounts_result);
    appendResults(compromised_info_review, compromised_info_inner, compromised_info_result);
    break;

  case 4:
    $(".form-progress-indicator.ai").css("background", step_color_mob);
    $(".form-progress-indicator.review").css("background-color", "#dedede");
    $(".form-progress-indicator.submit").css("background-color", "#dedede");
    $(".form-progress-green-line").animate({ width:'60%' }); 
    appendResults(additional_info_review, additional_info_inner, additional_info_result);
    appendResults(agencies_reported_review, agencies_reported_info_inner, agencies_reported_result);
    break;

  case 5:
    $(".form-progress-indicator.review").css("background", step_color_mob);
    $(".form-progress-indicator.submit").css("background-color", "#dedede");
    $(".form-progress-green-line").animate({ width:'80%' }); 
    appendResults (country_result, country_result_inner, country_review);
    appendResults (stolen_result, stolen_result_inner, stolen_review);
    appendResults (hacked_accounts_result, hacked_accounts_inner, hacked_accounts_review);
    appendResults (compromised_info_result, compromised_info_inner, compromised_info_review);
    appendResults (additional_info_result, additional_info_inner, additional_info_review);
    appendResults (agencies_reported_result, agencies_reported_info_inner, agencies_reported_review);
    
    compromised_info_length = $('.sensetive-info').children().children().children().children().children().text().length;
    agency_info_length = $('.additional-info').children().children().children().children().last().children().length;
    additional_info_length = $('.additional-info').children().children().children().first().text().length;
    
    if (compromised_info_length == 0) {
    	$(".form-review-wrapper.sensetive-info").css("display", "none")
    }
    else {
        $(".form-review-wrapper.sensetive-info").css("display", "block")	
    }

    if ((agency_info_length == 0) && (additional_info_length == 0)) {
    	$(".form-review-wrapper.additional-info").css("display", "none")
    }
    else {
        $(".form-review-wrapper.additional-info").css("display", "block")	
    }

    break;

   case 6:
    $(".form-progress-indicator.submit").css("background", step_color_mob);
    $(".form-progress-green-line").animate({ width:'100%' }); 
    break
  }
}

$('.custom-form').on('afterChange', function(event, slick, currentSlide){
  updateProgressBar (currentSlide)
});
