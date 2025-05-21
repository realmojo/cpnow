setTimeout(() => {
  const baseUrl = "http://localhost:3000";
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
    const breadcrumb = document.querySelector("ul.breadcrumb");
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

  const getPIVBycoupangUrl = (url) => {
    const parsedUrl = new URL(url);
    const productIdMatch = url.match(/\/vp\/products\/(\d+)/);
    const productId = productIdMatch ? Number(productIdMatch[1]) : 0;
    const itemId = Number(parsedUrl.searchParams.get("itemId")) || 0;
    const vendorItemId =
      Number(parsedUrl.searchParams.get("vendorItemId")) || 0;

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

    return data;
  }

  function applyCpButtons() {
    const productList1 = document.getElementById("product-list");
    const productList2 = document.getElementById("productList");
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

        // 예시: 특정 도메인으로 알림 등록 요청
        const notifyURL = `${baseUrl}/mynow?item=${encodeToBase64(
          JSON.stringify(params),
        )}`;
        window.open(notifyURL, "_blank");
      });

      // ✅ 5. 문서에 삽입
      document.body.appendChild(button);
    }

    if (productList1) {
      const listItems = productList1.querySelectorAll("li");
      listItems.forEach((li) => {
        const figure = li.querySelector("figure");
        if (!figure || figure.querySelector(".cp-button")) return;

        figure.style.position = "relative";
        const button = createCpButton(() => {
          const nameEl = li.querySelector(".ProductUnit_productName__gre7e");
          const productName = nameEl ? nameEl.innerText.trim() : "상품명 없음";
          console.log(`[product-list] 클릭: ${productName}`);
        });

        // 👇 hover 시 버튼 표시
        li.addEventListener("mouseenter", () => {
          button.style.display = "block";
        });
        li.addEventListener("mouseleave", () => {
          button.style.display = "none";
        });

        button.addEventListener("click", (e) => {
          e.stopPropagation();
          e.preventDefault();

          const aTag = li.querySelector("a");
          const res = extractProductData(aTag);

          console.log("상품 ID 정보:");
          console.log(res);

          const url = `${baseUrl}/mynow?item=${encodeToBase64(
            JSON.stringify(res),
          )}`;
          window.open(url, "_blank");
        });

        figure.appendChild(button);
      });
    }

    // [productList] 처리
    if (productList2) {
      const listItems = productList2.querySelectorAll("li");
      listItems.forEach((li) => {
        const imageContainer = li.querySelector("dt.image");
        if (!imageContainer || imageContainer.querySelector(".cp-button"))
          return;

        imageContainer.style.position = "relative";
        const button = createCpButton(() => {
          const nameEl = li.querySelector(".name");
          const productName = nameEl ? nameEl.innerText.trim() : "상품명 없음";
          console.log(`[productList] 클릭: ${productName}`);
        });

        // 👇 hover 시 버튼 표시
        li.addEventListener("mouseenter", () => {
          button.style.display = "block";
        });
        li.addEventListener("mouseleave", () => {
          button.style.display = "none";
        });

        button.addEventListener("click", (e) => {
          e.stopPropagation();
          e.preventDefault();

          const aTag = li.querySelector("a");
          const res = extractProductData(aTag);

          console.log("상품 ID 정보:");
          console.log(res);

          const url = `${baseUrl}/mynow?item=${encodeToBase64(
            JSON.stringify(res),
          )}`;
          window.open(url, "_blank");
        });

        imageContainer.appendChild(button);
      });
    }
  }

  function createCpButton(onClick) {
    const button = document.createElement("button");
    button.textContent = "최저가 알림";
    button.className = "cp-button";

    Object.assign(button.style, {
      position: "absolute",
      top: "8px",
      right: "8px",
      backgroundColor: "rgba(51, 51, 51, 0.8)",
      color: "white",
      border: "none",
      borderRadius: "4px",
      fontSize: "13px",
      padding: "4px 8px",
      cursor: "pointer",
      zIndex: "0",
      display: "none", // 처음에는 숨김
      transition: "background-color 0.2s ease, transform 0.1s ease",
    });

    // 호버 애니메이션 유지
    button.addEventListener("mouseenter", () => {
      button.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
      button.style.transform = "scale(1.05)";
    });
    button.addEventListener("mouseleave", () => {
      button.style.backgroundColor = "rgba(51, 51, 51, 0.8)";
      button.style.transform = "scale(1)";
    });
    button.addEventListener("mousedown", () => {
      button.style.transform = "scale(0.95)";
    });
    button.addEventListener("mouseup", () => {
      button.style.transform = "scale(1.05)";
    });
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      onClick();
    });

    return button;
  }

  applyCpButtons();
}, 500);
