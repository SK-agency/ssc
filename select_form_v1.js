var parentElement = $(".popup-report");
$("select.js-example-basic-single").select2({
      allowClear: false,
      //placeholder: placeholder,
      minimumResultsForSearch: 0,
      minimumInputLength: 1,
      dropdownPosition: "below",
      dropdownParent: parentElement,
      tags: true,
      sorter: (data) => data.sort((a, b) => a.text.localeCompare(b.text)),
    });
$("select.js-example-basic-single").on("click", function (e) {
      $(this).trigger("focus").select2("focus");
    });

    $("select.js-example-basic-single").on("select2:open", function (e) {
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
