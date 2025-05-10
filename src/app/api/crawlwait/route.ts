import { NextRequest } from "next/server";
import { insertOne, queryList } from "@/lib/db";

// ✅ 크롤링 대기
export async function GET() {
  try {
    const query =
      "SELECT * FROM crawl_wait WHERE lastUpdated IS NULL OR DATE(lastUpdated) != CURRENT_DATE() ORDER BY type, lastUpdated ASC LIMIT 100";
    const items = await queryList<any>(query);

    // ✅ 결과 반환
    return new Response(JSON.stringify(items), {
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
// ✅ 크롤링 대기
export async function POST(req: NextRequest) {
  try {
    const reqItems = await req.json();
    const { pId } = reqItems;

    if (!pId) {
      throw new Error("no parameter");
    }

    const query =
      "UPDATE crawl_wait SET lastUpdated = CONVERT_TZ(NOW(), 'UTC', '+09:00') WHERE pId = ?";

    await insertOne(query, [pId]);

    // ✅ 결과 반환
    return new Response(JSON.stringify({ success: true, data: "ok" }), {
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

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pId = searchParams.get("pId");
    if (!pId) {
      throw new Error("no parameter");
    }

    const query = "DELETE FROM crawl_wait WHERE pId= ?";
    await insertOne(query, [pId]);

    return new Response(JSON.stringify({ success: true, data: "ok" }), {
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
