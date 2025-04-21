"use client";

export default function MyNowPage() {
  // const { id } = use(params); // ✅ 이렇게 unwrapping 필요

  // // 예시: 유효하지 않은 ID 처리
  // if (!["1", "2", "3"].includes(id)) {
  //   notFound(); // 404 처리
  // }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold">Mynow</h1>
    </div>
  );
}
