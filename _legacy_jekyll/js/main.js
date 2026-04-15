(function () {
  var toggle = document.querySelector(".nav-toggle");
  var navList = document.getElementById("site-nav-list");

  if (!toggle || !navList) {
    return;
  }

  toggle.addEventListener("click", function () {
    var expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", expanded ? "false" : "true");
    navList.classList.toggle("responsive");
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 640) {
      toggle.setAttribute("aria-expanded", "false");
      navList.classList.remove("responsive");
    }
  });
})();
