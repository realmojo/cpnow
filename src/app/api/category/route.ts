import { NextRequest, NextResponse } from "next/server";
import { queryList } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    // ✅ URL에서 id 파라미터 추출
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    const isRandom = searchParams.get("isRandom");
    const withCategory = searchParams.get("withCategory") === "true";

    if (!categoryId) {
      return NextResponse.json(
        { error: "Missing categoryid parameter" },
        { status: 400 },
      );
    }

    let query = "";
    let items = [];
    let categories = [];
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
      items = await queryList<any>(query, [categoryId]);
    } else {
      query =
        "SELECT * FROM products WHERE categoryId = ? ORDER BY RAND() LIMIT 48";
      items = await queryList<any>(query, [categoryId]);
    }

    if (withCategory) {
      query = `WITH RECURSIVE children AS (
  -- 현재 카테고리 포함
  SELECT categoryId, parentId, name, depth
  FROM categories
  WHERE categoryId = ?

  UNION ALL

  -- 자식 재귀 탐색
  SELECT c.categoryId, c.parentId, c.name, c.depth
  FROM categories c
  JOIN children ch ON c.parentId = ch.categoryId
),
parents AS (
  -- 현재 카테고리 포함
  SELECT categoryId, parentId, name, depth
  FROM categories
  WHERE categoryId = ?

  UNION ALL

  -- 부모 재귀 탐색
  SELECT c.categoryId, c.parentId, c.name, c.depth
  FROM categories c
  JOIN parents p ON p.parentId = c.categoryId
)

-- 전체: 상위 부모 + 현재 + 하위 자식
SELECT * FROM parents
UNION
SELECT * FROM children ORDER BY depth ASC;`;
      categories = await queryList<any>(query, [categoryId, categoryId]);
    }
    // ✅ 결과 반환
    return NextResponse.json({
      items,
      categories,
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);

    return NextResponse.json({ success: false, error: errorMessage });
  }
}
