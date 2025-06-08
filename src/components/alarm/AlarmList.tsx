"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { getUserAuth } from "@/utils/utils";

interface AlarmItem {
  aId: number;
  pId: number;
  title: string;
  comment: string;
  isReaded: number;
  regdated: string;
  thumbnail: string;
}

const getMyAlarmList = async (userId: string): Promise<AlarmItem[]> => {
  try {
    const { data } = await axios.get(`/api/alarms?userId=${userId}`); // 실제로는 세션 기반 userId 사용 권장
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    return [];
  }
};

const AlarmList = () => {
  const [alarms, setAlarms] = useState<AlarmItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlarms = async () => {
      const auth = getUserAuth();
      if (auth.userId) {
        const data = await getMyAlarmList(auth.userId);
        setAlarms(data);
      }
      setLoading(false);
    };

    fetchAlarms();
  }, []);

  const formatDate = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);

    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) {
      return "방금 전";
    }

    if (diffMin < 60) {
      return `${diffMin}분 전`;
    }

    if (diffHour < 24) {
      return `${diffHour}시간 전`;
    }

    if (diffDay === 1) {
      return "어제";
    }

    return date.toLocaleDateString("ko-KR", {
      month: "long", // 예: 6월
      day: "numeric", // 예: 8일
    });
  };

  return (
    <article>
      <section className="mx-auto w-full max-w-[800px] space-y-10 px-4">
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            </div>
          </div>
        )}
        {!loading && alarms.length === 0 && (
          <div className="flex min-h-[calc(100vh-64px)] items-start justify-center">
            <div className="w-full max-w-md bg-white p-6 text-center">
              <div className="mb-6">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <svg
                    className="h-8 w-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9zM13.73 21a2 2 0 01-3.46 0"
                    />
                  </svg>
                </div>
                <h2 className="mb-2 text-2xl font-bold text-gray-900">
                  알림이 없습니다
                </h2>
                <p className="text-sm text-gray-600">
                  아직 가격이 변동된 알림이 없어요.
                  <br />
                  관심 있는 상품에 가격 알림을 설정해보세요!
                </p>
              </div>

              <p className="mt-4 text-xs text-gray-400">
                변동된 알림은 이곳에서 확인할 수 있어요.
              </p>
            </div>
          </div>
        )}
        {!loading && alarms.length > 0 && (
          <Table className="w-full table-fixed">
            <TableBody>
              {alarms.map((alarm) => (
                <TableRow
                  key={`alarm-${alarm.aId}`}
                  className="hover:bg-muted/50 block cursor-pointer border-b transition-colors md:table-row md:border-none"
                >
                  <TableCell colSpan={3} className="p-0 !whitespace-normal">
                    <Link
                      href={`/product/${alarm.pId}`}
                      className="flex items-start gap-3 py-3 md:table-row"
                    >
                      {/* 썸네일 영역 */}
                      <div className="shrink-0 md:w-[100px] md:align-middle">
                        <Image
                          src={alarm.thumbnail}
                          alt={alarm.title}
                          width={80}
                          height={80}
                          className="h-[60px] w-[60px] rounded-md object-cover md:h-[80px] md:w-[80px]"
                        />
                      </div>

                      {/* 텍스트 설명 + 날짜 */}
                      <div className="flex min-w-0 flex-1 flex-col justify-between md:table-cell md:align-middle">
                        <div className="text-primary line-clamp-2 pb-1 text-sm font-medium break-words">
                          {alarm.title}
                        </div>
                        <p className="text-xs break-words whitespace-normal text-gray-600">
                          {alarm.comment}
                        </p>
                        <div className="mt-1 flex justify-start text-xs text-gray-400">
                          {formatDate(alarm.regdated)}
                        </div>
                      </div>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>
    </article>
  );
};

export default AlarmList;
