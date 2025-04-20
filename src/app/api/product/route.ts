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

  const referer = `https://coupang.com/vp/products/${productId}?itemId=${itemId}&vendorItemId=${vendorItemId}&isAddedCart=`;
  myHeaders.append("Host", "www.coupang.com");
  myHeaders.append("Connection", "keep-alive");
  myHeaders.append("sec-ch-ua-platform", '"macOS"');
  myHeaders.append("X-Requested-With", "XMLHttpRequest"); // 또는 빈 문자열 가능
  myHeaders.append(
    "User-Agent",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
  );
  myHeaders.append("Accept", "*/*");
  myHeaders.append(
    "sec-ch-ua",
    '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
  );
  myHeaders.append("sec-ch-ua-mobile", "?0");
  myHeaders.append("Sec-Fetch-Site", "same-origin");
  myHeaders.append("Sec-Fetch-Mode", "cors");
  myHeaders.append("Sec-Fetch-Dest", "empty");
  myHeaders.append("Referer", referer);
  myHeaders.append("Accept-Encoding", "gzip, deflate, br, zstd");
  myHeaders.append("Accept-Language", "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7");

  // ✅ 쿠키 (필요한 최소 쿠키만 발췌, 너무 길면 서버 거부 가능)
  myHeaders.append(
    "Cookie",
    "MARKETID=4582282478309293724418; PCID=4582282478309293724418; _abck=EF7BE2B0C29338B5C33C11FD1D8D6943~-1~YAAQt+Q1FwLLYz+WAQAAE/lgUg1b34CXWvGXWV0hAypbVMaYUulB7hp4obxM+SW0UY9JvXgSY9bmDgoXMv4cyUwoAIGGfvcsfwYZI4m2P6Cbuo1N7FSbdxk4pu76IauAZAk47TYEOFhfyh34TtuAIFcmDMWPKnr4traPr4FG5zvprLY6IlWyZjhhANNuH8pdrhxlzGvVfgbvHwq/rNo6fnz418ViKd/kvbRxSb+XwfQAfj5d0OuWqcLZr+XdqwGMbtzXNqSJTSYSW804pmmuv+v9rTUm2kLnB5CEaYNOgzqCam2WAZz73HJzKdCsnqmqmUgFwE+bGML9ymQf6zdLyjCzpXn3kXO0jGORRKzRuYsD1DcDJWlZU0LWNHQ2avV1uOPHm5ewgibpZeeZbMJ7ujxGHd3GEa3ZYi4l9QrdtuZ7uRo8dWJhhui4atvW7Jzb+WGOJVEqPT96L4EDMEHJGWFyGN2LSsZvc8twBY/yibsPGECpf4iqEaek49Jj1+vfRUcsET+SPZ5/HByfcpZX8UQBs8ZqjgT3ELBDs0FAQBEic9SCJp9McO15Gz2ANr9XCdIR/TIJHpw5iR/4D6Fbxjg9Ag==~-1~-1~-1; bm_s=YAAQt+Q1FwPLYz+WAQAAE/lgUgO7OAZQwFLRvwtw1mPUnFoPYTmJ+foJ0arZN6pvqfMip6sgMf2rfN4Z2ccEqG7EvpijenEd0R/NzQdD9MWQcWxiKFZoX1B3tWlercublyjkieDsCfB9IZN1mi0QwTOKJ7Jekg5lRVOGJn9OE97drndcY7oJ6Uj7YEgPuo+4lbJXYOG7iYkXtwwjlsULH0kD1IvumCvBF8AmgIJ7h8wCzv2/Bn09YJ+SRsthGmtCVco6oHOoBSrwnBhah2pM/snYZrIt2GrSYnSBOzCajc6E+3ORyQGtg67P/DfP04Enyj1PIorRkEzCEYMO+HgeUUUyVyAJNyn7XAzPyKSOm2r9ec05SLIsXWueOQuUEp0SkYcJcpHuTszURxn8Ger4I4sFRHRkEgT93kGE63rlLSFZ8kIXlasHpY3H/pw0FAhk3FRWqTxlcKF3c78Wz/UfdADJQHxkQlaaZ8Ech05L; bm_ss=ab8e18ef4e; bm_sz=03ED3B7846696ABF0DE88FF4352D9FFC~YAAQt+Q1FwTLYz+WAQAAE/lgUhvzsynn8/aWOoWU/VAIXQiVq/NvLhAx1yYnT2+ZrBSKo7r1esq2QdaCpjMBwFr1kOW7eb2ee7mjzVW1YVe+3z5QWx5QqMSuue5UD9a8xDhoiulG4EzTf/smCRWCm/EO6kzwiJiSPuB3gkRSJ7E93PKGatzeNMF5s8MRaiwmq3Dm7x8uhd9CAnpYaFZq4qfbERnhUpuVFf2GcKFoTLYxzyFoa/En5HyTm0K5CDLadenoG9sSof9m6RF6YynlsEyM2KtDmljBvuJYCdyacQf9b3t6qPfRf8wx4fFtyaLG6ZehY2FL2XgRURNuDwS2h63JdLQZiNYsbgNijMKU7I8=~3228214~3356725; overrideAbTestGroup=%5B%5D; sid=ab0a0ce72bfb425494e3bb300e8feedc18828dd0",
  );
  const requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const url = `https://coupang.com/vp/products/${productId}/vendoritems/${vendorItemId}/quantity-info?quantity=1`;
  console.log(url);
  console.log(requestOptions);

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
