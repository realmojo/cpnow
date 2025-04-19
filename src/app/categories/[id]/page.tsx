import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: {
    id: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;

  // 예시: 유효하지 않은 ID 처리
  if (!["1", "2", "3"].includes(id)) {
    notFound(); // 404 처리
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold">Category ID: {id}</h1>
      <p>This page displays content for category #{id}.</p>
    </div>
  );
}
