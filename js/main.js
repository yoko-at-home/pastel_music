//===============================================================
// debounce関数
//===============================================================
function debounce(func, wait) {
  let timeout;
  return (...args) => {
    const context = this;
    const later = () => {
      timeout = null;
      func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

//===============================================================
// メニュー関連
//===============================================================

// 変数でセレクタを管理
const $menubar = $("#menubar");
const $menubarHdr = $("#menubar_hdr");

// menu
$(window).on(
  "load resize",
  debounce(() => {
    if (window.innerWidth < 900) {
      // 小さな端末用の処理
      $("body").addClass("small-screen").removeClass("large-screen");
      $menubar.addClass("display-none").removeClass("display-block");
      $menubarHdr.removeClass("display-none ham").addClass("display-block");
    } else {
      // 大きな端末用の処理
      $("body").addClass("large-screen").removeClass("small-screen");
      $menubar.addClass("display-block").removeClass("display-none");
      $menubarHdr.removeClass("display-block").addClass("display-none");

      // ドロップダウンメニューが開いていれば、それを閉じる
      $(".ddmenu_parent > ul").hide();
    }
  }, 10)
);

$(() => {
  // ハンバーガーメニューをクリックした際の処理
  $menubarHdr.click(function () {
    $(this).toggleClass("ham");
    if ($(this).hasClass("ham")) {
      $menubar.addClass("display-block");
    } else {
      $menubar.removeClass("display-block");
    }
  });

  // アンカーリンクの場合にメニューを閉じる処理
  $menubar.find('a[href*="#"]').click(() => {
    $menubar.removeClass("display-block");
    $menubarHdr.removeClass("ham");
  });

  // ドロップダウンの親liタグ（空のリンクを持つaタグのデフォルト動作を防止）
  $menubar.find('a[href=""]').click(() => false);

  // ドロップダウンメニューの処理
  $menubar.find("li:has(ul)").addClass("ddmenu_parent");
  $(".ddmenu_parent > a").addClass("ddmenu");

  // タッチ開始位置を格納する変数
  let touchStartY = 0;

  // タッチデバイス用
  $(".ddmenu")
    .on("touchstart", (e) => {
      // タッチ開始位置を記録
      touchStartY = e.originalEvent.touches[0].clientY;
    })
    .on("touchend", function (e) {
      // タッチ終了時の位置を取得
      const touchEndY = e.originalEvent.changedTouches[0].clientY;
      const touchDifference = touchStartY - touchEndY;
      const $nextUl = $(this).next("ul");

      // スクロール動作でない（差分が小さい）場合にのみドロップダウンを制御
      if (Math.abs(touchDifference) < 10) {
        // 10px以下の移動ならタップとみなす
        if ($nextUl.is(":visible")) {
          $nextUl.stop().hide();
        } else {
          $nextUl.stop().show();
        }
        $(".ddmenu").not(this).next("ul").hide();
        return false; // ドロップダウンのリンクがフォローされるのを防ぐ
      }
    });

  //PC用
  $(".ddmenu_parent").hover(
    function () {
      $(this).children("ul").stop().show();
    },
    function () {
      $(this).children("ul").stop().hide();
    }
  );

  // ドロップダウンをページ内リンクで使った場合に、ドロップダウンを閉じる
  $(".ddmenu_parent ul a").click(() => {
    $(".ddmenu_parent > ul").hide();
  });
});

//===============================================================
// 小さなメニューが開いている際のみ、body要素のスクロールを禁止。
//===============================================================
$(document).ready(() => {
  function toggleBodyScroll() {
    // 条件をチェック
    if (
      $("#menubar_hdr").hasClass("ham") &&
      !$("#menubar_hdr").hasClass("display-none")
    ) {
      // #menubar_hdr が 'ham' クラスを持ち、かつ 'display-none' クラスを持たない場合、スクロールを禁止
      $("body").css({
        overflow: "hidden",
        height: "100%",
      });
    } else {
      // その他の場合、スクロールを再び可能に
      $("body").css({
        overflow: "",
        height: "",
      });
    }
  }

  // 初期ロード時にチェックを実行
  toggleBodyScroll();

  // クラスが動的に変更されることを想定して、MutationObserverを使用
  const observer = new MutationObserver(toggleBodyScroll);
  observer.observe(document.getElementById("menubar_hdr"), {
    attributes: true,
    attributeFilter: ["class"],
  });
});

//===============================================================
// スムーススクロール（※バージョン2024-1）※通常タイプ
//===============================================================
$(() => {
  // ページ上部へ戻るボタンのセレクター
  const topButton = $(".pagetop");
  // ページトップボタン表示用のクラス名
  const scrollShow = "pagetop-show";

  // スムーススクロールを実行する関数
  // targetにはスクロール先の要素のセレクターまたは'#'（ページトップ）を指定
  function smoothScroll(target) {
    // スクロール先の位置を計算（ページトップの場合は0、それ以外は要素の位置）
    const scrollTo = target === "#" ? 0 : $(target).offset().top - 25;
    // アニメーションでスムーススクロールを実行
    $("html, body").animate({ scrollTop: scrollTo }, 500);
  }

  // ページ内リンクとページトップへ戻るボタンにクリックイベントを設定
  $('a[href^="#"], .pagetop').click(function (e) {
    e.preventDefault(); // デフォルトのアンカー動作をキャンセル
    const id = $(this).attr("href") || "#"; // クリックされた要素のhref属性を取得、なければ'#'
    smoothScroll(id); // スムーススクロールを実行
  });

  // スクロールに応じてページトップボタンの表示/非表示を切り替え
  $(topButton).hide(); // 初期状態ではボタンを隠す
  $(window).scroll(function () {
    if ($(this).scrollTop() >= 300) {
      // スクロール位置が300pxを超えたら
      $(topButton).fadeIn().addClass(scrollShow); // ボタンを表示
    } else {
      $(topButton).fadeOut().removeClass(scrollShow); // それ以外では非表示
    }
  });

  // ページロード時にURLのハッシュが存在する場合の処理
  if (window.location.hash) {
    // ページの最上部に即時スクロールする
    $("html, body").scrollTop(0);
    // 少し遅延させてからスムーススクロールを実行
    setTimeout(() => {
      smoothScroll(window.location.hash);
    }, 10);
  }
});

//===============================================================
// 汎用開閉処理
//===============================================================
$(() => {
  $(".openclose").next().hide();
  $(".openclose").click(function () {
    $(this).next().slideToggle();
    $(".openclose").not(this).next().slideUp();
  });
});

//===============================================================
// 背景切り替え
//===============================================================
$(document).ready(() => {
  function checkVisibility() {
    const viewportHeight = $(window).height();
    const scrollTop = $(window).scrollTop();

    $(".section").each(function () {
      const sectionTop = $(this).offset().top;
      const sectionHeight = $(this).outerHeight();

      if (
        sectionTop < scrollTop + viewportHeight * 0.6 &&
        sectionTop + sectionHeight > scrollTop + viewportHeight * 0.4
      ) {
        $(this).addClass("active").removeClass("inactive");
      } else {
        $(this).addClass("inactive").removeClass("active");
      }
    });
  }

  $(window).on("scroll", checkVisibility);
  checkVisibility();
});

//===============================================================
// スライドショー
//===============================================================
$(() => {
  $(".slide-type1").each(function () {
    const $this = $(this);
    const slides = $this.find(".slide");
    const slideCount = slides.length;
    let currentIndex = 0;

    // インジケータを表示する要素を取得
    const indicators = $this.find(".slide-indicators");

    // スライドの数に応じたインジケータを生成
    for (let i = 0; i < slideCount; i++) {
      indicators.append(`<span class="indicator" data-index="${i}"></span>`);
    }

    // インジケータの初期状態を設定
    const indicatorElements = indicators.find(".indicator");
    indicatorElements.eq(currentIndex).addClass("active");

    // スライドの初期状態を設定
    slides.eq(currentIndex).css("opacity", 1).addClass("active");

    // インジケータをクリックしたときの動作を設定
    indicatorElements.on("click", function () {
      const clickedIndex = $(this).data("index");

      if (clickedIndex === currentIndex) return;

      slides.eq(currentIndex).css("opacity", 0).removeClass("active");
      slides.eq(clickedIndex).css("opacity", 1).addClass("active");

      indicatorElements.eq(currentIndex).removeClass("active");
      indicatorElements.eq(clickedIndex).addClass("active");

      currentIndex = clickedIndex;
    });

    // 自動スライドのタイマー
    setInterval(() => {
      const nextIndex = (currentIndex + 1) % slideCount;

      slides.eq(currentIndex).css("opacity", 0).removeClass("active");
      slides.eq(nextIndex).css("opacity", 1).addClass("active");

      indicatorElements.eq(currentIndex).removeClass("active");
      indicatorElements.eq(nextIndex).addClass("active");

      currentIndex = nextIndex;
    }, 4000);
  });
});

//===============================================================
// サムネイルスライドショー
//===============================================================
$(document).ready(() => {
  $(".slide-thumbnail1 .img").each(function () {
    const $imgParts = $(this);
    const $divs = $imgParts.children("div");
    const divCount = $divs.length;

    // 各 div の幅を計算
    const divWidth = 100 / (divCount * 2);

    // 基準値と速度係数を定義
    const baseAnimationTime = 30;
    const baseSlideWidth = 200;
    const speedFactor = divCount / 4;

    // アニメーション時間とスライド幅を計算
    const animationTime = `${baseAnimationTime * speedFactor}s`;
    const slideWidth = `${baseSlideWidth * speedFactor}%`;

    // 各 div に幅を設定
    $divs.css({
      flex: `0 0 ${divWidth}%`,
      width: `${divWidth}%`,
    });

    // .img に animation と width を設定
    $imgParts.css({
      "animation-duration": animationTime,
      width: slideWidth,
    });

    // 子要素を複製して追加
    $divs.clone().appendTo($imgParts);

    // アニメーションの一時停止と再開
    $imgParts
      .on("mouseenter", function () {
        $(this).css("animation-play-state", "paused");
      })
      .on("mouseleave", function () {
        $(this).css("animation-play-state", "running");
      });
  });
});
