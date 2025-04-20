import { NextRequest } from "next/server";
import { getTodayDate } from "@/utils/utils";
import axios from "axios";
type ProductParam = {
  productId: string;
  vendorItemId: string;
  itemId: string;
};

const getCoupangItemRequest = async (params: ProductParam) => {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    const { productId, vendorItemId, itemId } = params;
    myHeaders.append(
      "Referer",
      `https://www.coupang.com/vp/products/${productId}?itemId=${vendorItemId}&vendorItemId=${itemId}`,
    );
    // myHeaders.append(
    //   "User-Agent",
    //   "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    // );
    // myHeaders.append(
    //   "Cookie",
    //   "bm_s=YAAQDNojF8mAiEiWAQAAv47rSAPzX9vBQgD46eyg3ZZBP297KPcVCjsZjNdX01Nc8WjoBkU4HSIla1U9xtiM2VzeM6VBHl7p2gnXX25sTvRrkBgQnDeQz8pfq4gWuLNf+tB4V75H8ws4/WCJhTY1oDsU++9xjMy7rxiy7N8QfExz3jRcAter6BkXbpq9qTmsOAkI7bZ9D1eC0hTBoTrLBPbakJMvzqjZnAELA9QIzP6jPjCIdNFqcwmnZ2By/J/x9efMaX76w+hmkS2YVopBmhoKN9tE9Vmg02svD1F1OQJB+GsxBmcRWgxjbXHlqhkqCluortVKZLRDXUm0WRxbTnF7eY2epPHzZeX3GSYundH8bLk0BBY2hu9y0D5xSDiboiBEvLrBdJ4SYbLolFlYRTzU/i7xZkaM/HN6PHRHYbGhfaJPIvLijmiLzqTQp6Ht1gxN69iC0+euVQ==;",
    // );
    myHeaders.append("Accept", "*/*");
    myHeaders.append("Accept-Encoding", "gzip, deflate, br, zstd");
    myHeaders.append("Accept-Language", "ko-KR,ko;q=0.9");

    console.log(myHeaders);

    const requestOptions: RequestInit = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const url = `https://www.coupang.com/vp/products/${productId}/vendoritems/${vendorItemId}/quantity-info?quantity=1`;
    console.log(requestOptions);

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => resolve(result))
      .catch(() =>
        reject(
          `🚨 쿠팡 수량 조회 실패: productId(${productId}), vendorItemId(${vendorItemId}), itemId(${itemId})`,
        ),
      );
  });

  // const { productId, vendorItemId, itemId } = params;

  // const url = `https://www.coupang.com/vp/products/${productId}/vendoritems/${vendorItemId}/quantity-info?quantity=1`;
  // console.log(123);
  // try {
  //   console.log(url);
  //   const response = await axios.get(url, {
  //     headers: {
  //       Referer: `https://www.coupang.com/vp/products/${productId}?itemId=${vendorItemId}&vendorItemId=${itemId}`,
  //       "User-Agent":
  //         "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  //       Cookie:
  //         "bm_s=YAAQDNojF8mAiEiWAQAAv47rSAPzX9vBQgD46eyg3ZZBP297KPcVCjsZjNdX01Nc8WjoBkU4HSIla1U9xtiM2VzeM6VBHl7p2gnXX25sTvRrkBgQnDeQz8pfq4gWuLNf+tB4V75H8ws4/WCJhTY1oDsU++9xjMy7rxiy7N8QfExz3jRcAter6BkXbpq9qTmsOAkI7bZ9D1eC0hTBoTrLBPbakJMvzqjZnAELA9QIzP6jPjCIdNFqcwmnZ2By/J/x9efMaX76w+hmkS2YVopBmhoKN9tE9Vmg02svD1F1OQJB+GsxBmcRWgxjbXHlqhkqCluortVKZLRDXUm0WRxbTnF7eY2epPHzZeX3GSYundH8bLk0BBY2hu9y0D5xSDiboiBEvLrBdJ4SYbLolFlYRTzU/i7xZkaM/HN6PHRHYbGhfaJPIvLijmiLzqTQp6Ht1gxN69iC0+euVQ==;",
  //     },
  //     // maxRedirects: 5, // redirect: 'follow' 대체
  //   });

  //   return response.data;
  // } catch (error) {
  //   console.error("🚨 쿠팡 수량 조회 실패:", error);
  //   throw new Error("Coupang quantity info fetch failed");
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

    console.log(1, lastUpdated, getTodayDate());
    const coupangItem: any = await getCoupangItemRequest({
      productId,
      vendorItemId,
      itemId,
    });

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
      JSON.stringify({ ...data, info: coupangItem[0] ? coupangItem[0] : {} }),
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
