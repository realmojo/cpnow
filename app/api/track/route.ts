import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { gotScraping } from "got-scraping";

export async function GET(request: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase 설정이 완료되지 않았습니다." },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  // Default values from user's example
  const productId = searchParams.get("productId") || "7278524488";
  const vendorItemId = searchParams.get("vendorItemId") || "75816234282";

  // http://localhost:3000/api/track?productId=7278524488&vendorItemId=80103532831&itemId=12837912345
  console.log("productId:", productId);
  console.log("vendorItemId:", vendorItemId);

  if (!productId || !vendorItemId) {
    return NextResponse.json(
      {
        error:
          "Missing required parameters: productId, vendorItemId, or itemId",
      },
      { status: 400 }
    );
  }

  try {
    // 1. Coupang API 호출 (got-scraping 사용)
    // 일반 Axios/Fetch 요청은 Akamai Bot Manager에 의해 TLS Fingerprint 단계에서 차단될 수 있습니다.
    // got-scraping은 실제 브라우저와 동일한 TLS Handshake와 헤더 순서를 생성하여 이를 회피합니다.

    // URL에 필요한 파라미터 추가
    const targetUrl = `https://www.coupang.com/next-api/products/quantity-info?productId=${productId}&vendorItemId=${vendorItemId}`;

    // 쿠키 문자열 (사용자가 제공한 최신 쿠키)
    const cookies = [
      "x-coupang-target-market=KR",
      "x-coupang-accept-language=ko-KR",
      "PCID=17657296791180871593395",
      // "bm_ss=ab8e18ef4e",
      // "bm_lso=D932487F9FE23AE51A88C9DA4EB3A5E4F34E0500C842E6630DB689F037AB244C~YAAQrIj+eToj/7iaAQAA+0m4HQYgGrAXthsk+/Bs6n8vSU/o1vCkE8JS2vFcVbKdSrL+v+DdV65lQOz1zfIJguzBD8XwHkRT20JBYiBF0sY6PEQKY5l99/tsE6nFxWQyOfMc7msTKEFLAKWOeuklozwFKKxh5+uWjXXxweq95HRNBd7lQHt1q0nKq7ka2CbgZRnAa0CprMbrXsRUTbNPTt+3wr9W8NIGocotT6lDo3CgfE7ogXMzLlYk84VszxWsDqjsmfFJuaLXuwzRPZOfJ6DTfBSJlhiJYZWGD5ZUJhGhQzKsfmUKQ/6V4FNf1hsAgRvQA6PDzzO620ZBM8gmq8ZyD8CNxBRMjB2bpCqDPwd7YoRRuCpLUHqtmbLeELYSKXAkdyiSPBk9hB+pmB/um96S4XSv4hZmjAxA6J7OClTHlryBtj1UoNUYbDW8mMObQc/6FneSfPgdrsZ9o4ouNg==~1765729680300",
      // "ak_bmsc=980A6B0ADD807517089ED728FADD3338~000000000000000000000000000000~YAAQfoj+eSpIn7WaAQAAxL2wHR5iI8ipjV7SXQU2qdtq/GSf6mh/XZfMXMLC+HTrL6bWA8VscBG3xToFJCe69TiSXFlDKoNiL5sxpu0tf3xAE1u3Qj+WU3RKxVNZL7OJ2jGTU21vWBFEk8BHPzjIssoQmtPKr+TJ1e+WSoybg6LUUs8PJYcO/chQ1EQB8h93em4OtN7r+hoicH6rQrKJhdv/RpjeMV3XBKoYLFE8E3EJHQA8K7iFuaus/50j5vNZbABcbLizxDXIP9kgRpe9ke4oFsESBX4THULm7TiFdp5RVJEsSF93+sxgTug3ZZQMfT3MU5sndDdXFJTdkboXQWR6MqzetX7t7GtWYvefGOnW2F4+kKXqt3jbRoqoezV1Swc73iKLQUeh+gtyfnHXGxZCMOLVdkYuwMLryiDcHWN3PjGfcOOY0I0zaNhUUHOeBNKPX97nKogPQMNGDirTWQ==",
      // "sid=bcbb71f5df6c41fe8b20078bd499717dc8685cf5",
      // "bm_s=YAAQrIj+eTkj/7iaAQAA+0m4HQSaYOJ7JOdnr8tN/UMvlSgxFX/ASdRPGz0kxvkXOLiTgMA1N3yNtootBQSRRl3ELSwYtQsZvHfyK0FVtnPZFZBDlsQPNcDb+ljBzkLS/nEk0WaPF7bZ1IlZR7H3Yd0Gkk4HaB/fcJm+gIMOwlTYvE150OY++CCvTKxc/7gn6PFMq0FCoBlVHw/n6iaUaRDkbaXz1Ed/bbZOm17geYCqEx3kUmlIhHQmOKk2pSm44rVe6U7yfGxT8JFsNC/tNnHvjLUS9VVrKiN86gE7L/8hZ5OlZfBFXc8tdRynVa6Hpn7nIBOS6G9WnZ+jroZweemFmZHnEBFEehlWplBoWgYxnbhmMfitK+dm/Klvnwe9HbGskIC6I4FpaP+owWZAxYeCHJjTX5jEFUMD7bBuorLi9llemY6an7F2hJWqQhIsRetH7WilOjYKRN57pksAYJDd+ZXtL64IJJydFLq7HnmeFLH6OTo4s2ndyrzzoXsZU9oyXFVn9u7bWcHC69OdLU1rFRDDAca9DZMVCxvEw15OVLDrj/q8TBZYefsfxtUqU9xo4pU0",
      // "bm_so=D932487F9FE23AE51A88C9DA4EB3A5E4F34E0500C842E6630DB689F037AB244C~YAAQrIj+eToj/7iaAQAA+0m4HQYgGrAXthsk+/Bs6n8vSU/o1vCkE8JS2vFcVbKdSrL+v+DdV65lQOz1zfIJguzBD8XwHkRT20JBYiBF0sY6PEQKY5l99/tsE6nFxWQyOfMc7msTKEFLAKWOeuklozwFKKxh5+uWjXXxweq95HRNBd7lQHt1q0nKq7ka2CbgZRnAa0CprMbrXsRUTbNPTt+3wr9W8NIGocotT6lDo3CgfE7ogXMzLlYk84VszxWsDqjsmfFJuaLXuwzRPZOfJ6DTfBSJlhiJYZWGD5ZUJhGhQzKsfmUKQ/6V4FNf1hsAgRvQA6PDzzO620ZBM8gmq8ZyD8CNxBRMjB2bpCqDPwd7YoRRuCpLUHqtmbLeELYSKXAkdyiSPBk9hB+pmB/um96S4XSv4hZmjAxA6J7OClTHlryBtj1UoNUYbDW8mMObQc/6FneSfPgdrsZ9o4ouNg==",
      // "bm_sv=653419AC23F46F137AFAA8B1155EAC23~YAAQrIj+eTsj/7iaAQAA+0m4HR7/ZUbhaOjR+6UqnjrIOY/MSrUOBQPNli3faSBigAF3WUVkhXlPduazwQA5gv8qFmPIq+H2W0CbSCoTnbfyjOTUvBJZNjPrUOLSpAdbbosgsr9npoEGc6G//+83ACpvdu5zz42zxcCsrPQ8fPprOCFkYJMRoTpoS/CKcqlWTRscxoyQKPBjz6ysKzuYs9nIYfhwzkNYg7FOgYV0Tw6Jy7QBH30j2/6ymyK9Q4rJrg==~1",
      // "bm_sz=0BB36F359317F53607CA4A97E9AF081E~YAAQrIj+eTwj/7iaAQAA+0m4HR76m69yCkBOZnPTNTMyembJgD6SrUrXbD6Cxv46QNDZ+qWA8WljqzIWNjyFJGyCN23wagSrJfo1hmA4JTyzKtj7kk+ykuS5K/xp8Q5sWHF3vBF81n0MDQYdsPnUhej3D+3odD0Yl77wzvI7zzltgd3Ve4aEEYDdmyb1EXN7rG10pJ5yG7rPLoOOtpOIpU/VJ9lmgUUJFeLhM/Y0r5Y4KQ1OUhTHEE8JJ/jqJBkDUASTCi3uVMrAtAW7jMyFYTuXIFGc7doV5fuaq594xDHxi04ggn6PXz2X3pxe0zpGSwCNLtTcMINW+WxJ+jFJ4Mw/8r2dL0iKSSsYV1LqIZ1BFVT6hYXGjiZv+CE5R0/DUCQC4RGEl19yp2WfLGej6NpreLS74EGoB7fUbJ0aTYVPX24y/YdwTuCy~3749428~3159089",
      // "_abck=62A279AE28CD77A47D4372D36E45A153~0~YAAQrIj+eWsj/7iaAQAAj0q4HQ+l/+DxjZkIq+FKapuAr26uDbzjt0hNGXqNn9XSCCMbbHZOFLB7G6OvM3Nkc/csyox8NSHtoYJzGEeXfZYE9H2ceNL1d8vdwwU3BVHkDJu3xS2fHLafd6iZ/VRgOAAh0T6wIo1A+R7vfjvi0ozPG0mTFqWfR1Teffmnx+jFiINs0QrA9aaQlNUc3WWpGqrN1VTZWVAu0F/3eqC8lJylfJfu5q9M1B/f51jO4HbnpDa8dQoaqk0lqKsdsg6vRvrt+PyQ+/hSwy8vq5VHOx5VAOWyPD1wMTwemIZXF9q7A7+e3IguncKBpAJJVz1Kjc3ySly+rNhiQk7OiVUDLXdO+WQCml+zyZTcrMv1Uando0kA2vRbSNoZWJyiZnNqoSYUfvqrS2gfcRSKfIFpLe9V7g9tazxEMcr4K+iY/1eKfGEp6QAM/+S7AS18bqUTFSWe3HF9cFo3VF80ijUxPAhAYz36UaxszAT+LcQaoxDhdmOu0k4+70bajOsJ3dlogGOdNRzbRg6lqGe2IIfsNqT8+cWgbQbyYOIaEee8X4qBxUyralPluJBIolGIzK6Hxu/EpRYqFAxzhRL4iTsznnAfPymsTX/D/d0YJA11jK86blOleL/RcdZiu7/hxHvIAVDZE5CxNvevATIscdk=~-1~-1~1765733280~AAQAAAAE%2f%2f%2f%2f%2f9ev09jQ8EFkvgMjtUYg2PumDXbwj94%2faJPolI4DGLZwzz7x35oYVycBiHmhFvImOsQPv6nCtTOWvfIeq5DUS870KdphAchG%2fCmZwQ4IzA9fPNKUQKc53SOABbU8Zp6twsD4+1E%3d~-1",
    ];
    const cookieString = cookies.join("; ");

    console.log("targetUrl:", targetUrl);
    const response = await gotScraping({
      url: targetUrl,
      method: "GET",
      http2: false, // HTTP/2 비활성화 (차단 우회 시도)
      headers: {
        // 쿠키 설정
        Cookie: cookieString,
        Referer: "https://www.coupang.com/",
      },
      // 브라우저 위장 설정 (TLS Fingerprint 일치를 위해 사용)
      headerGeneratorOptions: {
        browsers: [
          {
            name: "chrome",
            minVersion: 120, // 최신 버전 유도
          },
        ],
        devices: ["desktop"],
        locales: ["ko-KR"],
        operatingSystems: ["macos"],
      },
    });

    if (response.statusCode !== 200) {
      throw new Error(`Coupang API returned status: ${response.statusCode}`);
    }

    let data: any = JSON.parse(response.body);
    data = data[0]; // 배열의 첫 번째 요소

    // 2. 데이터 파싱
    // 쿠팡 API 응답 구조가 다양할 수 있어 여러 경로를 확인합니다.

    // 가격 파싱
    let price = 0;
    // case 1: 최상위 price 객체
    if (data.price?.salePrice) {
      // 문자열인 경우 쉼표 제거 후 숫자 변환
      const salePrice =
        typeof data.price.salePrice === "string"
          ? data.price.salePrice.replace(/[^0-9]/g, "")
          : data.price.salePrice;
      price = Number(salePrice);
    } else if (data.price?.finalPrice) {
      // 문자열인 경우 쉼표 제거 후 숫자 변환
      const finalPrice =
        typeof data.price.finalPrice === "string"
          ? data.price.finalPrice.replace(/[^0-9]/g, "")
          : data.price.finalPrice;
      price = Number(finalPrice);
    } else if (data.detailPriceBundle?.finalPrice?.price) {
      // 숫자 또는 문자열 모두 처리
      const bundlePrice =
        typeof data.detailPriceBundle.finalPrice.price === "string"
          ? data.detailPriceBundle.finalPrice.price.replace(/[^0-9]/g, "")
          : data.detailPriceBundle.finalPrice.price;
      price = Number(bundlePrice);
    } else if (data.finalPrice && typeof data.finalPrice === "string") {
      price = Number(data.finalPrice.replace(/[^0-9]/g, ""));
    }

    // 와우 회원 가격 파싱
    let wowPrice = 0;
    if (data?.detailPriceBundle?.finalPrice?.bestPriceInfo?.price) {
      const bundleCouponPrice =
        data.detailPriceBundle?.finalPrice?.bestPriceInfo?.price;
      wowPrice = Number(bundleCouponPrice);
    }

    if (!price || isNaN(price)) {
      return NextResponse.json(
        { error: "Failed to extract price from API response", raw: data },
        { status: 422 }
      );
    }

    // 기본 정보 (이름, 이미지, 카테고리)
    let productName = "Unknown Product";
    let imageUrl = "";
    let categoryId = 0;

    // moduleData 배열 순회하며 정보 찾기
    if (data.moduleData && Array.isArray(data.moduleData)) {
      for (const module of data.moduleData) {
        // 이름 찾기
        if (productName === "Unknown Product" && module.attributeBasedTitle) {
          productName = module.attributeBasedTitle;
        } else if (
          productName === "Unknown Product" &&
          module.itemInfo &&
          module.itemInfo.itemName
        ) {
          productName = module.itemInfo.itemName;
        } else if (productName === "Unknown Product" && module.title) {
          // 어떤 모듈은 title이라는 키로 이름을 가짐
          productName = module.title;
        }

        // 이미지 찾기
        if (
          module.itemInfo &&
          module.itemInfo.thumbnailImage &&
          module.itemInfo.thumbnailImage.url
        ) {
          imageUrl = module.itemInfo.thumbnailImage.url;
        }

        // 카테고리 ID 찾기
        if (module.itemInfo && module.itemInfo.categoryId) {
          categoryId = parseInt(module.itemInfo.categoryId);
        }

        // 둘 다 찾았으면 break 해도 되지만, attributeBasedTitle이 더 정확할 수 있으니 끝까지 돌거나 우선순위 정함
      }
    }

    // 만약 여전히 unknown이라면 백업 로직 (최상위 레벨 등)
    if (productName === "Unknown Product" && data.title)
      productName = data.title;

    if (categoryId === 0 && data.categoryId)
      categoryId = parseInt(data.categoryId);

    // 품절 여부
    let isSoldOut = false;
    if (data.stockInfo?.soldOut) isSoldOut = true;
    else if (data.soldOut) isSoldOut = true;

    // 배송 뱃지
    let deliveryBadge = "NONE";
    if (data.delivery?.badgeUrl) deliveryBadge = data.delivery.badgeUrl;
    else if (
      data.detailPriceBundle?.finalPrice?.displayDelivery?.deliveryBadgeType
    ) {
      deliveryBadge =
        data.detailPriceBundle.finalPrice.displayDelivery.deliveryBadgeType;
    }

    // 3. DB 저장 (Upsert Products -> Insert PriceHistory)

    // A. 상품 정보 저장 (이미 존재하면 업데이트)
    const { error: productError } = await supabaseAdmin
      .from("cpnow_products")
      .upsert(
        {
          vendor_item_id: parseInt(vendorItemId),
          product_id: parseInt(productId),
          item_id: 0,
          name: productName,
          image_url: imageUrl,
          category_id: categoryId,
          delivery_badge: deliveryBadge,
          is_sold_out: isSoldOut,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "vendor_item_id" }
      );

    if (productError) {
      return NextResponse.json(
        { error: `DB Error (Products): ${productError.message}` },
        { status: 500 }
      );
    }

    // B. 가격 이력 저장 (하루에 1개만 유지 - KST 기준)
    // 단, 가격 변동이 있을 경우에만 업데이트 수행
    const now = new Date();
    // 한국 시간(KST) 기준으로 오늘 날짜 범위 계산
    const kstOffset = 9 * 60 * 60 * 1000;
    const kstDate = new Date(now.getTime() + kstOffset);
    const yyyy = kstDate.getUTCFullYear();
    const mm = String(kstDate.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(kstDate.getUTCDate()).padStart(2, "0");

    const startOfTodayKST = new Date(`${yyyy}-${mm}-${dd}T00:00:00+09:00`);
    const endOfTodayKST = new Date(`${yyyy}-${mm}-${dd}T23:59:59.999+09:00`);

    // 오늘 날짜 데이터 조회 (가격 비교를 위해 price도 조회)
    const { data: existingHistory } = await supabaseAdmin
      .from("cpnow_price_history")
      .select("id, price")
      .eq("vendor_item_id", parseInt(vendorItemId))
      .gte("collected_at", startOfTodayKST.toISOString())
      .lte("collected_at", endOfTodayKST.toISOString())
      .maybeSingle();

    let historyError;

    if (existingHistory) {
      // 이미 오늘 기록이 있는 경우
      if (existingHistory.price !== price) {
        // 가격이 다를 때만 업데이트 (변동 사항 반영)
        const { error } = await supabaseAdmin
          .from("cpnow_price_history")
          .update({
            price: price,
            wow_price: wowPrice,
            collected_at: new Date().toISOString(), // 수집 시간 갱신
          })
          .eq("id", existingHistory.id);
        historyError = error;
      } else {
        // 가격이 같으면 아무것도 안 함 (불필요한 DB 쓰기 방지)
        console.log("Price unchanged, skipping history update.");
      }
    } else {
      // 오늘 기록이 없으면 신규 추가
      const { error } = await supabaseAdmin.from("cpnow_price_history").insert({
        vendor_item_id: parseInt(vendorItemId),
        price: price,
        wow_price: wowPrice,
        collected_at: new Date().toISOString(),
      });
      historyError = error;
    }

    if (historyError) {
      return NextResponse.json(
        { error: `DB Error (History): ${historyError.message}` },
        { status: 500 }
      );
    }

    // 성공 응답
    return NextResponse.json({
      success: true,
      message: "Tracked successfully",
      // data: {
      //   vendorItemId,
      //   price,
      //   productName,
      //   categoryId,
      //   timestamp: new Date().toISOString(),
      // },
      result: {
        vendorItemId,
        price,
        productName,
        categoryId,
        timestamp: new Date().toISOString(),
      },
      data,
    });
  } catch (err: any) {
    console.error("=== 에러 발생 ===");
    console.error("Error message:", err.message);

    return NextResponse.json(
      {
        error: err.message,
        details: process.env.NODE_ENV === "development" ? err.stack : undefined,
      },
      { status: 500 }
    );
  }
}
