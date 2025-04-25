import { NextRequest } from "next/server";
import { getTodayDate } from "@/utils/utils";
import { queryOne, queryList, insertOne } from "@/lib/db";
import { format, subDays } from "date-fns";
interface PriceEntry {
  date: string; // "YYYY-MM-DD"
  price: number;
}

interface FilledPrice {
  date: string; // "MM-DD"
  price: number;
}

const generateLast30DaysPrice = (
  rawPrices: PriceEntry[] = [],
  defaultPrice: number,
  endDateStr = format(new Date(), "yyyy-MM-dd"), // today by default
): FilledPrice[] => {
  const priceMap = new Map<string, number>();

  // ✅ 날짜 → 가격 매핑
  rawPrices.forEach(({ date, price }) => {
    console.log(date, price);
    priceMap.set(date, price);
  });

  const endDate = new Date(endDateStr);
  const result: FilledPrice[] = [];

  // ✅ 초기값: rawPrices가 있을 경우 → 가장 과거의 값, 없으면 defaultPrice
  let lastKnownPrice: number =
    rawPrices.length > 0
      ? rawPrices.sort((a, b) => a.date.localeCompare(b.date))[0].price
      : defaultPrice;

  for (let i = 29; i >= 0; i--) {
    const currentDate = subDays(endDate, i);
    const key = format(currentDate, "yyyy-MM-dd");
    const label = format(currentDate, "MM-dd");

    // 오늘 날짜 (마지막)은 무조건 defaultPrice 사용
    if (i === 0) {
      result.push({
        date: label,
        price: defaultPrice,
      });
    } else {
      if (priceMap.has(key)) {
        lastKnownPrice = priceMap.get(key)!;
      }

      result.push({
        date: label,
        price: lastKnownPrice,
      });
    }
  }

  return result;
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

    let query = "SELECT * FROM products WHERE id = ?";
    const product = await queryOne(query, [id]);

    product.thumbnail = product.thumbnail.replace("230x230", "600x600");

    const { lastUpdated } = product;
    // // 업데이트 시간이 다르면 크롤 웨잇에 추가
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
      query = "SELECT id FROM crawl_wait WHERE cpId= ?";
      const crawlWaitItem = await queryOne(query, [id]);

      if (!crawlWaitItem) {
        query = "INSERT INTO crawl_wait (id, cpId) VALUES (NULL, ?)";
        await insertOne(query, [id]);
      }
    }

    // 가격추이 가져오기
    query =
      "SELECT DATE_FORMAT(regdated, '%Y-%m-%d') AS date, price FROM product_prices WHERE productId = ? AND regdated >= CURDATE() - INTERVAL 30 DAY ORDER BY regdated ASC;";
    const priceItems = await queryList(query, [id]);
    console.log(priceItems);

    const priceHistory = generateLast30DaysPrice(priceItems, product.price);
    product.priceHistory = priceHistory;

    // ✅ 결과 반환
    return new Response(JSON.stringify(product), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.log(err);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
