import ProductModalPage from "@/src/app/@modal/(.)product/[id]/page";

export default async function ProductPage({ params }: any) {
  const { id } = await params;
  return <ProductModalPage params={params} />;
}
