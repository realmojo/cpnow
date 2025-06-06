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
