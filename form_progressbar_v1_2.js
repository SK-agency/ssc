country_result = document.getElementsByClassName('country-result')[0];
stolen_result = document.getElementsByClassName('was-stolen-result')[0];
country_result_inner = document.querySelectorAll('.result-table-country');
stolen_result_inner = document.querySelectorAll('.result-table-was-stolen');
country_review = document.getElementsByClassName('country-review')[0];
stolen_review = document.getElementsByClassName('stolen-review')[0];

function appendResults (start_wrapper, start_inner, goal_append) {
	if (start_wrapper.hasChildNodes()) {
	start_inner.forEach( function(move) {
	goal_append.appendChild(move);
	});
    }
}


function updateProgressBar (currentSlide) {
  switch (currentSlide) {
  
  case 0:
    $(".form-progress-indicator.ss").css("background-color", "#dedede");
    break;  

  case 1:
    $(".form-progress-indicator.ss").css("background-color", "#32d74b");
    $(".form-progress-indicator.details").css("background-color", "#dedede");
    $(".form-progress-green-line").animate({ width:'0%' });  
    appendResults(country_review, country_result_inner, country_result);

    break;

  case 2:
    $(".form-progress-indicator.details").css("background-color", "#32d74b");
    $(".form-progress-indicator.accounts").css("background-color", "#dedede");
    $(".form-progress-green-line").animate({ width:'20%' }); 
    appendResults(stolen_review, stolen_result_inner, stolen_result);
    break;

  case 3:
    $(".form-progress-indicator.accounts").css("background-color", "#32d74b");
    $(".form-progress-indicator.ai").css("background-color", "#dedede");
    $(".form-progress-green-line").animate({ width:'40%' }); 

    break;

  case 4:
    $(".form-progress-indicator.ai").css("background-color", "#32d74b");
    $(".form-progress-indicator.review").css("background-color", "#dedede");
    $(".form-progress-indicator.submit").css("background-color", "#dedede");
    $(".form-progress-green-line").animate({ width:'60%' }); 
    break;

  case 5:
    $(".form-progress-indicator.review").css("background-color", "#32d74b");
    $(".form-progress-indicator.submit").css("background-color", "#dedede");
    $(".form-progress-green-line").animate({ width:'80%' }); 
    appendResults (country_result, country_result_inner, country_review);
    appendResults (stolen_result, stolen_result_inner, stolen_review);

    break;

   case 6:
    $(".form-progress-indicator.submit").css("background-color", "#32d74b");
    $(".form-progress-green-line").animate({ width:'100%' }); 
    break
  }
}

$('.custom-form').on('afterChange', function(event, slick, currentSlide){
  updateProgressBar (currentSlide)
});
