import { NextRequest, NextResponse } from "next/server";
import { getTodayDate } from "@/utils/utils";
import { queryOne, queryList, insertOne, updateOne } from "@/lib/db";
import { format, subDays } from "date-fns";
interface PriceEntry {
  date: string; // "YYYY-MM-DD"
  price: number;
}

interface FilledPrice {
  date: string; // "MM-DD"
  price: number;
}

const hasValue = (value: any): boolean => {
  return value !== undefined && value !== null;
};

const generateLast30DaysPrice = (
  rawPrices: PriceEntry[] = [],
  defaultPrice: number,
  highPrice: number,
  lowPrice: number,
  endDateStr = format(new Date(), "yyyy-MM-dd"), // today by default
): FilledPrice[] => {
  const priceMap = new Map<string, number>();

  if (rawPrices.length) {
    const onlyItem = rawPrices[0];

    const prevDate = format(subDays(new Date(onlyItem.date), 1), "yyyy-MM-dd");

    rawPrices.unshift({
      date: prevDate,
      price: defaultPrice === highPrice ? lowPrice : highPrice,
    });
  }

  // ✅ 날짜 → 가격 매핑
  rawPrices.forEach(({ date, price }) => {
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
      return NextResponse.json(
        { error: "Missing id parameter" },
        { status: 400 },
      );
    }

    let query = "SELECT * FROM products WHERE id = ?";
    const product = await queryOne(query, [id]);

    product.thumbnail = product.thumbnail.replace("230x230", "600x600");

    const { lastUpdated } = product;
    // // 업데이트 시간이 다르면 크롤 웨잇에 추가
    if (
      !lastUpdated ||
      getTodayDate() !== lastUpdated.toString().substring(0, 10)
    ) {
      query = "SELECT pId FROM crawl_wait WHERE pId= ?";
      const crawlWaitItem = await queryOne(query, [id]);

      if (!crawlWaitItem) {
        query =
          "INSERT INTO crawl_wait (pId, type, regdated) VALUES (?, 'product', NOW())";
        await insertOne(query, [id]);
      }
    }

    query =
      "SELECT * FROM products p WHERE productId = ? AND id IN (SELECT MIN(id) FROM products WHERE productId = ? GROUP BY title) ORDER BY price;";
    const productItemOptions = await queryList(query, [
      product.productId,
      product.productId,
    ]);
    product.options = productItemOptions ? productItemOptions : [];

    // 가격추이 가져오기
    query =
      "SELECT DATE_FORMAT(regdated, '%Y-%m-%d') AS date, price FROM product_prices WHERE pId = ? AND regdated >= CURDATE() - INTERVAL 30 DAY ORDER BY regdated ASC;";
    const priceItems = await queryList(query, [id]);
    const priceHistory = generateLast30DaysPrice(
      priceItems,
      product.price,
      product.highPrice,
      product.lowPrice,
    );
    product.priceHistory = priceHistory;

    // ✅ 결과 반환
    return NextResponse.json(product);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: errorMessage });
  }
}

export async function POST(req: NextRequest) {
  try {
    const item = await req.json();

    const {
      id,
      lowPrice,
      highPrice,
      price,
      deliveryType,
      rating,
      reviewCount,
    } = item;

    if (
      !hasValue(id) ||
      !hasValue(lowPrice) ||
      !hasValue(highPrice) ||
      !hasValue(price) ||
      !hasValue(deliveryType) ||
      !hasValue(rating) ||
      !hasValue(reviewCount)
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid parameters" },
        { status: 400 },
      );
    }

    const query = `
      UPDATE products
      SET
        price = ?,
        lowPrice = ?,
        highPrice = ?,
        deliveryType = ?,
        rating = ?,
        reviewCount = ?,
        lastUpdated = NOW()
      WHERE id = ?
    `;

    const params = [
      price,
      lowPrice,
      highPrice,
      deliveryType,
      rating,
      reviewCount,
      id,
    ];

    await updateOne(query, params);

    return NextResponse.json({ success: true });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);

    return NextResponse.json({ success: false, error: errorMessage });
  }
}
