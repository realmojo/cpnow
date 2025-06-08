// ✅ 알람등록
export const addAlarm = async (params: any): Promise<any | null> => {
  const response = await fetch(`/api/userAlarm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  const res = await response.json();

  if (!res.ok) return null;

  const data = await res.json();
  return data;
};
// ✅ 알람 삭제 함수
export const removeAlarm = async (params: any): Promise<any | null> => {
  const response = await fetch(
    `/api/userAlarm/delete?userId=${params.userId}&pId=${params.pId}`,
    {
      method: "DELETE",
    },
  );

  const res = await response.json();
  if (!res.ok) return null;
  return res.data;
};

// ✅ 키워드 조회
export const getProductsByKeyword = async (
  keyword: string,
): Promise<any | null> => {
  const response = await fetch(`/api/product/keyword?keyword=${keyword}`, {
    method: "GET",
  });
  const res = await response.json();
  if (res.length) return res;
  return null;
};

// ✅ 상품 호출 함수
export const getProductById = async (id: string): Promise<any | null> => {
  const res = await fetch(`/api/product?id=${id}`, {
    cache: "no-store", // ← SSR 시 실시간 데이터 원할 경우
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data;
};

// 쿠팡 골드박스
export const getGoldBox = async () => {
  const res = await fetch("/api/rocket/goldbox", {
    cache: "no-store", // ← SSR 시 실시간 데이터 원할 경우
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data;
};

// 쿠팡 골드박스
export const getRocketItems = async (deliveryType: string) => {
  const res = await fetch(`/api/product/rocket?type=${deliveryType}`, {
    cache: "no-store", // ← SSR 시 실시간 데이터 원할 경우
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data;
};
