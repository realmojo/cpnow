import { NextRequest } from "next/server";
import { getTodayDate } from "@/utils/utils";
import axios from "axios";

type ProductParam = {
  productId: string;
  vendorItemId: string;
  itemId: string;
};

const getCoupangItemRequest = async (params: ProductParam) => {
  const { productId, vendorItemId, itemId } = params;

  // const cookies = [
  //   "bm_s=YAAQVOQ1F3S39UCWAQAAc/5eUQNXfoQxzss9odfJG5/m9n6o34upZeEZmHAXswiR5AKiO+dj5CTzLY0u9hAwbuOlD/TNm/RhhrhldxnRC25hFWM6SMcSi9xMpUyCSzR4+e0CRgCTfY6h1xqqK86QHE5hwTpeg3uDq2HKmidJRa7FuAOeIx9bEh0XsadTk4a0u9f5Y0Zr7vOUgTgkzRkmV1OS4zshKJ8iuTYoLRkHvyQOFHC3QwQtzTO5bk9OMRLIcZyJPPO0j3IDoZuduVif3P8nY2AfhcXY8C6YDW3qDIaUEt77i2Is4+HaWv54tMmYqhpm5b4abf1GfKJyhky0wIZTJbWqm5pYinBZ30MbMX5cgRVo2mabqzGunltMnMCtc++XJhjbVghdWt70s1UkaAYuAISpGddKphXWUiHSnDHYMUrd0jv7+4D97ac5h8QU1aw0UKlCSi2+F8iWPPhIU4uxfagqreTSLZM=",
  // ];
  const myHeaders = new Headers();

  const referer = `https://coupang.com/vp/products/${productId}?itemId=${itemId}&vendorItemId=${vendorItemId}`;
  myHeaders.append("Referer", referer);

  const requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
    // redirect: "follow",
  };

  const url = `https://coupang.com/vp/products/${productId}/vendoritems/${vendorItemId}/quantity-info?quantity=1`;

  try {
    const response = await fetch(url, requestOptions);
    const json = await response.json();
    return json;
  } catch (e) {
    return {
      error: `🚨 쿠팡 수량 조회 실패: productId(${productId}), vendorItemId(${vendorItemId}), itemId(${itemId}): `,
      e,
    };
  }

  // const { productId, vendorItemId, itemId } = params;

  // const url = `https://www.coupang.com/vp/products/${productId}/vendoritems/${vendorItemId}/quantity-info?quantity=1`;

  // try {
  //   const referer = `https://www.coupang.com/vp/products/${productId}?itemId=${itemId}&vendorItemId=${vendorItemId}`;
  //   const cookies = [
  //     "bm_s=YAAQVOQ1F3S39UCWAQAAc/5eUQNXfoQxzss9odfJG5/m9n6o34upZeEZmHAXswiR5AKiO+dj5CTzLY0u9hAwbuOlD/TNm/RhhrhldxnRC25hFWM6SMcSi9xMpUyCSzR4+e0CRgCTfY6h1xqqK86QHE5hwTpeg3uDq2HKmidJRa7FuAOeIx9bEh0XsadTk4a0u9f5Y0Zr7vOUgTgkzRkmV1OS4zshKJ8iuTYoLRkHvyQOFHC3QwQtzTO5bk9OMRLIcZyJPPO0j3IDoZuduVif3P8nY2AfhcXY8C6YDW3qDIaUEt77i2Is4+HaWv54tMmYqhpm5b4abf1GfKJyhky0wIZTJbWqm5pYinBZ30MbMX5cgRVo2mabqzGunltMnMCtc++XJhjbVghdWt70s1UkaAYuAISpGddKphXWUiHSnDHYMUrd0jv7+4D97ac5h8QU1aw0UKlCSi2+F8iWPPhIU4uxfagqreTSLZM=",
  //   ];
  //   console.log(cookies.join("; "));
  //   const res = await got
  //     .get(url, {
  //       headers: {
  //         Referer: referer,
  //         Cookie: cookies.join("; "),
  //       },
  //       timeout: {
  //         response: 3000,

  //       },
  //     })
  //     .json();
  //   console.log(res);
  //   return res;
  // } catch (e: any) {
  //   console.log(e);
  //   return {
  //     error: `🚨 Puppeteer 수량 조회 실패: productId(${productId}), vendorItemId(${vendorItemId}), itemId(${itemId})`,
  //     message: e.message,
  //   };
  // }
};

export async function GET(req: NextRequest) {
  try {
    // ✅ URL에서 id 파라미터 추출
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ error: "Missing id parameter" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ✅ 외부 API 호출
    const { data } = await axios.get(
      `https://api.mindpang.com/api/coupang/getItemById.php?id=${id}`,
    );

    const { productId, vendorItemId, itemId, lastUpdated, price } = data;

    data.thumbnail = data.thumbnail.replace("230x230", "600x600");

    const coupangItem: any = await getCoupangItemRequest({
      productId,
      vendorItemId,
      itemId,
    });
    console.log("coupangItem", coupangItem[0] ? true : false);

    // 새롭게 가격을 가져옴
    if (!lastUpdated || getTodayDate() !== lastUpdated.substring(0, 10)) {
      const nowPrice = coupangItem[0].moduleData[3].priceInfo.finalPrice.price
        ? coupangItem[0].moduleData[3].priceInfo.finalPrice.price
        : coupangItem[0].moduleData[1].detailPriceBundle.finalPrice
            .bestPriceInfo.price;

      const params = {
        id,
        highPrice: nowPrice >= price ? nowPrice : price,
        lowPrice: nowPrice <= price ? nowPrice : price,
      };

      const updateUrl = `https://api.mindpang.com/api/coupang/updatePrice.php`;
      await axios.post(updateUrl, params);
    }
    // ✅ 결과 반환

    return new Response(
      JSON.stringify({
        ...data,
        info: coupangItem[0] ?? {},
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);

    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
