import { NextRequest } from "next/server";
import { getTodayDate } from "@/utils/utils";
import axios from "axios";

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

    const { lastUpdated } = data;

    data.thumbnail = data.thumbnail.replace("230x230", "600x600");

    // 업데이트 시간이 다르면 크롤 웨잇에 추가
    if (!lastUpdated || getTodayDate() !== lastUpdated.substring(0, 10)) {
      // const nowPrice = coupangItem[0].moduleData[3].priceInfo.finalPrice.price
      //   ? coupangItem[0].moduleData[3].priceInfo.finalPrice.price
      //   : coupangItem[0].moduleData[1].detailPriceBundle.finalPrice
      //       .bestPriceInfo.price;

      // const params = {
      //   id,
      //   highPrice: nowPrice >= price ? nowPrice : price,
      //   lowPrice: nowPrice <= price ? nowPrice : price,
      // };
      const addCrawlWaitId = `https://api.mindpang.com/api/coupang/addCoupangCrawlwait.php?cpId=${id}`;
      await axios.get(addCrawlWaitId);
    }
    // ✅ 결과 반환

    return new Response(
      JSON.stringify({
        ...data,
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
