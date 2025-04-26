import { queryOne } from "@/lib/db";

export async function GET() {
  try {
    // ✅ 전체 개수
    const query = "SELECT count(*) as cnt FROM products";
    const count = await queryOne(query);

    // ✅ 결과 반환
    return new Response(JSON.stringify(count), {
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
