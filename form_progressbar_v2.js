function updateProgressBar (currentSlide) {
  switch (currentSlide) {
  
  case 0:
    $(".form-progress-indicator.ss").css("background-color", "#dedede");
    break;  

  case 1:
    $(".form-progress-indicator.ss").css("background-color", "#32d74b");
    $(".form-progress-indicator.details").css("background-color", "#dedede");
    $(".form-progress-green-line").animate({ width:'0%' }); 
    break;

  case 2:
    $(".form-progress-indicator.details").css("background-color", "#32d74b");
    $(".form-progress-indicator.accounts").css("background-color", "#dedede");
    $(".form-progress-green-line").animate({ width:'20%' }); 
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

  case '5':
    $(".form-progress-indicator.review").css("background-color", "#32d74b");
    $(".form-progress-indicator.submit").css("background-color", "#dedede");
    $(".form-progress-green-line").animate({ width:'80%' }); 
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
