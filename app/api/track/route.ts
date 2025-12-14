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
    const targetUrl = `https://www.coupang.com/next-api/products/quantity-info?productId=${productId}&vendorItemId=${vendorItemId}`;
    console.log("targetUrl:", targetUrl);

    // 쿠키 문자열 (사용자가 제공한 최신 쿠키)
    const cookieString =
      // "delivery_toggle=false; gd1=Y; x-coupang-target-market=KR; sc_vid=A01426259; sc_uid=OsecOIIZ8Whhl19oOrtFOiz/UUkBlCDUhK1CPoHberZTAM2NL4vSo0lWsI00wJVpp5I=; _ga_MM7Y29P0HZ=GS2.2.s1747751908$o2$g0$t1747751908$j60$l0$h0$dpMEnPjLvkdbv0UaE__J2OKl3b8Kzzcwz6w; shield_FPD=SCFOBsGkRkUEUJ0mqMcma9Cile08tENChQ; AFATK=q97h7P15kmLwMGIQq9YkowfjsBXhn9gCbhlS+4r2G72Ev1CYA6ts6B4Y+fflMgJ3Pmi/q3qRO59GM3Mrc0jr1fk9hhG7Yb5uc2VuMgoo35NSAegXhUdukgQtzgrP72zaF3dqUFMROw==; PCID=17567408568731944450860; x-coupang-accept-language=ko-KR; _fbp=fb.1.1763002963082.275186179677095566; MARKETID=17567408568731944450860; cto_bundle=Q5kTWl9pZ3FBejRsY1ZLWW9sUVFrRmJWMHM5S0pVRiUyQms3TkdxQzRUN1RPJTJGMG5Ibm9wRDZJU1dVNHRBUzB3ZGxTVUJjUGMwZ3hKV0d4VDBtaFhHVDhEU2hsTkEyQ2lUWHlNQmI2eWhUYWNpa2Vjd1pOTkV1bkhvczQwckt4T1A2NWJ4QUwyWFd6Qk5URzhnQ1Z0VnRxMXg2NEZjTTU0Uks2bGFHcnFsZXdtJTJGSmVmWUhzVDM4ZWZvNjJuQ1FKOERxdFdGUGdzd29NVWNheUpUekZPb1J4a1J6Q2pSNkR0RmNRckkwMFZBN1VWU2paamZIb0JwMVQ2Z2M4bzBibm5qTTRvbnE5; sid=3df0addea65f4fddae84d42c17abeec40abaff19; trac_src=1139000; trac_spec=10799999; trac_addtag=200; trac_lptag=AF5242985; _ga_RCWXX8WZKQ=GS2.1.s1765630245$o4$g1$t1765630427$j60$l0$h0; trac_ctag=%ED%98%B8%ED%98%B8%ED%98%B8; trac_itime=20251213220435; ILOGIN=Y; bm_ss=ab8e18ef4e; helloCoupang=Y; ak_bmsc=C7FCF06F981AD3E9E18F1A45F3E69585~000000000000000000000000000000~YAAQZ4j+ecMMAQqbAQAAuGwvHR7CcjT37SrXxq5R3tjsDAgv/genidU3wE6ina60D4lJ+keuzlmv6VQhM76p411ih7E/rApG056STezkuiuDsKhaq2DDpuILRUzyBcBKqXwhEkaqL375SNf+QRSZ4N1mYccG6bx3wKO+/IjCCAXW2Q1RlGXofxXgqrc9sKOuqXkmyx11Htlg5UR7L6WPbvlWkBTv7ZArGFnuo26OW6poorP37eSkuhoylj3iUKP8j5DE92UkEipS4naz70l2Wx4wOU1OUlgp0oAh5zm6dB6FH9L6tfu1tIpfMqvo25AN91BK4ZJJlRnlUMl/xY9HO2uTDtSEZ8G5ELK5OLCCrGbtzlzR0sOUKMqqTqi9bBzNtiRp13rJmwzW18oTiDjACy6F9Z8d5LMfpItIV3Dk7B23oeMQGTkL1aB/I/oGI+SAWHvKjKJMBNsSUNi3W4dA15b9UDTOSpLGSSgcHQf9zsicNeoZzIHwEXGU/w==; CSID=; CUPT=; wing-locale=ko; _gcl_aw=GCL.1765722286.CjwKCAiA3fnJBhAgEiwAyqmY5cSqMUCHOpV_KOWaXkgYFB1f7H3ik4Ze4SOI6NFCAakU7XaJ6khAZhoCr1gQAvD_BwE; _gcl_gs=2.1.k1$i1765722285$u266746632; _gcl_au=1.1.787902819.1765722286; _kmpid=km|coupang.com|1765722285890|37fd5d4d-3c0e-4449-8835-a009dbac8996; _ga=GA1.2.947833985.1744028550; _gid=GA1.2.1574506002.1765722286; _gac_UA-117841973-1=1.1765722286.CjwKCAiA3fnJBhAgEiwAyqmY5cSqMUCHOpV_KOWaXkgYFB1f7H3ik4Ze4SOI6NFCAakU7XaJ6khAZhoCr1gQAvD_BwE; _tt_enable_cookie=1; _ttp=01KCEKZT9MHT10QB0ZMZM0T6N9_.tt.1; ttcsid=1765722286391::0lE12Ppl_5jJZjBqSGHg.1.1765722286603.0; ttcsid_D4K2KLRC77U10O2JCOAG=1765722286390::RcSrhKlPWbaAZhCe3VAD.1.1765722286603.0; _ga_038FN1G5ZN=GS2.1.s1765722286$o5$g0$t1765722289$j57$l0$h0; _ga_NCYYSNYQXM=GS2.1.s1765722286$o5$g0$t1765722289$j57$l0$h0; overrideAbTestGroup=%5B%5D; web-session-id=fd9436e2-4227-4782-9ffd-fca079b052f1; baby-isWide=small; _abck=C55E4809AD151C54C8616AEECE2A6DEB~0~YAAQr4j+eY/AbBKbAQAAtA9PHQ/aEYUSYRBSivB+6gQbIHbjWzyJ5k6FTWq7xOdiYkAyyikB5YiSdd4+V4Md1LlQgXn6nZUGcZslN5WvXZgT5Z7nRqehA6Tyy6tI1cerKVNklGWS1O9kuAmPTXPIk4nc4+beaIX28qP7XFSA8CxZ97gNVt5UsDYhW5qZY1/k54QC7KlX69deKbJ8bXNdLU/rLS6P1Qtr5bjaTC/OBHpZ6DODxP2SbgubiakyBF6K84VICyRESEcqLST5fv3VT1n8I8MQkxYTUyV/1DD19MWScXM3Wa0XicxvSzWeKZr7C+wC0MzwbItU6gGqAxY8Aqy6RCYtNsKybLRkoOxgYXZCmePU75AFfunqS4TsI9cLiyFAhipkDXS7wNt0AFZFKoFVqnycLlsdSyUh8OjGuxBtsPf9KUEdRyfR6MKy3SYCQL0jxlGqLiaOgznhzsKFL8QswSj/xEesEpviw3qpq+dmuTiEg4BGudqMgTRrlw+qC4uet7Ehe6h03IPb6EFkcI0cNDWThDeFJ6dipK7aOF6NxUmOkp/+LNIuNvpYQUIVxFmt0SNaSjqJw4D6xcSu6TBuiGoAu4eXh7Cqh79P9H9Dy7kPLI6Bigr8Xsf71hQQ1EHKk8o+enIR37VdeRr8OvYn8LFgJcMTtjsmZx3g8vnC7fmZVhRLvukRw30zulskYsaHYvztsPizJF5SZTo0MJfHuuci7pmJiHblHWbrGdpjfxhYXQE7UY1wrruKQJFFailb0KHoCSYtBN9EVwI7mBv1KtJcXJNq/OsmH7pf03swqi90LlIOqkF0wMx5II/OCyCz4bbDq7fTvgcOA5DVOxZSJUFwiBUwHG2kJKk5/ESSpvgDLsrAg8oRIoURJAGpfqX096TWxBaZRJ58BPq2nH51EhdMST7Nd1hOUYacvlraty+qDOADa6kA~-1~-1~1765724778~AAQAAAAE%2f%2f%2f%2f%2fxH8fWXHYqvko2wf3WiZY4NwkOpq9zdSLapMaKdx1SoZA9mMGX+OC1UwCP+Ih1UMqq%2fArHaAfMGeaiEp6mZYJ1OxivGqtP7yxCCvhLlRaoqT2q4sf8S4uGeJughNqG8UKwZbxybKCVELAk24ScC9UJKC0YYrzHa%2fE02Vga9Ce2k7NoWqZGEbll0zSUld+U4iFPiZMXA5YOv3qIcLAtgiUBMJsZh%2f1d6oigFfZcHfUgdQgLs%3d~-1; bm_lso=99F1B5E684693A3003A12463B48FB9A76CCB9491F1861AB62666669B9F41A5C8~YAAQd4j+eT7aqgmbAQAA46VcHQZ9pu59UIZkVzd0RA5r3PQe2xJqNAyGBHSSHU8jq0bRuFvuezRX0vHv1KETTKSO/3mg7VOvXGggbKZrAkn0zQ5lExlmVlD/OfPOhiCZl+KjECSUnlKxTzJ+wHhboXoQiTYfoK2aA1kpsIgEWPQw186svtlOKCHbWiztOyHKh7vjUAZlRByOAXZTUWM6TKYrmMOgias5Z5PbKCKGJMBDMuk35sn0i7qgA/zcLpWM0Zi9FB+IdhwjPVbdLC1mGcSHxLClC+k1gVS0Yh/xe1Od8qKJ/RrPyBrIBV4foXIo/t2vkiBChXaY7MhdRoh9Q8wxvNq9OoA2e3Kwzi6B34lJ47TK6U7cUZM7Yj2F7YBShgA3pIZwJ/bBLDZtZnTd/wDblTbrEAi7V2snStJqx9l7UpPQfUj2YLS1H0BZ5MmVLL+WkK4tOxL3qJGVjST7tg==~1765724170156; bm_s=YAAQVYj+eV1QKwGbAQAAiEhgHQTmuG/iTEjb5UPzn9wRYXG9GwKh/fFdjr5uo76b67KMS0A/uXq5bLlf0LgTE5xiuTYf6gWjch338zEMkO8djSFEZOyIBJleR0yp/35l2fRULfE0qrfBlZgZP9kFgO7zS+zLpm+nMqjVPI0InZKwiwioIXamAuL31EPWc0w80/zIW41QVH/wTwhL5D5xJJlvm/Vtbqd6LbKfKTFfklOTp9AJPUsnFzhKZBOOQuAs6oPEgdpPdGcbExLqcePJUnvJ+tXR3DJWpONpJ0mtI/6yABZhZpKZSWEb8d3SPqV5UwBrSXs531dqkGbjT2Gsbnp32/0UTl/ovkYPkJHpgeHChGlIeaLJ8KVxz9Dkh1XY/ubJhcawEwzvRyXvO0omUw7Lg8Ej8k6AiOTGtQhiGKM83a2E6YH7kSqGHv+hQVdtHFo7vFOsdYyrv2srnbBHwTWnOQ6KogeM1bXCgwXmh68UyHi9MJe8DhMgNeVVlBRzFWXSbgrZJjohlgfx9w4bPpCRjhBm6O5si6GAdVm1htHEcMyomme0KETHb1kO/BSeWfu5XOcL; bm_so=39EE24EADA316BF094B04182760B66200D545AEE1FDEDADC25988C5A27BF3C42~YAAQVYj+eV5QKwGbAQAAiEhgHQaH9NlkGoZlWvy7/pLLkcJ1BYDSU8Pj77o8l4ToDBsj0YmFykucAtTDgRUmvfzvCRgfGWmQsdNM7ouH62KDXcRLZz5otKwkuBzP9amDDaxmlhxYD/DfcxwNk0QDOSoryMDUA9Uu96xMVtqkGNps/DakdSPMTJ6Srh2juemdTzhlkazkAFdzmyachxmdUOOd0ONLa+GBgLIPBbppUit0pfOS7PJbVMvgIxnUt9dMAj/aNLqxcC5OKZByxbcYAmMA22qu1KFj2FR505kKhb8aTHusTB/vDPnHJJ+SGfOC+pJQqLza6952nWIuW0kgxuUeZjvQ4h439sGIFLPjZtFiFZEjT1ifzPAwuwPNfIlvzhrXOAUWXyKPmrrEM59GIgyK8xJqWgfSUXdrPVPYJp6pjaTgmIDnWm2+avJKVIFJVXfYV5qIO48W0BMZkcOJHA==; bm_sv=42A4C4701C7C2A8FBE82989CCFF5C11C~YAAQVYj+eV9QKwGbAQAAiEhgHR7ToXsuQ+htlnY5UrJl3CdPIxWMEYqdWBIEN5z00N72DfLrni8TUQ7FH185WFKQ18iRIkQO2GPisDmkznKLy3UktENc/Z4ohtG6J1FccNHSjHRumc+d3I1f41Q8J96aPt4C0Q+9P7tjMXJU5WUxRPvB6fzEwk4NXE+kSNGxM/YTU9nGn20NlYaPeuphoQzZHErOb1nnI3FF+HNb4xRcYYnze6KAZA0JHxNyS4omDKZa~1; bm_sz=9902D18E6EA9C139B43061CC472F4A01~YAAQVYj+eWBQKwGbAQAAiEhgHR4YHDeI81Tk2Ut6d9GrVE/6rCPSKGM3dd8CwR/ZMBml/shxl3Jq1TQvKO1H3uRZwTqPDVofnyhyAbRT1yr0decacDlyMnPH1aMx9SAVpb7CPMxzNBMP4bGZ+AblefcI6847Ebilgfm9DZ3c8mZqho1fBXOiKCEIfWimbbsHWLo5l7QWSIlbfgp9saGZnt+odFMbhVvIb+vsUvmMPN2Vnp0vtcZp3ODK5fN4m4rnQgWq8vwfLWpNKGxxKA18UsRqaULrr0qExiO22R+UWxyeoxxCqkrKzdT22N+ZKh4v4i05yRt2lfji3vnMmwFscz0JENHEjsBYuqEH2PDSVHnDuh0A3nmdqPX7Cn2m1//lJ0kq8/eFux4xtP1r6QQ1c3k2bfTKJriGKHwtVGM8u0z+E3juArUYZFNZX1Of5QhJJIHugydhWAiIxGjdUalPTkqD8ZmTE88ARelGdOjEvjcXQaJZ4pYv0arxzRoki2XNeq2bBLMF6UVtuPXOPqvCvRN5GQuJVVN75IXv+w==~3491129~4407860";
      "x-coupang-target-market=KR; x-coupang-accept-language=ko-KR; PCID=17657245803754219216011; bm_ss=ab8e18ef4e; bm_so=41D57DAB9441283BDD87C21BAA411BE2DFC93D9E124A33CC9DCECB7A81C86281~YAAQ3Yj+ecteB7maAQAAd+tiHQZ4BLIezzQVBBVblcRmGWL1/xlGXjRWeYLmZr8f5xxHWuE7zRgRdV00Tqzlwbf3XnLAldTBgN9gBd6zQE1Qq/vJFQjNFmHk64D2+G+iylh0XfFccLJ2h0RuNKxoaOHt+Kgr6nhAx0P5PomFLDa49FnNCVGv4UU7rTrg+2ARfrGQLZ+Xuuky+itu0fAKZHQm+dJb3ngIdv5p30AI+YSS+FbvOqEHZECkZAEERhAjCfuAI9mWv7t6wall/HTs+ZAAnOgbADIYsUu3nXrpUaZ3bv9Qw+to8SQlY6HsubvVHELyHTrassH9v+53ltvH6eTFHBNO3fTxAqnRYR5t6lUhN010CI6Ruu2aGVAMnY9Yg45gukHTgBWaC/VIDd92Fz46ELhDrYzYn5dRbOXAzGuRGmV5L1GcYeOwcunnAOX7qRaMc4KZ5ltmJjRfTBpLeg==; bm_lso=41D57DAB9441283BDD87C21BAA411BE2DFC93D9E124A33CC9DCECB7A81C86281~YAAQ3Yj+ecteB7maAQAAd+tiHQZ4BLIezzQVBBVblcRmGWL1/xlGXjRWeYLmZr8f5xxHWuE7zRgRdV00Tqzlwbf3XnLAldTBgN9gBd6zQE1Qq/vJFQjNFmHk64D2+G+iylh0XfFccLJ2h0RuNKxoaOHt+Kgr6nhAx0P5PomFLDa49FnNCVGv4UU7rTrg+2ARfrGQLZ+Xuuky+itu0fAKZHQm+dJb3ngIdv5p30AI+YSS+FbvOqEHZECkZAEERhAjCfuAI9mWv7t6wall/HTs+ZAAnOgbADIYsUu3nXrpUaZ3bv9Qw+to8SQlY6HsubvVHELyHTrassH9v+53ltvH6eTFHBNO3fTxAqnRYR5t6lUhN010CI6Ruu2aGVAMnY9Yg45gukHTgBWaC/VIDd92Fz46ELhDrYzYn5dRbOXAzGuRGmV5L1GcYeOwcunnAOX7qRaMc4KZ5ltmJjRfTBpLeg==~1765724581022; ak_bmsc=4E3531B44DE1E4A7AE90A610F70057A2~000000000000000000000000000000~YAAQ3Yj+eVpfB7maAQAAxu5iHR77EaczR6Ll/KBKeExkjhb9xjOqVX/kUkRUPRfnh/VIIH2/BtfO/IYbjzGtGnII6JOtpPaN8IKsaMLsrktI7J+8jCIKu4LPmAxsp1m6M+0mFvIkPFlmHWPruUQODtve0kYULjSTBywIfmCcllTvdSWktfcUDwUg9aj9qA1R6vc9ecsr9+YktpxPIIkeQ6ETOJxHARRUFABcyk4CojWQRWv2vj5JDlRHiulOI2+uWbesg9MmOlQJ/KLeTLeGei2PMWgSGVy/M+8gwn8v703ZsqDPgSPY1WoDBqKu0zfxXG8L2IOX6l3QKwcniJiiA6ShdvE2TWEmWjiZwouK1PPUkgGym5b6QrkNXm9w3XRCuQjLrxz0dlTKRF6hTaVsZh0q8pZx7cUB0L+PW0E/xgiuwh2X6ycqP5mtNGLhcvKyR1gx1maueYOlr1/wfd1JMQ==; sid=d915e5d731c2401d8968955892d05d3ada5f6f26; bm_s=YAAQ3Yj+eQJgB7maAQAADfJiHQSWDAFgTFEk2DLdwxlAOfytUD6rCN+Ynm0g5goVd7mjiTO1r8JD/0EuztzKhbtpk8RdNf5HX5THIgqPqJ+rc84kc6s3w8t9zemSwxKwCE2p4bE/hHFowuPwnYLuPjS013DrEgxKL1kc7v/WlpPbjM9spDn38DdHO1wqnozpJbbSZp/o6+Al8YDi0BrDDwV3jRLqiN99FO1IVackOiBp1BaTjuA/KltUekHdfjp4rVPSmNXL8ysDOjlz7D3VgobJqYPr8YroX5xoNqgA6ON+PiDXWM16jdODAvIEptjPGkEL76w0GQslVNLEO2xT+3hsvdX9nFtIDqVH4A5uXlSlEwgxbX6p1oWL5EaXr9Nb+Zc9DSQr9C9dMx7jrF2ruqaRpFC5AUhc/t6hQNXUedJ+Y1SMmuo01TzyZu+GgDIcF2n8VceNc+ebhDy4BHfiA5euyduNfg1sOWMqrTgbveovBSH5hpzVfsJ64jt/UD2XaVU4CtZ7G4TUgWA/a2Woddbu4JM2grGsqZgUR+365RSPaKtCYf4=; bm_sv=804B8F6860E2895EBCBC67327561EF8E~YAAQ3Yj+eQNgB7maAQAADfJiHR7GdNLzTh3jgLScZZnJrmlAYmdfqFqmLAu26qYAXtTEdYBNbzQiErBqOp8g6oBsZx50GghyKJjIi2T/VOietTu033jLnI05LjJSCS2PMCRWjlGAL6IrKY7kSXb2l2TO9xpPKaLAeEOzsvPx/mECVqM/f08okAWRnD3XD8SOfyUADJlCt7f+BhYuDVACVz/f9FacnGq7yVq1wEHytFun1ko6k1RjJOiofng360bNYA==~1; bm_sz=C20D8C1B138F69D83DD1192F8ADCDAD9~YAAQ3Yj+eQRgB7maAQAADfJiHR6h7K+bt/zZIkeMMqc4iBD/73X+rAQHtYh5IMHAmVw5tMCGKnzbNBjwTdF33i0bYVtMEsoJ1Yex7K2b2HqF/vnFrBZwfVJoWdyZaJDm+quF6TDTBNZwwAxasYup7KrpZ5fZDwZh2dfECaQTasCOXS1QZY31Zubr0rkvEvCvgtkD8SZdwRA0NGK97YkvVVVGjwBXOtO9kOqj5SLvFXR0GqchYnRZSQHtYI0RKsNAED0iYVWPRVpnmrSMePjHe3k8ENgjXNWfDk3McKgH9qubgpcF2NTgkLU4f0NHQDnRq12P1mdxjaAyCZ+lH8HkRWMfYO3+t7bcnr0IY9nFn/KofaFz3vH1jfSSuzI5EGmioxTsqPoaHzFIqsOYuQYVtXHeIiE6~3290929~3290679; _abck=A9BC6EF21B71974ABEED59BA6F0DA191~0~YAAQ3Yj+eQtgB7maAQAANvJiHQ9nb43y3mRX8BjVlHNoHTax/Y+wB9UtKWgiB4eCp+Fpv/wEyb06hsag0GFGa0ygJpjhYncgDh4HM7iSzR5d8lOaWp1nWpyqmbNMn8d13WrNb00Q8epYRc0nmI+MHOCsqO+XRf9id2peW/F73EZivE75cs0229VuVxZyZRsSLDWaR8C20ODWtI4Ro3CSaSIXCbGRwjnvGUP0l2z6IyfxlWkfyIn4GwW9y172mZCgMiVsY61gFkWodEiURLxpOS1XIW4bQ3NhtCazq0pbR2Mrd1FUc9Y5vOIgvESWTNbaU7Fkkjg1IbfXizCjvebzA+vb8vaEk+HDoiUHnUXEAy87FVLVjkHKecGZpLc1wUOfOiRZSuCQMOsC8qTBtr6B3D4WEhNhePz6OCGYgUKw8w5Sn5w8rYLQhQpVS7rE4LN3au4kx7x/CH0BXTxiIl6OsTmHqUxET27K0+z13YD7c1pClQuK57dsNsgNCr9r34Ey2zNCDYVV292EcM8w+fFJOZCXlRooxntuCYMfWiZuw4rTTg2vYLENgCNapD8/3brQAA7Fwqo4+smVBhhmmbBJxi6rhA8Jn71ZqkepS4ZVm6AEj2hmrPXlXj50SxfuL9aATu9f~-1~-1~1765728181~AAQAAAAE%2f%2f%2f%2f%2f2xNAPtNTWWWU9i%2f4mYCXw8msvkCQRkl4DNyO2prCGtrKlw7xcG0fqZDqoSndZyjSHxZzdq8F7CDoCxW%2fdUiN27abOctAzfmNRBj~-1";
    const response = await gotScraping({
      url: targetUrl,
      method: "GET",
      headers: {
        "no-cache": "true",
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
            name: "chrome",
            minVersion: 110,
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
            unit_price: unitPrice,
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
