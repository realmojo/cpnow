setTimeout(() => {
  const baseUrl = "https://cpnow.kr";
  let lastUrl = location.href;

  setInterval(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      console.log("[INFO] URL changed:", lastUrl);
      setTimeout(applyCpButtons, 10); // DOM 렌더링 이후 실행
    }
  }, 500);

  function getDeliveryType(src) {
    if (
      src.includes("rocket_logo") ||
      src.includes("logo_rocket") ||
      src.includes("rocketwow")
    )
      return 1;
    if (src.includes("logoRocketMerchant")) return 2;
    if (src.includes("global_b")) return 3;
    if (src.includes("rocket-fresh")) return 4;
    if (src.includes("rocket_install")) return 5;
    return 0;
  }

  function extractCoupangDetailCategoryInfo() {
    try {
      const breadcrumb = document.querySelector("ul#breadcrumb");
      if (!breadcrumb) return null;

      const links = breadcrumb.querySelectorAll("li > a");
      const categories = [];

      links.forEach((a) => {
        const text = a.textContent.trim();
        const href = a.getAttribute("href") || "";
        const match = href.match(/\/categories\/(\d+)/);

        if (text !== "쿠팡 홈") {
          categories.push({
            name: text,
            id: match ? match[1] : null,
          });
        }
      });

      const bigCategory = categories.length > 0 ? categories[0].name : null;
      const lastCategory =
        categories.length > 0 ? categories[categories.length - 1] : null;

      return {
        bigCategory,
        lastCategory,
      };
    } catch (e) {
      console.error("❌ 카테고리 추출 실패:", e);
      return {
        bigCategory: "",
        lastCategory: "",
      };
    }
  }

  // 초기 실행
  function extractCategoryInfo() {
    const categoryWrapper = document.querySelector(".category-info-result ul");
    if (!categoryWrapper) return { bigCategory: null, category: null };

    const categoryLinks = Array.from(categoryWrapper.querySelectorAll("li a"));

    const bigCategory =
      categoryLinks.length >= 2 ? categoryLinks[1].textContent.trim() : null;
    const category =
      categoryLinks.length >= 1
        ? categoryLinks[categoryLinks.length - 1].textContent.trim()
        : null;

    return {
      bigCategory,
      category,
    };
  }

  const extractCoupangProductAndItemId = () => {
    const descriptionEl = document.querySelector(".product-description");
    if (!descriptionEl) return null;

    const liList = descriptionEl.querySelectorAll("li");

    for (const li of liList) {
      if (li.textContent.includes("쿠팡상품번호")) {
        const match = li.textContent.match(/쿠팡상품번호:\s*(\d+)\s*-\s*(\d+)/);
        if (match) {
          return {
            productId: match[1],
            itemId: match[2],
          };
        }
      }
    }

    return 0; // 찾지 못했을 경우
  };

  const getPIVBycoupangUrl = (url) => {
    console.log(url);
    const parsedUrl = new URL(url);
    const productIdMatch = url.match(/\/vp\/products\/(\d+)/);
    const productId = productIdMatch ? Number(productIdMatch[1]) : 0;
    let itemId = Number(parsedUrl.searchParams.get("itemId")) || 0;
    const vendorItemId =
      Number(parsedUrl.searchParams.get("vendorItemId")) || 0;

    if (itemId === 0) {
      const d = extractCoupangProductAndItemId();
      itemId = d.itemId;
    }

    return { productId, itemId, vendorItemId };
  };

  function extractProductData(aTagElement) {
    const href = aTagElement.getAttribute("href");
    const { productId, itemId, vendorItemId } = getPIVBycoupangUrl(href);

    const { bigCategory, category } = extractCategoryInfo();
    const match = location.href.match(/categories\/(\d+)/);
    const categoryId = match ? Number(match[1]) : 0;

    // 썸네일 이미지 추출
    const thumbnailImg = aTagElement.querySelector(
      'img[data-sentry-element="Image"]',
    );
    const thumbnail = thumbnailImg ? thumbnailImg.src : "";

    // 제목 (ProductName은 직접적으로 없는 경우, fallback은 긴 텍스트 div)
    const titleEl = aTagElement.querySelector(
      'img[data-sentry-element="Image"]',
    );
    const title = titleEl ? titleEl.getAttribute("alt") : "";

    // 가격 (Price → strong 태그 또는 숫자 포함된 div)
    const priceEl = aTagElement.querySelector(
      'div[data-sentry-component="Price"] strong',
    );
    const priceText = priceEl ? priceEl.textContent.replace(/[^\d]/g, "") : 0;
    const price = parseInt(priceText, 10);

    // 평점: ProductRating 영역 내 style width
    const ratingEl = aTagElement.querySelector(
      'div[data-sentry-component="ProductRating"] div[style*="width"]',
    );
    let rating = 0;
    if (ratingEl) {
      const widthMatch = ratingEl.style.width.match(/(\d+)%/);
      if (widthMatch) {
        rating = Math.round((parseInt(widthMatch[1]) / 100) * 5 * 10) / 10;
      }
    }

    // 리뷰 수: 고정 클래스 사용 또는 span[data-sentry-component="ProductRating"] 내 span
    const reviewEl = aTagElement.querySelector(
      "div[data-sentry-component='ProductRating'] span:nth-child(2)",
    );
    const reviewCountText = reviewEl
      ? reviewEl.textContent.replace(/[^\d]/g, "")
      : "0";
    const reviewCount = parseInt(reviewCountText, 10);

    // 배송 타입 이미지
    const deliveryImg = aTagElement.querySelector(
      'div[data-sentry-component="ImageBadge"] img',
    );
    const deliverySrc = deliveryImg ? deliveryImg.getAttribute("src") : "";
    const deliveryType = getDeliveryType(deliverySrc);

    return {
      bigCategory,
      category,
      productId,
      itemId,
      vendorItemId,
      categoryId,
      title,
      thumbnail,
      price,
      deliveryType,
      rating,
      reviewCount,
    };
  }

  function encodeToBase64(str) {
    return btoa(encodeURIComponent(str));
  }

  function extractCoupangProductBySentryComponent() {
    const data = {};

    // ✅ 썸네일 (대표 이미지)
    const imageComp = document.querySelector(
      '[data-sentry-component="ImageMagnifier"] img',
    );
    data.thumbnail = imageComp
      ? imageComp.src.startsWith("//")
        ? "https:" + imageComp.src
        : imageComp.src
      : "";

    // ✅ 제목
    const titleComp = document.querySelector(
      '[data-sentry-component="ProductTitle"] .twc-font-bold',
    );
    data.title = titleComp ? titleComp.textContent.trim() : "";

    // ✅ 별점 (width: 80% → 4.0)
    const ratingComp = document.querySelector(
      '[data-sentry-component="ProductBuyHeader"] .rating-star-num',
    );
    if (ratingComp?.style?.width) {
      const width = parseFloat(ratingComp.style.width);
      data.rating = isNaN(width) ? 0 : Math.round((width / 20) * 10) / 10;
    } else {
      data.rating = 0;
    }

    // ✅ 리뷰 수
    const reviewComp = document.querySelector(
      '[data-sentry-component="ProductBuyHeader"] .rating-count-txt',
    );
    if (reviewComp) {
      const match = reviewComp.textContent.match(/\d+[,\d]*/);
      data.reviewCount = match ? parseInt(match[0].replace(/,/g, ""), 10) : 0;
    } else {
      data.reviewCount = 0;
    }

    // ✅ 가격 (판매가)
    const priceComp = document.querySelector(
      '[data-sentry-component="FinalPrice"] .final-price-amount',
    );
    if (priceComp) {
      const raw = priceComp.textContent.replace(/[^\d]/g, "");
      data.price = parseInt(raw, 10);
    } else {
      data.price = 0;
    }

    // ✅ 배송 타입 이미지 URL
    const deliveryBadge = document.querySelector(
      '[data-sentry-component="PriceBadges"] img',
    );
    const deliveryTypeImage = deliveryBadge
      ? deliveryBadge.src.startsWith("//")
        ? "https:" + deliveryBadge.src
        : deliveryBadge.src
      : "";

    data.deliveryType = getDeliveryType(deliveryTypeImage);

    if (
      data.thumbnail &&
      data.title &&
      data.price &&
      data.rating &&
      data.reviewCount &&
      data.deliveryType
    ) {
      return data;
    } else {
      //
      const thumbnail = document
        .querySelector(".prod-image__detail")
        .getAttribute("src");
      const title = document
        .querySelector(".prod-buy-header__title")
        .textContent.trim();
      const price = document.querySelector(".total-price").textContent.trim();
      let rating = document.querySelector(".rating-star-num").style.width;
      const reviewCount = document.querySelector(".count").textContent.trim();
      const deliveryType = document
        .querySelector(".delivery-badge-img")
        .getAttribute("src");

      rating = rating.match(/(\d+)%/);
      data.thumbnail = thumbnail
        ? thumbnail.startsWith("//")
          ? `https:${thumbnail}`
          : thumbnail
        : "";
      data.title = title;
      data.price = price ? parseInt(price.replace(/[^\d]/g, ""), 10) : 0;
      data.rating = rating
        ? Math.round((parseInt(rating[1]) / 100) * 5 * 10) / 10
        : 0;
      data.reviewCount = reviewCount
        ? parseInt(reviewCount.replace(/,/g, ""), 10)
        : 0;
      data.deliveryType = getDeliveryType(deliveryType);

      return data;
    }
  }

  function applyCpButtons() {
    const isCoupangProductPage = location.href.startsWith(
      "https://www.coupang.com/vp/products",
    );

    if (isCoupangProductPage) {
      // ✅ 2. 버튼 생성
      const button = document.createElement("button");
      button.innerHTML = "🔔"; // 이모지 아이콘
      button.id = "floating-alarm-btn";

      // ✅ 3. 버튼 스타일
      Object.assign(button.style, {
        position: "fixed",
        bottom: "13px",
        right: "13px",
        width: "56px",
        height: "56px",
        backgroundColor: "#007bff",
        color: "#fff",
        borderRadius: "50%",
        border: "none",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
        fontSize: "24px",
        cursor: "pointer",
        zIndex: "9999",
        transition: "transform 0.2s ease",
      });

      button.addEventListener("mouseenter", () => {
        button.style.transform = "scale(1.1)";
      });
      button.addEventListener("mouseleave", () => {
        button.style.transform = "scale(1)";
      });

      // ✅ 4. 클릭 이벤트 처리
      button.addEventListener("click", () => {
        const currentURL = window.location.href;
        console.log("✅ 최저가 알림 등록 요청됨:", currentURL);

        const { bigCategory, lastCategory } =
          extractCoupangDetailCategoryInfo();

        const { productId, itemId, vendorItemId } =
          getPIVBycoupangUrl(currentURL);

        const { title, thumbnail, price, rating, reviewCount, deliveryType } =
          extractCoupangProductBySentryComponent();

        const params = {
          bigCategory,
          category: lastCategory.name,
          categoryId: Number(lastCategory.id),
          productId,
          itemId,
          vendorItemId,
          title,
          thumbnail,
          price,
          deliveryType,
          rating,
          reviewCount,
        };

        console.log(params);

        // 예시: 특정 도메인으로 알림 등록 요청
        const notifyURL = `${baseUrl}/mynow?item=${encodeToBase64(
          JSON.stringify(params),
        )}`;
        window.open(notifyURL, "_blank");
      });

      // ✅ 5. 문서에 삽입
      document.body.appendChild(button);
    }
  }

  applyCpButtons();
}, 500);
