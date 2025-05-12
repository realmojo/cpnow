setTimeout(() => {
  let lastUrl = location.href;

  setInterval(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      console.log("[INFO] URL changed:", lastUrl);
      setTimeout(applyCpButtons, 10); // DOM 렌더링 이후 실행
    }
  }, 500);

  // 초기 실행

  function extractProductInfo(href) {
    const productIdMatch = href.match(/\/vp\/products\/(\d+)/);
    const url = new URL("https://www.coupang.com" + href); // 상대경로 처리

    const productId = productIdMatch ? productIdMatch[1] : "없음";
    const itemId = url.searchParams.get("itemId") || "없음";
    const vendorItemId = url.searchParams.get("vendorItemId") || "없음";

    return {
      productId,
      itemId,
      vendorItemId,
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
          const { productId, itemId, vendorItemId } = extractProductInfo(
            aTag.href,
          );

          // 🔍 categoryId 추출 from URL (정규표현식)
          const match = location.href.match(/categories\/(\d+)/);
          const categoryId = match ? match[1] : "없음";

          // ✅ 결과 출력
          console.log("상품 ID 정보:");
          console.log("productId:", productId);
          console.log("itemId:", itemId);
          console.log("vendorItemId:", vendorItemId);
          console.log("categoryId:", categoryId);
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
          const { productId, itemId, vendorItemId } = extractProductInfo(
            aTag.href,
          );

          // 🔍 categoryId 추출 from URL (정규표현식)
          const match = location.href.match(/categories\/(\d+)/);
          const categoryId = match ? match[1] : "없음";

          // ✅ 결과 출력
          console.log("상품 ID 정보:");
          console.log("productId:", productId);
          console.log("itemId:", itemId);
          console.log("vendorItemId:", vendorItemId);
          console.log("categoryId:", categoryId);
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
