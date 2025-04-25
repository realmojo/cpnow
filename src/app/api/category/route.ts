import { NextRequest } from "next/server";
// import { getTodayDate } from "@/utils/utils";
import { queryList } from "@/lib/db";
// import axios from "axios";

export async function GET(req: NextRequest) {
  try {
    // ✅ URL에서 id 파라미터 추출
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    const isRandom = searchParams.get("isRandom");

    if (!categoryId) {
      return new Response(
        JSON.stringify({ error: "Missing categoryid parameter" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    let query = "";
    let categoryItems = [];
    if (isRandom) {
      query = `WITH RECURSIVE category_path AS (
  SELECT categoryId, name
  FROM categories
  WHERE categoryId = ?

  UNION ALL

  SELECT c.categoryId, c.name
  FROM categories c
  JOIN category_path cp ON c.parentId = cp.categoryId
),
random_categories AS (
  SELECT categoryId, name
  FROM category_path
  ORDER BY RAND()
  LIMIT 10
)

SELECT p.*, rc.name
FROM products p
JOIN random_categories rc ON p.categoryId = rc.categoryId order by RAND() limit 100;`;
      categoryItems = await queryList<any>(query, [categoryId]);
    } else {
      query =
        "SELECT * FROM products WHERE categoryId = ? ORDER BY RAND() LIMIT 48";
      categoryItems = await queryList<any>(query, [categoryId]);
    }

    // ✅ 결과 반환
    return new Response(JSON.stringify(categoryItems), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
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
