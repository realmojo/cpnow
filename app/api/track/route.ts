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
  const vendorItemId = searchParams.get("vendorItemId") || "80103532831";
  const itemId = searchParams.get("itemId") || "12837912345";

  // http://localhost:3000/api/track?productId=7278524488&vendorItemId=80103532831&itemId=12837912345
  console.log("productId:", productId);
  console.log("vendorItemId:", vendorItemId);
  console.log("itemId:", itemId);

  if (!productId || !vendorItemId || !itemId) {
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
    const targetUrl = `https://www.coupang.com/next-api/products/quantity-info?productId=${productId}&vendorItemId=${vendorItemId}&deliveryToggle=false&landingItemId=${itemId}&landingProductId=${productId}&landingVendorItemId=${vendorItemId}`;
    console.log("targetUrl:", targetUrl);

    // 쿠키 문자열 (사용자가 제공한 최신 쿠키)
    const cookieString =
      "delivery_toggle=false; gd1=Y; x-coupang-target-market=KR; sc_vid=A01426259; sc_uid=OsecOIIZ8Whhl19oOrtFOiz/UUkBlCDUhK1CPoHberZTAM2NL4vSo0lWsI00wJVpp5I=; _ga_MM7Y29P0HZ=GS2.2.s1747751908$o2$g0$t1747751908$j60$l0$h0$dpMEnPjLvkdbv0UaE__J2OKl3b8Kzzcwz6w; _ga=GA1.1.947833985.1744028550; _ga_038FN1G5ZN=GS2.1.s1747754379$o4$g0$t1747754382$j57$l0$h0$diBmGMP9LsaHOIRExe6Cr4O4tfRdY2fnbnw; _ga_NCYYSNYQXM=GS2.1.s1747754380$o4$g0$t1747754382$j0$l0$h0; shield_FPD=SCFOBsGkRkUEUJ0mqMcma9Cile08tENChQ; AFATK=q97h7P15kmLwMGIQq9YkowfjsBXhn9gCbhlS+4r2G72Ev1CYA6ts6B4Y+fflMgJ3Pmi/q3qRO59GM3Mrc0jr1fk9hhG7Yb5uc2VuMgoo35NSAegXhUdukgQtzgrP72zaF3dqUFMROw==; PCID=17567408568731944450860; x-coupang-accept-language=ko-KR; _fbp=fb.1.1763002963082.275186179677095566; MARKETID=17567408568731944450860; cto_bundle=Q5kTWl9pZ3FBejRsY1ZLWW9sUVFrRmJWMHM5S0pVRiUyQms3TkdxQzRUN1RPJTJGMG5Ibm9wRDZJU1dVNHRBUzB3ZGxTVUJjUGMwZ3hKV0d4VDBtaFhHVDhEU2hsTkEyQ2lUWHlNQmI2eWhUYWNpa2Vjd1pOTkV1bkhvczQwckt4T1A2NWJ4QUwyWFd6Qk5URzhnQ1Z0VnRxMXg2NEZjTTU0Uks2bGFHcnFsZXdtJTJGSmVmWUhzVDM4ZWZvNjJuQ1FKOERxdFdGUGdzd29NVWNheUpUekZPb1J4a1J6Q2pSNkR0RmNRckkwMFZBN1VWU2paamZIb0JwMVQ2Z2M4bzBibm5qTTRvbnE5; sid=3df0addea65f4fddae84d42c17abeec40abaff19; trac_src=1139000; trac_spec=10799999; trac_addtag=200; trac_lptag=AF5242985; _ga_RCWXX8WZKQ=GS2.1.s1765630245$o4$g1$t1765630427$j60$l0$h0; trac_ctag=%ED%98%B8%ED%98%B8%ED%98%B8; trac_itime=20251213220435; ILOGIN=Y; bm_ss=ab8e18ef4e; redirect_app_organic_traffic_target=N; helloCoupang=Y; ak_bmsc=C7FCF06F981AD3E9E18F1A45F3E69585~000000000000000000000000000000~YAAQZ4j+ecMMAQqbAQAAuGwvHR7CcjT37SrXxq5R3tjsDAgv/genidU3wE6ina60D4lJ+keuzlmv6VQhM76p411ih7E/rApG056STezkuiuDsKhaq2DDpuILRUzyBcBKqXwhEkaqL375SNf+QRSZ4N1mYccG6bx3wKO+/IjCCAXW2Q1RlGXofxXgqrc9sKOuqXkmyx11Htlg5UR7L6WPbvlWkBTv7ZArGFnuo26OW6poorP37eSkuhoylj3iUKP8j5DE92UkEipS4naz70l2Wx4wOU1OUlgp0oAh5zm6dB6FH9L6tfu1tIpfMqvo25AN91BK4ZJJlRnlUMl/xY9HO2uTDtSEZ8G5ELK5OLCCrGbtzlzR0sOUKMqqTqi9bBzNtiRp13rJmwzW18oTiDjACy6F9Z8d5LMfpItIV3Dk7B23oeMQGTkL1aB/I/oGI+SAWHvKjKJMBNsSUNi3W4dA15b9UDTOSpLGSSgcHQf9zsicNeoZzIHwEXGU/w==; CSID=; CUPT=; bm_lso=5B83C66EAA1308869A104A2350F1641DF721FFAC237B9DA212A429B061230307~YAAQ1oj+eRtB9wmbAQAAUsU6HQZjWyoLxBL/4B/h21WOoMJdn+Ee8T/TF5MO8pQZAX1FY8PmNEb3vbkAHAx71b5efRC3pJyD1vPP1de7oy26yZcJI9UorovMOsU2NEKnhHPSGM344SxExbMKuSUFRRVQ0V1WX3yT/W4nZVEEd9yi0SQFIIjRUqKLV5CTCjFrJ7119YXfNK2Zm6fcBTldd5lKRWYmTKtPczNBH32y92wfelUGyCS9wyIs610grblopO7sGQ1gkff2MOztHT13QNkq9yEDb+ToBG8NZXcpnAT6ABzRc9ZXUAR44V5B4llz7YJU2ZAWDqXm6GTsT3XnfYwKQFzeXyTJ0X6NHjG/1Fh8BKj0f9pbUP2QCEwHX4gi6ZpWlUoMEmSAFklsffjr+RAbZU6U5Lf+CaBw4oattqulYtfhD0BTT1bXburCVoW8dIuLmykn0D9dTx2Xwpt2vQ==~1765721948971; _abck=C55E4809AD151C54C8616AEECE2A6DEB~0~YAAQ1oj+eRpI9wmbAQAAY+06HQ+6FUhDWaobSZnivFiVuQWwKGjxAM9f7mcd1GaKOIEkEPWMM50vYKsgTCmpNtuwRlqjM6vRQs9cgJ3tmWhMv50pBBwW/s95jlEMDUkzkMQOkAdEwGK7bjBUfH2JAeLTg1DCHA4p+oc1FUU0MOEqSfQnoxd3l/eYQvonAwMdSjUBjV3CSJ2DQaJGw+reau1z1H0tw11udpr+08JwtsYdO32Ai1/rCzB3/nLzvp/J+4hgtWBq+LO329cjHVgY3qfXIdEjPo9jCBkxX7IkGA7sH5gnQG6I5nKK7TMWJ/udCSNDODwptmqNROQA1xj16GVFLvGkHtpk4BB4EHVjw2P5byns0b7Ehf2DWn5nunEnEYm5xRGqCzeUzsX0BFM5eo7STO3UR3Dibt+Kjh1IbwygzYligWlNN6VSTw6VUI0nepv96mMbywl6IAJqqbTVl7uJJ0A3f4RIutg30Bt1naGYy3YAMHnscUQ7WTchKzja/ZS+szXKePFSmtrFJ3X2I3Nybr0cQGjfbCsUAXWTv1VxMiBYRio1MfIU2pTT4qN1S8KLqctUEiBGMfC7iu9/n23j41yozOngtAtZtqnXkYgg4wl9ExUfsGtpFsVKvKaCPjQYnKf9NRItHIyH10Rx6roKP2ero3YxzHUPOUt/XA/To5QvKX5phuxnFTIC0d1KgRSG9eTuiVvzaTsotmQwPLm1gJBD2YM6wIHoezuB2twuAUMGL2wQJ4dBQPBByh+X2Mo4/LZkiOTqz6I3YGcB5VhiRcI0Cnm4WxtP4nF1zy1iV5SvvbXGJyz8fJqu9q+9Mj4elvwod4EZskeW~-1~-1~1765724778~AAQAAAAE%2f%2f%2f%2f%2fxjqI35o3BY2aIbU+RvYL04+SqmCQ8LxiUKX%2fJBJgWxO1efsqN80Idjde590caubHL9QqPEFQJT0MstZaWIns2pLibdFyItERFONMZX68KSTGucYUFzXzQb6VaTKgT5pBhTgcOA%3d~-1; bm_s=YAAQ1oj+eb9Q9wmbAQAA2R47HQRPkCOb1mrpWrGLNRwqGo+m/u5CQxVNir5+hTpP1lRrbL0DdQLRs3tI4HnvYnTLVHCdest4InDfz8LrMdoon9MbAnlwXD1jbR3jQmhoYWIolk1jrWbMzggcfd2rs3mpWETKh9/Wq1aPd83/j70piF3Ar5h+uFYMxSOzBm4tITpULKw2TfCPBqJecY4ZQMAXDW82awAk+w8JDoOPcXUqDORvtSIrQLTpUtfCLkJoy4H18pVlzTlPgC9hOU9Nfk18fpTZ3qqbO2ejZq1imF0cP9Gbs9WSxDhsgBBez7oeHzGj7SATCG8qDgsMSJdRHTu41MbFTuilBH+0JDkvtJI0cFivgQmiOzcgyWDusV5r+SFYULswEeqZodd9XX2s+lnsc15QUUM9xpelFA0lnpQP7a2Gkj5N84d1eL0vBjayrnabLb8+jhfN3/POT+xu0NbPhi0gjqJoHNqhgOU4D3cP/tJ77XsFo+F8YzokEgyTc0WEzB5yQDbMV/bWZv2+xmpp2+AvQdnJ4ap32h6Dt6ii3WdyhznY2JxcfKkbfh0XXOLg2fgJ; bm_so=FA5B3BA64326AD21249FB6D6FF68666AC919C2DEED820290F1B85BEDC28E6E95~YAAQ1oj+ecBQ9wmbAQAA2R47HQaZxsAk7uGaMmQ1MH4KXFAYXJ/OZd/l9u9ZqJz9k+/5UC6WezRrpgtl0JEg2TVqJGQGfjxc3CVNzWABoy+ANO7jkpBNy0jGuD+QQrVb93KEcA3ADyqvOF+xMntxdRHfQnNefehEzqjxx8TQhmXuCtEjfGR0GRXT98TxvTSks1m0n74dViy634e9nTGMgqIn+vRU5bjkderCJiR63KNSAtfYEkqrgdxzQsq5qmFhrH8l/QlRxJZ1DjRjDk5U3/4UWlAH4qU/MLAfVQYfM2Hwc0C10YLdOPN9bNu2efvX6xWK84CfvW3zjMYAN2In+N63UQuoOqhhcVTdcFgY9xohj7ykMEibtJyAGRI2WSzFwinrNIkL3x6BtAfirNpYcEdLDJ5ZhTj14OUpYOVFzzVpVYCOm8wAqVGfz0HwUC6qekIzLKSzjE4clsXqQJlYcQ==; bm_sv=42A4C4701C7C2A8FBE82989CCFF5C11C~YAAQ1oj+ecFQ9wmbAQAA2R47HR4M9YCbaR7Fta5livpxcNmiK2Num5d8aZSdz/k7Z6aKumnUAfhy/lQDaQTigpRnk/U0TNgVKX/71c8w08XX0apVcvhNaU3ok0X5tBMvTdSnAtQV1ZgsElMvYHm/OxBKluHnluuVTSZVUrE4Wd4bkx9dLV0ftTYH4dm15coTmkGqjQXyfAjv9dvffHrJpDgwp9pehSjCocJAn2JNdJYcH6w6R14PM6W8u24/8Lw58js=~1; bm_sz=9902D18E6EA9C139B43061CC472F4A01~YAAQ1oj+ecJQ9wmbAQAA2R47HR5Me8kQnbOfDZCUeYOzQuh/16Svhb6i+nhIacDDCWGJxQvTcUecYFB7hpd2peYpuV1z9df5f4hP3NAGwF/wSZ6SeanLRrIOo2ZVTunNX1k7/lMSzCitJ3OYn7+4tV3Zo+shqJXeXn511GS++QD6Pi9Yv4sm4+Bp0CK4SP+SLqfGEWq+H+ebB5BY7tIO6UDGlBqvvBEncCnczl+zMjn1Pi6bwdoaj3Vhs60XNvuzRZtwxR8Ht8kGtsxIJHs+rGfo9fuNo9oYejGUpdak+OBIh8r8lECfO8wU/Zf/71B96muZFSRpr7AXAVw/R5CrVaF9mk5l6iTH3bRuFp731GLaD4mcFygacPl1tlBLE9R6FZ88yz4seL5Tqpmingsr6eCsoiXViXpi1wpsuPMU8WmScEHjewpfmTPvDflP3/7Y9DnYjDkANvdXKFvbXiL+/SQ/DqmnLO+sLHkb02bq/2TFbCfHNNO49nQswUTq1VnZOurA9pty+7US0C+48p4dSX+JVfmUz1YY1qOaKg==~3491129~4407860; PCID=17657219997048650659100; _abck=C55E4809AD151C54C8616AEECE2A6DEB~-1~YAAQFNojF1MmDA2bAQAAjndJHQ/bmp/sPC4nUOVRwDI9L0+z+vUaPjnDAoQ6sNZqUl7srtefHM1fbh6Mu6ZnoiCbiyBQi6B6+cZm8hiKtJi7SKQ8XIEHiB9hSpbKasBPiTbEhr5l8taTAE/E5USrMje0ViwogmnxZe7g+zEeswSuBhz+3uggFw6Da7QXgkLBQpkNPIV8hltwZkX2HrRsPOcdKsjNhkohD8MoStYWTKHkEBwK05zmvj1+AQMSHXRXVYEIfGzvGXpzF+S6BxKWV/eThAFdO+LE+LC/vrw0EzRR/hTU0TqypbSEynsPLZonoxVficfHF+KYyEWVKn0A6HpBTzWRxReOjxayJiXfvGhFN5CsIdQr+sX/Fu2tGR/UCNKijg9KDtBD62GVJDPB2T7yz8vSg7fUMGfsQ0Ei736mIHNZLiT061fMSULgtzf57GcAbKmJCfGbjUfkadoz4TAPCM4Zyn+SyGHwDq0PkylOBwEWR8ycEiTEKGZIgs0Nz8vVY/Ym3+/Q3ezr5Wm83OAtap20OvSxkSjPu8gZtSJqA0ERSUe1HeHBuGic41kZYKSpEOxtvJt4ozVsMbYKo7yo1zvsMLRwfuSk1VxNL3dWq2dN32qylm61wUIkT2CU0lFtcMS2N+EibmIeYS50Uk8jKRZynrAq5Raz93R0oHDyGaZY31TKHVVtMSJwTUEN2d0MF38Mg8FkQguUnaEeWTT71+afeHyv9m0o8TKCsuZnVynNj2WPyzEgS2QyE2OCglmMUV3fZRsOSVzkci8xb+Dg3bQA48Sp//opBqn/kR3bTt/CW4KRcOBN29NoFULVfhibjC8Edn/2UTZk~0~-1~1765724778~AAQAAAAE%2f%2f%2f%2f%2fxjqI35o3BY2aIbU+RvYL04+SqmCQ8LxiUKX%2fJBJgWxO1efsqN80Idjde590caubHL9QqPEFQJT0MstZaWIns2pLibdFyItERFONMZX68KSTGucYUFzXzQb6VaTKgT5pBhTgcOA%3d~-1; ak_bmsc=BB0E6AC4B924A585A7BFF97484B40723~000000000000000000000000000000~YAAQfIj+eSZHyQqbAQAAC847HR4Nqh8Gtm15tfdbnp/LmNBcVa/GyOVwyRkzmFU2MCLbjyAL+7b4wz78mu1Vczsk7yBkuzVf5lqv6L/9/shh3+y5lWApCOSzO3sDS1OQPxtINI7sb4l2goxSASfijQvvldSu1Bky09gd8nMqwsFgHSG5N0mTkiq70tYoAI4oSIPcKKuTGQJ88Jm/kyj8YV5DOxIidSbNJL0CQHqNJh9DJgMidAIz95q73kpBPYnrzsQchHWkI9SOv6N1c5IyXOA2VlYf+Ye7/lT0yZOZLjBVt1Qxu4NjJKKQONf9jfsqBgILNw+GLXZDQuOeENp42Ro6wKBI2jDbJ6eDJW4QzYl43FDWi91kY2o=; bm_s=YAAQFNojF1QmDA2bAQAAjndJHQQsYaFui/4J4CwY2eoRpX0sHJdPCvGedMjnFDpGmj62x+YmrC9sRtC3NdeYdiHGDCHRpcJZ6WYCFmGvz0kL8mDjJJaPDFcGVcXU4lCUu3PBXP0y8GhuMaAUF4ITe+6CUmKXU9I5eeDUELHt14NncWD0bKQ08cp8no+QiwHxXm5/16J2Mj+YMB/AlmWpsa15fuOuHWZHbvkoU/X4F9cw0xuHOjCQF/1S+p1xdDj055GwClB0PDN5Wvn7Oyl10WHRiikRxDd1nLkofviapZXG6UAUxrHih67Os9uiPAMQEq2qv1Fao2F8TS13ssuJFl9oMvPmMRBqPQnUxQ+diiYXbyYGdyVhmsyArvbR82kf3piBXOHBg4g1oP/TeZ1lrirXVQmsroQbW61uddfm8OHI0SQW7ZlswjtOjEbkI7PUeovwr6dCOwAiFrK7/Bh88mr8HlwHBIjL/VHY5W8hNzWE2TlCWeoJWowig+VT/dlHlb6TQm8s12WtQptpRbOP1IhSV24PINVPDcYUG+OB033JM9LuX7W4h06GU7vChae5e0VlDZ1K+z10Fs8DvQ==; bm_so=6B2ABE0614039E4A7157FFF0C70D7BEA447F0DEE0BB04924EAB36334EE98D30B~YAAQfIj+eShHyQqbAQAAC847HQZ6qtqGP/d86MrAuZtB7Pk5HnEioGdVbtxX5Z8+lfQ9pzF8BNzNywMM6QSmbqoluPJ9TPyBVaiZILNlm964O/bYlLDzqVtEARfdjDUhOs3aJhvL0jsNt5V/NzV237vLU3SOMdRSF3ScMnpnP7p5+dnqLSCGxcEFafEi/xr00RAzgEpbxVxmuD7e01LYdhhOdRO4w5rH5BXiMrHHhl31tM2v4Zl7FP+v/QR+FgWFQxyPtKDDemOKHyElbmEybKHT65A8NZ6jeVSWEJJB/ovUgs/uA76IG+PDV2QtTY9zTx8TVrR7Nzj/lD7oiCV8PNiXexkEWA8Sj8Vb5Ys1An1fCn6+8knWQNKAqlQmDEFHIDRhCcwa/9VEPbgCoZWqDf//py0Xi5BIDxEpPb39t/mcLLckQCTYxeN7CVFuInCH12WHYpOr3+r9/ze6Ts0e1A==; bm_ss=ab8e18ef4e; bm_sz=DDB46D4361598AF6D4720C3DEA57F600~YAAQfIj+eSw+yQqbAQAAH4o7HR5rv2TZIrBW/9FgkDpVxoXxvfGwyeVgAaE6hVCE0v7/g+5AQWp3g5oWCx86hE79el42qANvtJ0RAP+lA+I6Sbl6ZAWTuc6QshfWgNkzzPHC11DDGHc36Cm8sKvyRaeSKgiyVXEJFvitkE9RLHpbibFSnmXJU89z6BYvIZRMXJasVOzDDSnPiCVE8k3mNSoX+rlPsOa0ErRUbstuvtjpzvgrNIqND6xV1HrI1zzTwd5IgnEfoz1jTGOLlsnUMPyUjYTHZy0vj+VLuSUL1QuGOvYEjBMh+BPCQJvR64FojMmGO/df7dNdPp0ZAlaeEshL796ngtTWVqFcGhZud70=~3228980~3749185; x-coupang-accept-language=ko-KR; x-coupang-target-market=KR";

    const response = await gotScraping({
      url: targetUrl,
      method: "GET",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Data-Language": "ko-KR",
        // 쿠키 설정
        Cookie: cookieString,
        Referer: `https://www.coupang.com/vp/products/${productId}?itemId=${itemId}&vendorItemId=${vendorItemId}&sourceType=CATEGORY`,
      },
      // 브라우저 위장 설정 (크롬/맥OS)
      headerGeneratorOptions: {
        browsers: [
            {
                name: 'chrome',
                minVersion: 110
            }
        ],
        devices: ['desktop'],
        locales: ['ko-KR'],
        operatingSystems: ['macOS'],
      }
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
    if (data.price?.salePrice) price = parseInt(data.price.salePrice);
    else if (data.price?.finalPrice) price = parseInt(data.price.finalPrice);
    // case 2: detailPriceBundle
    else if (typeof data.detailPriceBundle?.finalPrice?.price === "number") {
      price = data.detailPriceBundle.finalPrice.price;
    }
    // case 3: finalPrice 문자열
    else if (data.finalPrice && typeof data.finalPrice === "string")
      price = parseInt(data.finalPrice.replace(/[^0-9]/g, ""));

    if (!price || isNaN(price)) {
      return NextResponse.json(
        { error: "Failed to extract price from API response", raw: data },
        { status: 422 }
      );
    }

    // 단위 가격
    let unitPrice = "";
    if (data.price?.unitPrice) unitPrice = data.price.unitPrice;
    else if (data.detailPriceBundle?.finalPrice?.unitPriceDescription)
      unitPrice = data.detailPriceBundle.finalPrice.unitPriceDescription;
    else if (data.priceInfo?.finalUnitPrice)
      unitPrice = data.priceInfo.finalUnitPrice;

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
          item_id: parseInt(itemId),
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
    const now = new Date();
    // 한국 시간(KST) 기준으로 오늘 날짜 범위 계산
    const kstOffset = 9 * 60 * 60 * 1000;
    const kstDate = new Date(now.getTime() + kstOffset);
    const yyyy = kstDate.getUTCFullYear();
    const mm = String(kstDate.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(kstDate.getUTCDate()).padStart(2, "0");

    const startOfTodayKST = new Date(`${yyyy}-${mm}-${dd}T00:00:00+09:00`);
    const endOfTodayKST = new Date(`${yyyy}-${mm}-${dd}T23:59:59.999+09:00`);

    // 오늘 날짜 데이터 조회
    const { data: existingHistory } = await supabaseAdmin
      .from("cpnow_price_history")
      .select("id")
      .eq("vendor_item_id", parseInt(vendorItemId))
      .gte("collected_at", startOfTodayKST.toISOString())
      .lte("collected_at", endOfTodayKST.toISOString())
      .maybeSingle();

    let historyError;

    if (existingHistory) {
      // 업데이트
      const { error } = await supabaseAdmin
        .from("cpnow_price_history")
        .update({
          price: price,
          unit_price: unitPrice,
          collected_at: new Date().toISOString(), // 수집 시간 갱신
        })
        .eq("id", existingHistory.id);
      historyError = error;
    } else {
      // 신규 추가
      const { error } = await supabaseAdmin.from("cpnow_price_history").insert({
        vendor_item_id: parseInt(vendorItemId),
        price: price,
        unit_price: unitPrice,
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
      data: {
        vendorItemId,
        price,
        productName,
        categoryId,
        timestamp: new Date().toISOString(),
      },
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
