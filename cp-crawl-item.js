const axios = require("axios");
const mysql = require("mysql2/promise");
const moment = require("moment");

// AWS RDS 연결 설정
const pool = mysql.createPool({
  host: "cpnow.c8ksimqpxta3.ap-northeast-2.rds.amazonaws.com",
  user: "admin",
  password: "wjdaksrud123",
  database: "cpnow",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
// 문자열 가격에서 숫자 추출
const extractPrice = (priceStr) =>
  parseInt(priceStr.replace(/[^\d]/g, ""), 10) || 0;

// 배송 이미지 URL에 따른 배송 타입 추출
const getDeliveryType = (src) => {
  if (src.includes("rocket_logo")) return 1;
  if (src.includes("logoRocketMerchant")) return 2;
  if (src.includes("global_b")) return 3;
  if (src.includes("rocket-fresh")) return 4;
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
  console.log(pId, price);
  try {
    if (pId && price) {
      const query = `INSERT INTO product_prices (id, pId, price, regdated) VALUES (NULL, ${pId}, ${price}, CONVERT_TZ(NOW(), 'UTC', '+09:00'))`;
      await pool.query(query);
    }
  } catch (e) {
    console.log("addProductPrice 오류: ", e);
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
      const query = `UPDATE products SET price = ${price}, lowPrice = ${lowPrice}, highPrice = ${highPrice}, deliveryType = ${deliveryType}, rating = ${rating}, reviewCount = ${reviewCount}, lastUpdated = CONVERT_TZ(NOW(), 'UTC', '+09:00') WHERE id = ${id}`;
      console.log(query);
      await pool.query(query);
    }
  } catch (e) {
    console.log("updateCoupangData 오류: ", e);
  }
};

const getProductItem = async (id) => {
  if (id) {
    const query = `select * from products where id=${id}`;
    const [d] = await pool.query(query);

    return d[0];
  }
  return "";
};

const getCrawlList = async () => {
  const query =
    "SELECT * FROM crawl_wait WHERE lastUpdated IS NULL OR DATE(lastUpdated) != CURRENT_DATE() ORDER BY lastUpdated ASC";
  const d = await pool.query(query);
  return d[0];
};

const updateCrawl = async (pId) => {
  try {
    if (pId) {
      const query = `UPDATE crawl_wait SET lastUpdated = CONVERT_TZ(NOW(), 'UTC', '+09:00') WHERE pId=${pId}`;
      console.log(query);
      await pool.query(query);
    }
  } catch (e) {
    console.log("updateCrawl 대기열 업데이트 오류:", e);
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
    // 가격 알람 등록한 유저 가져오기
    let query = `SELECT * FROM user_alarms ua LEFT JOIN users u ON ua.userId = u.userId WHERE ua.pId = ${id}`;
    let d = await pool.query(query);
    const items = d[0];

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
        await axios.post("https://cpnow.kr/api/notify", params);
      }
    }
  } catch (e) {
    console.log("alarmNotify 오류: ", e);
  }
};

const sleepRandom30to60 = () => {
  const minMs = 30000; // 30초
  const maxMs = 60000; // 60초
  const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;

  return new Promise((resolve) => setTimeout(resolve, delay));
};

const getCoupangData = async (productId, vendorItemId) => {
  const myHeaders = new Headers();
  myHeaders.append(
    "Referer",
    `https://www.coupang.com/vp/products/${productId}?vendorItemId=${vendorItemId}&sourceType=HOME_RELATED_ADS&searchId=feed-4d7951ea43544258982baffc3ee8cfec-related_ads&clickEventId=c51c61a0-3158-11f0-989d-3151df937fd5&isAddedCart=`,
  );
  myHeaders.append(
    "Cookie",
    "PCID=9532304728558661331907; _abck=D14A13885DDCC4E270C35B3D8E6D406B~-1~YAAQBNojF+ESJs6WAQAASdS50g11dbgv423XbYAv8s/jaNK3rf0Yt3X1JTGSlzAt7ce6SFAICI0/R09h8adGT+fo+7Lv/2/OLAZjrNR1q53Hx1fyRpLDkEdl8KqUUR7+rQoFIhALfkmqPkKtAARL/vYgUrxUYbn8QZ9HeLK3YVT5cLFdmyokUwdMYNurG2PcUOSdZpMlG9zluYKspz1B8ddHRdZdW7mN0Mnw0Vlj8g3UkUALr1RMj69kAO9V7ePl+bauk1MZqZCqDuuZWHSIRloY6prC3vyVRzTerH9b9xA+h1HnHVTWKHsswUILoUvhPcNKUz5S8kTaBOJVHW6flothiOQXECk+8+Cu9bURrGv6UwQKXGalxjhBcCRpkfX0r3e6NjXc0XOuK8V5b//xwszcu9fToQuca4LTmyCXjIe2tTmfNRHJpH2Ryeox6mMc2MM=~-1~-1~-1; bm_s=YAAQBNojF/9EJs6WAQAAyCK60gMcDOXiE24Wuo9tFtJtONoIJUdO22VFMoYb/3TdFBwd0fjLun8McZZ/F4AKA+9kiPBd+lrArUYTQYn9eo6jojw8dlHNhlLYv4tktVFWpBQEu+mD4O3LVrsBQzDGR99eLMmtjZt+sHeRydOkJbM3MPiNhBOiqY83DCyuzgR0uI8BJQdG3RPuBRtgDkpBfaxKDXD/peORT0Eu8EgIr4cJmZU8V2IPXN6OQTmHi14RjMJ66VJsYdMrZxewe42U5vWFR/tZt2gADfwmxT1zj762Flx8g/DVvlBuinhbYUtxkIomLkdJ31czb3hYVLOt4HIqvRFQKBmVvrLilBxzoxmyu5SmAYj78zjNkUkddcsyPhfNtUwNg7/aVPj9Q439EDb0Lgash78WfZ0YC8c1uaGjTVrl0kujD+5qDlmivFSu9+0rvhAFnwKBAMdRQrhq13mBnUsh0xPXcJqKxJ+bbFThFCWzdJoBpXbB1rsOM6KW44kzq9Xvq+jShIwbQJ0YfpwLQZAqHgTS8EeDdjzY1tGAYoC9XQAjYzaRYDK3YkW9A6/GbJO+d6Stgrmhj5Q=; bm_ss=ab8e18ef4e; bm_sz=82FB8556DA736DE9B01A370ED8CC1317~YAAQBNojF+MSJs6WAQAASdS50htOaQoKmOLlj3Y2yq4Gn+wKF8AbTfpVUaBgPQK1iUT6vg2uTH8c8L/t9saLS5wdQa3i/DMyGc33nOvuOLg03ibf/fD9vNCE0PXBKAZ7oJ1ldnvdDpM0X3uLCLPCIeM3owEXHfCdA7o9yqqyOtlkriNia4A2Ns3owmWUbrAS3mbaO+Reg3/v0KEnPp3Gyug3pRl4sRi8R6u162PjSpPuRJOWlr/DWJPRRR2gx+ZbJN3+CmfDIYg3taLIdshm7yOo1HxapKwHBfF52Mq7vgatOusvEZtaT4WXbgZSzpY2WCtLltvUW5DfOgSHoeQw3So7ik4l2ejUrYBu7Q2K~3618372~3686711; overrideAbTestGroup=%5B%5D; sid=849a54e596854b1aae78eb4185201fcded793bb1",
  );

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch(
    `https://www.coupang.com/vp/products/${productId}/vendoritems/${vendorItemId}/quantity-info?quantity=1`,
    requestOptions,
  )
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
};

const run = async () => {
  while (1) {
    const data = await getCrawlList();

    if (data && data.length > 0) {
      for (const item of data) {
        const { pId } = item;
        const productItem = await getProductItem(pId);
        let { link, highPrice, lowPrice, price } = productItem;

        highPrice = highPrice || price;
        lowPrice = lowPrice || price;

        await page.goto(link);
        console.log("잠시 기다림... 30초에서 1분 사이..");
        await sleepRandom30to60(); // 잠시 기다림
        let isSoldout = false;
        let crawlPrice = 0;
        let crawlDeliveryType = 0;
        let crawlRating = 0;
        let crawlReviewCount = 0;

        // 품절 체크
        try {
          const soldoutEl = await page.$(".prod-not-find-known__buy__button");
          if (soldoutEl) {
            const text = await page.evaluate((el) => el.innerText, soldoutEl);
            isSoldout = text.includes("품절");
          }
        } catch (e) {
          isSoldout = false;
        }

        // 가격
        try {
          const priceEl = await page.waitForSelector(
            ".major-price-coupon .total-price",
            {
              visible: true, // 요소가 보일 때까지
              timeout: 10000, // 최대 10초 대기 후 에러 (조절 가능)
            },
          );
          if (priceEl) {
            const priceText = await page.evaluate(
              (el) => el.innerText,
              priceEl,
            );
            crawlPrice = extractPrice(priceText);
          }
        } catch (e) {
          crawlPrice = 0;
          console.error("❌ 가격 오류:", e);
        }

        // 배송 타입
        try {
          const imgEl = await page.$("img.delivery-badge-img");
          if (imgEl) {
            const src = await page.evaluate((el) => el.src, imgEl);
            crawlDeliveryType = getDeliveryType(src);
          }
        } catch (e) {
          crawlDeliveryType = 0;
          console.error("❌ 배송타입 오류:", e);
        }

        // 별점
        try {
          const style = await page.$eval(
            ".prod-buy-header__productreview .rating-star-num",
            (el) => el.getAttribute("style") || "",
          );
          const widthMatch = style.match(/width:\s*([\d.]+)%/);
          const width = widthMatch ? parseFloat(widthMatch[1]) : 0;
          crawlRating = width / 20;
        } catch (e) {
          crawlRating = 0;
          console.error("❌ 별점 오류:", e);
        }

        // 리뷰 수
        try {
          const countText = await page.$eval(
            ".prod-buy-header__productreview .count",
            (el) => el.innerText,
          );
          crawlReviewCount =
            parseInt(countText.replace(/[^0-9]/g, ""), 10) || 0;
        } catch (e) {
          crawlReviewCount = 0;
          console.error("❌ 리뷰 수 오류:", e);
        }

        const params = {
          id: pId,
          highPrice: highPrice < crawlPrice ? crawlPrice : highPrice,
          lowPrice: !isSoldout
            ? lowPrice > crawlPrice
              ? crawlPrice
              : lowPrice
            : -1,
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
        // 1. 가격 추이 등록
        if (price !== crawlPrice) {
          console.log("✅ 가격이 변동되어 가격추이에 등록됩니다.");
          await addProductPrice(pId, crawlPrice);

          // 2. 가격 알람 하기
          console.log("✅ 가격이 변동되어 사용자에게 푸시알람을 보냅니다.");
          await alarmNotify(productItem, crawlPrice);
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
    // 잠시 대기
    console.log(
      `⏰ 한 바퀴 다돌아서 5분(${moment().format("YYYY-MM-DD hh:mm:ss")}) 대기`,
    );
    await new Promise((res) => setTimeout(res, 60000 * 5));

    await sleep(1000);
  }
};

run();
