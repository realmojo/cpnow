// ==UserScript==
// @name         쿠팡 수집기
// @match        https://www.coupang.com/vp/products/*
// @version      2025-05-10
// @description  try to take over the world!
// @author       You
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-end
// @grant        none
// ==/UserScript==

// 문자열 가격에서 숫자 추출
const extractPrice = (priceStr) =>
  parseInt(priceStr.replace(/[^\d]/g, ""), 10) || 0;

// 배송 이미지 URL에 따른 배송 타입 추출
const getDeliveryType = (src) => {
  if (src.includes("rocket_logo") || src.includes("rocketwow")) return 1;
  if (src.includes("logoRocketMerchant")) return 2;
  if (src.includes("global_b")) return 3;
  if (src.includes("rocket-fresh")) return 4;
  if (src.includes("rocket_install")) return 5;
  return 0;
};
const hasValue = (value) => {
  return (
    value !== undefined &&
    value !== null &&
    value !== "" &&
    !Number.isNaN(value)
  );
};

const addProductPrice = async (pId, price) => {
  try {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pId, price }), // 전송할 pId 값
      redirect: "follow",
    };

    const response = await fetch(
      "https://cpnow.kr/api/productPrice",
      requestOptions,
    );
    await response.json();
  } catch (error) {
    console.error("updateCrawl 대기열 업데이트 오류:", error);
  }
};

const updateCoupangData = async (item) => {
  const { id, lowPrice, highPrice, price, deliveryType, rating, reviewCount } =
    item;

  try {
    if (
      hasValue(id) &&
      hasValue(lowPrice) &&
      hasValue(highPrice) &&
      hasValue(price) &&
      hasValue(deliveryType) &&
      hasValue(rating) &&
      hasValue(reviewCount)
    ) {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          lowPrice,
          highPrice,
          price,
          deliveryType,
          rating,
          reviewCount,
        }),
        redirect: "follow",
      };

      const response = await fetch(
        "https://cpnow.kr/api/product",
        requestOptions,
      );
      await response.json();
    }
  } catch (e) {
    console.log("updateCoupangData 오류: ", e);
  }
};

const getProductItem = async (productId, itemId, vendorItemId) => {
  if (productId && itemId && vendorItemId) {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };
      const response = await fetch(
        `https://cpnow.kr/api/product/piv?productId=${productId}&itemId=${itemId}&vendorItemId=${vendorItemId}`,
        requestOptions,
      );
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("getProductItem 에러 발생:", error);
    }
  }
  return "";
};

const updateCrawl = async (pId) => {
  try {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pId }), // 전송할 pId 값
      redirect: "follow",
    };

    const response = await fetch(
      "https://cpnow.kr/api/crawlwait",
      requestOptions,
    );
    await response.json();
  } catch (error) {
    console.error("updateCrawl 대기열 업데이트 오류:", error);
  }
};

const comparePriceDetail = (productPrice, crawlPrice) => {
  if (productPrice === 0) return "기준 가격 오류"; // 0으로 나누는 오류 방지

  const priceDifference = Math.abs(productPrice - crawlPrice); // 차액 계산

  if (crawlPrice < productPrice) {
    const discountPercent = (
      ((productPrice - crawlPrice) / productPrice) *
      100
    ).toFixed(0);
    return `🚀🚀🚀 ${priceDifference.toLocaleString()}원 할인됨 ${discountPercent}%`;
  } else if (crawlPrice > productPrice) {
    const increasePercent = (
      ((crawlPrice - productPrice) / productPrice) *
      100
    ).toFixed(0);
    return `${priceDifference.toLocaleString()}원 인상됨 ${increasePercent}%`;
  }
};

const alarmNotify = async (productItem, crawlPrice) => {
  const { id, price, title } = productItem;
  try {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    const response = await fetch(
      `https://cpnow.kr/api/alarm/users?id=${id}`,
      requestOptions,
    );
    const items = await response.json();

    if (items.length === 0) {
      console.log("아무도 등록을 해놓은 사람이 없습니다.");
    }

    for (const item of items) {
      if (item.fcmToken) {
        const params = {
          token: item.fcmToken,
          title: `[${title}]`,
          body: `${comparePriceDetail(price, crawlPrice)}`,
          link: `https://cpnow.kr/product/${id}`,
        };

        console.log(`🔔 ${item.fcmToken} 유저에게 발송`);

        try {
          const response = await fetch("https://cpnow.kr/api/notify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
          });

          const result = await response.json();
          console.log("📬 알림 응답:", result);
        } catch (error) {
          console.error("❌ 알림 발송 오류:", error);
        }
      }
    }
  } catch (e) {
    console.log("alarmNotify 오류: ", e);
  }
};

const sleepRandom30to60 = () => {
  const minMs = 2000; // 30초
  const maxMs = 2000; // 60초
  const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;

  return new Promise((resolve) => setTimeout(resolve, delay));
};

const parseCoupangUrl = (url) => {
  try {
    const urlObj = new URL(url);

    // 1. productId 추출: /products/숫자
    const productMatch = urlObj.pathname.match(/\/products\/(\d+)/);
    const productId = productMatch ? productMatch[1] : null;

    // 2. itemId, vendorItemId 추출: 쿼리 파라미터에서
    const itemId = urlObj.searchParams.get("itemId");
    const vendorItemId = urlObj.searchParams.get("vendorItemId");

    return {
      productId,
      itemId,
      vendorItemId,
    };
  } catch (error) {
    console.error("❌ 유효하지 않은 URL입니다:", error);
    return null;
  }
};

// DOM이 준비된 후 실행
const initSidebarLogger = () => {
  const style = document.createElement("style");
  style.textContent = `
    #tm-console-panel {
      position: fixed;
      top: 0;
      right: 0;
      width: 300px;
      height: 100vh;
      background: rgba(0, 0, 0, 0.85);
      color: #0f0;
      font-family: monospace;
      font-size: 12px;
      overflow-y: auto;
      padding: 10px;
      z-index: 999999;
      white-space: pre-wrap;
    }
    #tm-console-toggle {
      position: fixed;
      top: 10px;
      right: 310px;
      background: #111;
      color: #0f0;
      padding: 5px 10px;
      font-size: 12px;
      z-index: 1000000;
      cursor: pointer;
    }
    .tm-log-line {
      margin-bottom: 5px;
    }
  `;
  document.head.appendChild(style);

  const panel = document.createElement("div");
  panel.id = "tm-console-panel";
  document.body.appendChild(panel);

  const toggle = document.createElement("div");
  toggle.id = "tm-console-toggle";
  toggle.textContent = "👁️ 로그 보기";
  toggle.onclick = () => {
    panel.style.display = panel.style.display === "none" ? "block" : "none";
  };
  document.body.appendChild(toggle);

  // ✅ console.log 가로채기 (페이지 context에 반영됨)
  const originalLog = window.console.log;
  window.console.log = (...args) => {
    originalLog(...args); // 원래 로그 출력

    const logText = args
      .map((arg) =>
        typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg),
      )
      .join(" ");

    const line = document.createElement("div");
    line.className = "tm-log-line";
    line.textContent = "🟢 " + logText;
    panel.appendChild(line);
    panel.scrollTop = panel.scrollHeight;
  };

  console.log("✅ 콘솔 재정의 및 사이드 로그 패널 초기화 완료");
};

const run = async () => {
  console.log(123);
  const { productId, itemId, vendorItemId } = parseCoupangUrl(location.href);

  const productItems = await getProductItem(productId, itemId, vendorItemId);

  if (productItems.length > 0) {
    // let { highPrice, lowPrice, price } = productItems[0];

    // highPrice = highPrice || price;
    // lowPrice = lowPrice || price;

    console.log("잠시 기다림... 5초");
    await sleepRandom30to60(); // 잠시 기다림
    let isSoldout = false;
    let crawlPrice = 0;
    let crawlDeliveryType = 0;
    let crawlRating = 0;
    let crawlReviewCount = 0;

    // 품절 체크
    try {
      const soldoutEl = document.querySelector(".out-of-stock-label");
      if (soldoutEl) {
        const text = soldoutEl.innerText;
        isSoldout = text.includes("품절");
      }

      const soldoutEl2 = document.querySelector(
        ".prod-not-find-known__buy__btn",
      );
      if (soldoutEl2) {
        const text = soldoutEl2.innerText;
        isSoldout = text.includes("품절");
      }

      const soldoutEl3 = document.querySelector(".prod-not-find-unknown__p");
      if (soldoutEl3) {
        const text = soldoutEl3.innerText;
        isSoldout = text.includes("종료");
      }
    } catch (e) {
      isSoldout = false;
      console.error("❌ 품절 오류:", e);
    }

    // 가격
    try {
      const priceEl = document.querySelector(
        ".major-price-coupon .total-price",
      );
      const priceText = priceEl.innerText;
      crawlPrice = extractPrice(priceText);
      console.log("✅ 가격 추출 성공:", crawlPrice);
    } catch (e) {
      crawlPrice = 0;
      console.error("❌ 가격 오류:", e);
    }

    // 배송 타입
    try {
      const imgEl = document.querySelector(".delivery-badge-img");

      if (imgEl) {
        const src = imgEl.src;
        crawlDeliveryType = getDeliveryType(src);
        console.log("✅ 배송타입 추출 성공:", crawlDeliveryType);
      } else {
        console.warn("배송 이미지 요소를 찾을 수 없습니다.");
      }
    } catch (e) {
      crawlDeliveryType = 0;
      console.error("❌ 배송타입 오류:", e);
    }

    // 별점
    try {
      const el = document.querySelector(".product-buy-header .rating-star-num");
      if (el) {
        const style = el.getAttribute("style") || "";
        const widthMatch = style.match(/width:\s*([\d.]+)%/);
        const width = widthMatch ? parseFloat(widthMatch[1]) : 0;
        crawlRating = width / 20; // 100% = 5점
        console.log("✅ 별점 추출 성공:", crawlRating);
      } else {
        console.warn("별점 요소를 찾을 수 없습니다.");
      }
    } catch (e) {
      crawlRating = 0;
      console.error("❌ 별점 오류:", e);
    }

    // 리뷰 수
    try {
      const el = document.querySelector(".product-buy-header .count");
      if (el) {
        const countText = el.innerText;
        crawlReviewCount = parseInt(countText.replace(/[^0-9]/g, ""), 10) || 0;
        console.log("✅ 리뷰 수 추출 성공:", crawlReviewCount);
      } else {
        console.warn("리뷰 수 요소를 찾을 수 없습니다.");
      }
    } catch (e) {
      crawlReviewCount = 0;
      console.error("❌ 리뷰 수 오류:", e);
    }

    // 아이템이 여러개일 수 있음. 여러 카테고리에서 중복으로 들어올수 있기 때문
    for (const item of productItems) {
      let price = item.price;
      let highPrice = item.highPrice || item.price;
      let lowPrice = item.lowPrice || item.price;

      if (isSoldout) {
        lowPrice = -1;
      } else if (lowPrice > crawlPrice) {
        lowPrice = crawlPrice;
      } else {
        lowPrice = lowPrice;
      }

      const pId = item.id;

      const params = {
        id: pId,
        highPrice: highPrice < crawlPrice ? crawlPrice : highPrice,
        lowPrice,
        price: Number(crawlPrice) || Number(price),
        deliveryType: Number(crawlDeliveryType),
        rating: Number(crawlRating),
        reviewCount: Number(crawlReviewCount),
      };

      try {
        if (highPrice !== 0 && lowPrice !== 0 && price !== 0) {
          await updateCoupangData(params);
          console.log("✅ 값 업데이트 완료:", params);
        }
      } catch (e) {
        console.error("❌ 업데이트 실패:", e);
      }

      // 가격 변동이 있으면?
      console.log("Price: ", price);
      console.log("Crawl Price: ", crawlPrice);

      // 1. 가격 추이 등록
      if (isSoldout) {
        console.log("✅ 품절되어서 아무것도 하지 않습니다.");
      } else if (price !== crawlPrice) {
        console.log("✅ 가격이 변동되어 가격추이에 등록됩니다.");
        await addProductPrice(pId, crawlPrice);

        // 2. 가격 알람 하기
        console.log("✅ 가격이 변동되어 사용자에게 푸시알람을 보냅니다.");
        await alarmNotify(item, crawlPrice);
      } else {
        console.log("✋ 가격 변동없음");
      }

      // 대기열 업데이트
      if (pId) {
        // 삭제
        console.log(`✅ 대기열 업데이트(${pId})`);
        await updateCrawl(pId);
      }
    }
  }

  console.log("5초 후에 닫힙니다.");
  setTimeout(() => {
    window.close();
  }, 60000);
};

initSidebarLogger();
run();
