import { queryList } from "@/lib/db";

// ✅ 크롤링 대기
export async function GET() {
  try {
    const query =
      "SELECT * FROM crawl_wait WHERE lastUpdated IS NULL OR DATE(lastUpdated) != CURRENT_DATE() ORDER BY lastUpdated ASC;";
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
