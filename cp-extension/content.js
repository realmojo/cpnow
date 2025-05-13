setTimeout(() => {
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

  function extractProductData(aTagElement) {
    const href = aTagElement.getAttribute("href");
    const url = new URL("https://www.coupang.com" + href);

    const { bigCategory, category } = extractCategoryInfo();
    const productIdMatch = href.match(/\/vp\/products\/(\d+)/);
    const productId = productIdMatch ? Number(productIdMatch[1]) : 0;
    const itemId = Number(url.searchParams.get("itemId")) || 0;
    const vendorItemId = Number(url.searchParams.get("vendorItemId")) || 0;
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

  function applyCpButtons() {
    const productList1 = document.getElementById("product-list");
    const productList2 = document.getElementById("productList");

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

        button.addEventListener("click", (e) => {
          e.stopPropagation();
          e.preventDefault();

          // 🔍 상품 정보 추출
          const aTag = li.querySelector("a");
          const res = extractProductData(aTag);

          // 🔍 categoryId 추출 from URL (정규표현식)

          // ✅ 결과 출력
          console.log("상품 ID 정보:");
          console.log(res);
          // console.log("productId:", productId);
          // console.log("itemId:", itemId);
          // console.log("vendorItemId:", vendorItemId);
          // console.log("categoryId:", categoryId);

          const url = `http://localhost:3000/mynow?item=${encodeURIComponent(JSON.stringify(res))}`;
          window.open(url, "_blank");
        });
        figure.appendChild(button);
      });
    }

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

        button.addEventListener("click", (e) => {
          e.stopPropagation();
          e.preventDefault();

          // 🔍 상품 정보 추출
          const aTag = li.querySelector("a");
          const res = extractProductData(aTag);

          // 🔍 categoryId 추출 from URL (정규표현식)

          // ✅ 결과 출력
          console.log("상품 ID 정보:");
          console.log(res);

          const url = `http://localhost:3000/mynow?item=${encodeURIComponent(JSON.stringify(res))}`;
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
      transition: "background-color 0.2s ease, transform 0.1s ease",
    });

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
