// ハンバーガーメニューのテスト
$(document).ready(function () {
  console.log("jQuery loaded:", typeof $);
  console.log("menubar_hdr element:", $("#menubar_hdr").length);
  console.log("menubar element:", $("#menubar").length);

  // ハンバーガーメニューのクリックイベント
  $("#menubar_hdr").on("click", function () {
    console.log("Hamburger menu clicked");
    $(this).toggleClass("ham");
    if ($(this).hasClass("ham")) {
      $("#menubar").addClass("display-block");
      console.log("Menu opened");
    } else {
      $("#menubar").removeClass("display-block");
      console.log("Menu closed");
    }
  });

  // 画面サイズの変更イベント
  $(window).on("resize", function () {
    if (window.innerWidth < 900) {
      $("body").addClass("small-screen").removeClass("large-screen");
      $("#menubar").addClass("display-none").removeClass("display-block");
      $("#menubar_hdr")
        .removeClass("display-none ham")
        .addClass("display-block");
    } else {
      $("body").addClass("large-screen").removeClass("small-screen");
      $("#menubar").addClass("display-block").removeClass("display-none");
      $("#menubar_hdr").removeClass("display-block").addClass("display-none");
    }
  });

  // 初期化
  $(window).trigger("resize");
});
