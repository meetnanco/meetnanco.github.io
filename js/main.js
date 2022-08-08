var main = {
    init : function() {
        $('#main-navbar').on("click", ".navlinks-parent", function(e) {
            var target = e.target;
            $.each($(".navlinks-parent"), function(key, value) {
              if (value == target) {
                $(value).parent().toggleClass("show-children");
              } else {
                $(value).parent().removeClass("show-children");
              }
            });
          });
    },
}

document.addEventListener('DOMContentLoaded', main.init);