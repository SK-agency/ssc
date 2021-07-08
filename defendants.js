$(document).ready(function() {
category_defs = document.querySelectorAll(".checkbox-label-tree");
checkbox_defs_all = checkboxGroup[1].querySelectorAll('input[data-name="Checkbox Def Categ"]');
var def_Array = document.querySelectorAll('.def-list-item');
category_defs.forEach( function(elem) {
	def_heading = elem.innerText;
	def_Array.forEach( function(def_elem) {
  	    if (def_elem.querySelector(".def_item_category").innerText == def_heading) {
  	    	elem.closest(".accordion-item").querySelector(".accordion-item-checkbox").append(def_elem.querySelector(".def_item_name"));
  	    }  
});
});

checkbox_defs_all.forEach( function(def_all) {
	def_all.addEventListener('change', updateValue);
})

})

function updateValue(e) {
  checkboxes_inside = e.target.closest(".accordion-item-checkbox").querySelectorAll('input[type="checkbox"]');
  if (e.target.checked) {
  	checkboxes_inside.forEach( function(checkboxes_def) {
  		if (checkboxes_def.getAttribute("data-name") !== "Checkbox Def Categ") {
  		checkboxes_def.checked = true;
  		checkboxes_def.parentElement.querySelector(".w-checkbox-input--inputType-custom").classList.add("w--redirected-checked");
  		}
  	})
  }
  else {
    checkboxes_inside.forEach( function(checkboxes_def) {
    	if (checkboxes_def.getAttribute("data-name") !== "Checkbox Def Categ") {
  		checkboxes_def.checked = false;
  		checkboxes_def.parentElement.querySelector(".w-checkbox-input--inputType-custom").classList.remove("w--redirected-checked");
    	}
  	})
  }
}
