import { NextRequest } from "next/server";
import { getTodayDate } from "@/utils/utils";
import axios from "axios";
type ProductParam = {
  productId: string;
  vendorItemId: string;
  itemId: string;
};

const getCoupangItemRequest = async (params: ProductParam) => {
  const { productId, vendorItemId, itemId } = params;

  const cookies = [
    // "sid=ab0a0ce72bfb425494e3bb300e8feedc18828dd0",
    // "PCID=10936919318449480680884",
    // "MARKETID=10936919318449480680884",
    // "x-coupang-accept-language=ko-KR",
    // "x-coupang-target-market=KR",
    // "_fbp=fb.1.1745118047358.419499054811712738",
    // "ak_bmsc=0D4C780433DD9497E85B79A7F4A2D8B1~000000000000000000000000000000~YAAQtuQ1F/ZlEyeWAQAAXi4kURvu04sB76s7UzaqBIE/UzpZAIsJRHHiJCUEdpcZxH/YKw7Y5B5fkAtaeJjN+m3Z/coCElex/CxCV++SjOZC2xrAHvQ23cSPUIcvpFBjw5NS2n9YLkXL6ECx2nohceRtQ0bYCElXKArzZyYC4T0j46b98rvRElyEVXUFs9p4AdjURKyuI4iIPosKy5hlTCCY50v3eYS8OJCMiYHQpYo2r4Aa1MDROdA9ueNhOPC8eWn0ecbwc6P8VJwqbuzNL7HezeuAosiTCzocfJk+KQezSCUIzNgIOX82ssBZ/mBh4PbCSc/c4vDaiPhPluJQ6/46TJUKs4ahyd5iNsChIY90bheqGv3IiDgbAuL3vsdyxrjJy+7tWa0DsFK5PGWXPc+rpd+S/d5UQ1B4PF9GaAxne0wOv/cuYcTxSAlmmVpaEY+CTazqZTaOe3XVhBkX",
    // "bm_ss=ab8e18ef4e",
    // "bm_so=5B0367F6206346DFFAA2505D74F58E23908C92615F4425F75C4AFCBF6E4F05B0~YAAQVOQ1F2u29UCWAQAAIvReUQN4FvJg0XYSoTmXi6WOevXltl0zo1/WHUjBh/i9PzGOeLo4f6y/wMC+RWKdkABhY56AF1aoQBxTgObdXJnaRZ+glBQJ+h2/Oi6A6o+PFb0RBcpS5Ak13KSTY4pbqc2WQ8IFDziGIPWwLABd04JFMs2YM2/wEI8vbJoAIJB7VbdWpUKTEmO9G4/0OV6sv0GV4IptXpPOhWdo3UXe4AZkIo+BBO38j/y974AWanXRMjZdr7QiZKv7eeyi4Ogc0AHK3Jz844+aTOd8euuKm6xipuMjyOAL82B8f/yi9ZvM3RQ5UfHmWtq+R5tz4pazlogJuuxVAXjRJHYGa4Dwictve9yowC1vf6CRejP3Gn4v9PJX6kXmOkpksGQbuvsqotpV71FSwCLh6VYRqorHRYl50+yziZMcmp14YL0F8B7WGqFLBlEZjBkOy53r8yl7PA==",
    // "bm_lso=5B0367F6206346DFFAA2505D74F58E23908C92615F4425F75C4AFCBF6E4F05B0~YAAQVOQ1F2u29UCWAQAAIvReUQN4FvJg0XYSoTmXi6WOevXltl0zo1/WHUjBh/i9PzGOeLo4f6y/wMC+RWKdkABhY56AF1aoQBxTgObdXJnaRZ+glBQJ+h2/Oi6A6o+PFb0RBcpS5Ak13KSTY4pbqc2WQ8IFDziGIPWwLABd04JFMs2YM2/wEI8vbJoAIJB7VbdWpUKTEmO9G4/0OV6sv0GV4IptXpPOhWdo3UXe4AZkIo+BBO38j/y974AWanXRMjZdr7QiZKv7eeyi4Ogc0AHK3Jz844+aTOd8euuKm6xipuMjyOAL82B8f/yi9ZvM3RQ5UfHmWtq+R5tz4pazlogJuuxVAXjRJHYGa4Dwictve9yowC1vf6CRejP3Gn4v9PJX6kXmOkpksGQbuvsqotpV71FSwCLh6VYRqorHRYl50+yziZMcmp14YL0F8B7WGqFLBlEZjBkOy53r8yl7PA==^1745121900135",
    // "overrideAbTestGroup=%5B%5D;",
    // "bm_sc=4~1~748682941~YAAQVOQ1FwW39UCWAQAAlvpeUQPAtBxVjRl61JC7o3XiwwqmgJBlqsp2Qycyw9ViHy7LIDdDObnL3k9g2a4qThbFViKuidnbALMJYrMRV7EVhRt/xirtB5B256tD9R+DA6zw6omtGH0MGXS2qM3NNB7RmopyQg8GHmuofiHPEvtByrNOSlECEbNqzs5NxBKvzMGeAgxVxcx2KJWtl7JnXzqWgzpS9uNXxs9/iXHCTAqEUDldRmHraGJa3v6GkOI5d65/+pR1aFuSwGMI3qcxUUUntRpi9oK/A6wELzylTVViup1oOMuoN7J4MuQF4AL9sStdB4bzUjy4IpvMthO01TYQQQgPKlIHbA6YFYrfRW5bstgOSrCQ8koMNbYGXBTQo84xunHeNkXVGS05kRs=",
    // "web-session-id=92b2821d-c382-4ea6-bf64-c99295a825f9;",
    // "baby-isWide=wide",
    // "cto_bundle=b5rRRV9uN1o4c3IxN0c1VXd3ZUMzYlNlRDhGRWpTaGpibk1kdFI1Q25RNENsSzlFa2tqb1hLWkZ5NmwlMkZ2V2xRRHduRXAxZVJzQWdQSVAlMkYxTVBzbjJiUlVnSzR2RjJaNG5tOE16bGNwR2UwckFXdWxkc2VrcHk5WWRsem1UcHBvQVZTWTE",
    // "bm_sz=C4240E8050D71200E3AF1659B3B2C32D~YAAQVOQ1F3i39UCWAQAAdf5eURvf1BHoIfQvmrpUmwJ+fmVFCcQ7fy1sc763ozAVgKodM1BXHnUyMTypuf3qYj/OeA0ljqrvcQsYRB3fzZOiWJiu0ZvI2gc3S2eN0LabsZ8fHLiktDAq0Fkmax2IQpZbmND/eWiqxDY6fZQRUL6wxSoeeCitexx0wrWKa9V64IGYzbXflmtb0tGHl5N59V5+FSuiVks28gYbLBC3tUnNxr/K08+I6PJJGCgJtXBMgIewBsMfNic+ySygsosA2TBCjn9u8ACime6w8HkEEhnkrMYdFDtpniueWLTuJwdunCFxAmVgqLDimLuq8FfoA1xMESuPBPKIYPoEUaAUau7myaSV6/014Gc8gntmRLpo7VQ6Qcvl8S0Tig571j6udGou+puj3FUibsMJubUlQVOWVjzy27/PPb9Ww+CMOOmKrCxnPDAINkSX~3225399~4470067",
    "bm_s=YAAQVOQ1F3S39UCWAQAAc/5eUQNXfoQxzss9odfJG5/m9n6o34upZeEZmHAXswiR5AKiO+dj5CTzLY0u9hAwbuOlD/TNm/RhhrhldxnRC25hFWM6SMcSi9xMpUyCSzR4+e0CRgCTfY6h1xqqK86QHE5hwTpeg3uDq2HKmidJRa7FuAOeIx9bEh0XsadTk4a0u9f5Y0Zr7vOUgTgkzRkmV1OS4zshKJ8iuTYoLRkHvyQOFHC3QwQtzTO5bk9OMRLIcZyJPPO0j3IDoZuduVif3P8nY2AfhcXY8C6YDW3qDIaUEt77i2Is4+HaWv54tMmYqhpm5b4abf1GfKJyhky0wIZTJbWqm5pYinBZ30MbMX5cgRVo2mabqzGunltMnMCtc++XJhjbVghdWt70s1UkaAYuAISpGddKphXWUiHSnDHYMUrd0jv7+4D97ac5h8QU1aw0UKlCSi2+F8iWPPhIU4uxfagqreTSLZM=",
    // "bm_sv=C99BCE32EA80FFA2ACC08CC6094B0B87~YAAQVOQ1F3W39UCWAQAAc/5eURuDTpRPQROe4SS1zieLvV8DIGSIxLwa+SXfwzaUr3/fVwuqcZoW8QnYVPosgaPDHnmICMf7nRwdebOKKZmmv0tk46Jh2qfgiuTWTUVk6mbEZ0ZVVnzbmecHpbWlY4Y+AO40whQfl6GPCxx9a+1vVPHiWRyYcn2TN++zQ/XKQpjAW7gHPpeE7MfcsskYjOXPBaBY2ehP5QI6eoPXpMRcEZlB4H7k6dsoWUVsSE21ltE=~1;",
    // "_abck=EF7BE2B0C29338B5C33C11FD1D8D6943~0~YAAQVOQ1F4a39UCWAQAA2/5eUQ1L5Rz+WMogdPgK7+VwPnSNP7FyhbpTWbOSOPtsA6C0QB2j4JiQzV5HamYGz4OeGJuIq7e5A1LBiGOWt7j7OWrrqpQEfAR2NMCRCGpLzemk6k4mXUY8G5eDhSvHn+qvhFB4sePZ4uLDXoG0tZ9YQLHyeufXa+0mJblFg9+625sb1SrM9bb9duEGEoNjfh/zLCPNDlJ3EVn6CVo+6ZpvKof7T4wwdxPX+sJydKizRYFm/ripyLkZhRvqAP8bYLtzlk7DYt4SYeooYtthT+0do1upVzu8FzY2Mme1G65IYDZpLLMjBMIiDFFL0Ey69qYB7fvsXuOxqXwgTWe1h2OA8vw9LEuCvs9jrLSpH3s1uYXQ+6hHTiKq14HjJjYZlOvJG844Q3hMYuulTbvr95Gd2idai8o/NuvRkZwBwufhoFKCGZDOSKds/KcfvOERgRdFlAdwDvuJx//XMpDzzENv4ZSVNA+8qPFta/aVUQNPGBBbeyMZ+1zzXlyXZQjFafWu/hTTYCYY+/aXi9Trj2Y4hdG+y6b7HBL5br/qlDyql53deBZY+V2bgTpKo0CEiRdF~-1~-1~-1)",
  ];
  const myHeaders = new Headers();

  const referer = `https://www.coupang.com/vp/products/${productId}?itemId=${itemId}&vendorItemId=${vendorItemId}`;
  myHeaders.append("Referer", referer);
  myHeaders.append("Cookie", cookies.join("; "));
  console.log(myHeaders);
  const requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const url = `https://www.coupang.com/vp/products/${productId}/vendoritems/${vendorItemId}/quantity-info?quantity=1`;

  try {
    const response = await fetch(url, requestOptions);
    const json = await response.json();
    return json;
  } catch (err) {
    return {
      status: err,
    };
    // return {
    //   error: `🚨 쿠팡 수량 조회 실패: productId(${productId}), vendorItemId(${vendorItemId}), itemId(${itemId})`,
    // };
  }
  //   return new Promise((resolve, reject) => {
  //     // const myHeaders = new Headers();
  //     const { productId, vendorItemId, itemId } = params;

  // const options = {
  //   method: "GET",
  //   url: "https://www.coupang.com/vp/products/8541009492/vendoritems/88741950221/quantity-info?quantity=1",
  //   headers: {
  //     Referer:
  //       "https://www.coupang.com/vp/products/8541009492&vendorItemId=88741950221",
  //     Cookie:
  //       "sid=ab0a0ce72bfb425494e3bb300e8feedc18828dd0; PCID=10936919318449480680884; MARKETID=10936919318449480680884; x-coupang-accept-language=ko-KR; x-coupang-target-market=KR; _fbp=fb.1.1745118047358.419499054811712738; ak_bmsc=0D4C780433DD9497E85B79A7F4A2D8B1~000000000000000000000000000000~YAAQtuQ1F/ZlEyeWAQAAXi4kURvu04sB76s7UzaqBIE/UzpZAIsJRHHiJCUEdpcZxH/YKw7Y5B5fkAtaeJjN+m3Z/coCElex/CxCV++SjOZC2xrAHvQ23cSPUIcvpFBjw5NS2n9YLkXL6ECx2nohceRtQ0bYCElXKArzZyYC4T0j46b98rvRElyEVXUFs9p4AdjURKyuI4iIPosKy5hlTCCY50v3eYS8OJCMiYHQpYo2r4Aa1MDROdA9ueNhOPC8eWn0ecbwc6P8VJwqbuzNL7HezeuAosiTCzocfJk+KQezSCUIzNgIOX82ssBZ/mBh4PbCSc/c4vDaiPhPluJQ6/46TJUKs4ahyd5iNsChIY90bheqGv3IiDgbAuL3vsdyxrjJy+7tWa0DsFK5PGWXPc+rpd+S/d5UQ1B4PF9GaAxne0wOv/cuYcTxSAlmmVpaEY+CTazqZTaOe3XVhBkX; bm_ss=ab8e18ef4e; bm_so=5B0367F6206346DFFAA2505D74F58E23908C92615F4425F75C4AFCBF6E4F05B0~YAAQVOQ1F2u29UCWAQAAIvReUQN4FvJg0XYSoTmXi6WOevXltl0zo1/WHUjBh/i9PzGOeLo4f6y/wMC+RWKdkABhY56AF1aoQBxTgObdXJnaRZ+glBQJ+h2/Oi6A6o+PFb0RBcpS5Ak13KSTY4pbqc2WQ8IFDziGIPWwLABd04JFMs2YM2/wEI8vbJoAIJB7VbdWpUKTEmO9G4/0OV6sv0GV4IptXpPOhWdo3UXe4AZkIo+BBO38j/y974AWanXRMjZdr7QiZKv7eeyi4Ogc0AHK3Jz844+aTOd8euuKm6xipuMjyOAL82B8f/yi9ZvM3RQ5UfHmWtq+R5tz4pazlogJuuxVAXjRJHYGa4Dwictve9yowC1vf6CRejP3Gn4v9PJX6kXmOkpksGQbuvsqotpV71FSwCLh6VYRqorHRYl50+yziZMcmp14YL0F8B7WGqFLBlEZjBkOy53r8yl7PA==; bm_lso=5B0367F6206346DFFAA2505D74F58E23908C92615F4425F75C4AFCBF6E4F05B0~YAAQVOQ1F2u29UCWAQAAIvReUQN4FvJg0XYSoTmXi6WOevXltl0zo1/WHUjBh/i9PzGOeLo4f6y/wMC+RWKdkABhY56AF1aoQBxTgObdXJnaRZ+glBQJ+h2/Oi6A6o+PFb0RBcpS5Ak13KSTY4pbqc2WQ8IFDziGIPWwLABd04JFMs2YM2/wEI8vbJoAIJB7VbdWpUKTEmO9G4/0OV6sv0GV4IptXpPOhWdo3UXe4AZkIo+BBO38j/y974AWanXRMjZdr7QiZKv7eeyi4Ogc0AHK3Jz844+aTOd8euuKm6xipuMjyOAL82B8f/yi9ZvM3RQ5UfHmWtq+R5tz4pazlogJuuxVAXjRJHYGa4Dwictve9yowC1vf6CRejP3Gn4v9PJX6kXmOkpksGQbuvsqotpV71FSwCLh6VYRqorHRYl50+yziZMcmp14YL0F8B7WGqFLBlEZjBkOy53r8yl7PA==^1745121900135; overrideAbTestGroup=%5B%5D; bm_sc=4~1~748682941~YAAQVOQ1FwW39UCWAQAAlvpeUQPAtBxVjRl61JC7o3XiwwqmgJBlqsp2Qycyw9ViHy7LIDdDObnL3k9g2a4qThbFViKuidnbALMJYrMRV7EVhRt/xirtB5B256tD9R+DA6zw6omtGH0MGXS2qM3NNB7RmopyQg8GHmuofiHPEvtByrNOSlECEbNqzs5NxBKvzMGeAgxVxcx2KJWtl7JnXzqWgzpS9uNXxs9/iXHCTAqEUDldRmHraGJa3v6GkOI5d65/+pR1aFuSwGMI3qcxUUUntRpi9oK/A6wELzylTVViup1oOMuoN7J4MuQF4AL9sStdB4bzUjy4IpvMthO01TYQQQgPKlIHbA6YFYrfRW5bstgOSrCQ8koMNbYGXBTQo84xunHeNkXVGS05kRs=; web-session-id=92b2821d-c382-4ea6-bf64-c99295a825f9; baby-isWide=wide; cto_bundle=b5rRRV9uN1o4c3IxN0c1VXd3ZUMzYlNlRDhGRWpTaGpibk1kdFI1Q25RNENsSzlFa2tqb1hLWkZ5NmwlMkZ2V2xRRHduRXAxZVJzQWdQSVAlMkYxTVBzbjJiUlVnSzR2RjJaNG5tOE16bGNwR2UwckFXdWxkc2VrcHk5WWRsem1UcHBvQVZTWTE; bm_sz=C4240E8050D71200E3AF1659B3B2C32D~YAAQVOQ1F3i39UCWAQAAdf5eURvf1BHoIfQvmrpUmwJ+fmVFCcQ7fy1sc763ozAVgKodM1BXHnUyMTypuf3qYj/OeA0ljqrvcQsYRB3fzZOiWJiu0ZvI2gc3S2eN0LabsZ8fHLiktDAq0Fkmax2IQpZbmND/eWiqxDY6fZQRUL6wxSoeeCitexx0wrWKa9V64IGYzbXflmtb0tGHl5N59V5+FSuiVks28gYbLBC3tUnNxr/K08+I6PJJGCgJtXBMgIewBsMfNic+ySygsosA2TBCjn9u8ACime6w8HkEEhnkrMYdFDtpniueWLTuJwdunCFxAmVgqLDimLuq8FfoA1xMESuPBPKIYPoEUaAUau7myaSV6/014Gc8gntmRLpo7VQ6Qcvl8S0Tig571j6udGou+puj3FUibsMJubUlQVOWVjzy27/PPb9Ww+CMOOmKrCxnPDAINkSX~3225399~4470067; bm_s=YAAQVOQ1F3S39UCWAQAAc/5eUQNXfoQxzss9odfJG5/m9n6o34upZeEZmHAXswiR5AKiO+dj5CTzLY0u9hAwbuOlD/TNm/RhhrhldxnRC25hFWM6SMcSi9xMpUyCSzR4+e0CRgCTfY6h1xqqK86QHE5hwTpeg3uDq2HKmidJRa7FuAOeIx9bEh0XsadTk4a0u9f5Y0Zr7vOUgTgkzRkmV1OS4zshKJ8iuTYoLRkHvyQOFHC3QwQtzTO5bk9OMRLIcZyJPPO0j3IDoZuduVif3P8nY2AfhcXY8C6YDW3qDIaUEt77i2Is4+HaWv54tMmYqhpm5b4abf1GfKJyhky0wIZTJbWqm5pYinBZ30MbMX5cgRVo2mabqzGunltMnMCtc++XJhjbVghdWt70s1UkaAYuAISpGddKphXWUiHSnDHYMUrd0jv7+4D97ac5h8QU1aw0UKlCSi2+F8iWPPhIU4uxfagqreTSLZM=; bm_sv=C99BCE32EA80FFA2ACC08CC6094B0B87~YAAQVOQ1F3W39UCWAQAAc/5eURuDTpRPQROe4SS1zieLvV8DIGSIxLwa+SXfwzaUr3/fVwuqcZoW8QnYVPosgaPDHnmICMf7nRwdebOKKZmmv0tk46Jh2qfgiuTWTUVk6mbEZ0ZVVnzbmecHpbWlY4Y+AO40whQfl6GPCxx9a+1vVPHiWRyYcn2TN++zQ/XKQpjAW7gHPpeE7MfcsskYjOXPBaBY2ehP5QI6eoPXpMRcEZlB4H7k6dsoWUVsSE21ltE=~1; _abck=EF7BE2B0C29338B5C33C11FD1D8D6943~0~YAAQVOQ1F4a39UCWAQAA2/5eUQ1L5Rz+WMogdPgK7+VwPnSNP7FyhbpTWbOSOPtsA6C0QB2j4JiQzV5HamYGz4OeGJuIq7e5A1LBiGOWt7j7OWrrqpQEfAR2NMCRCGpLzemk6k4mXUY8G5eDhSvHn+qvhFB4sePZ4uLDXoG0tZ9YQLHyeufXa+0mJblFg9+625sb1SrM9bb9duEGEoNjfh/zLCPNDlJ3EVn6CVo+6ZpvKof7T4wwdxPX+sJydKizRYFm/ripyLkZhRvqAP8bYLtzlk7DYt4SYeooYtthT+0do1upVzu8FzY2Mme1G65IYDZpLLMjBMIiDFFL0Ey69qYB7fvsXuOxqXwgTWe1h2OA8vw9LEuCvs9jrLSpH3s1uYXQ+6hHTiKq14HjJjYZlOvJG844Q3hMYuulTbvr95Gd2idai8o/NuvRkZwBwufhoFKCGZDOSKds/KcfvOERgRdFlAdwDvuJx//XMpDzzENv4ZSVNA+8qPFta/aVUQNPGBBbeyMZ+1zzXlyXZQjFafWu/hTTYCYY+/aXi9Trj2Y4hdG+y6b7HBL5br/qlDyql53deBZY+V2bgTpKo0CEiRdF~-1~-1~-1; MARKETID=4582282478309293724418; PCID=4582282478309293724418; _abck=EF7BE2B0C29338B5C33C11FD1D8D6943~-1~YAAQbOQ1F06qLUmWAQAAoC5wUQ1bOrNGy0AOKs1EvPEjfvUM1Dw0GeKit+BKhuAdLlhTkjWWeRFYNPJQjSjm/Alg9Nj+X5ASBs1Fi57D0PXTjKq/yTrlqvUIOl+b6fL6HbllzT0pV+zNBz8ilSwu6AyTTcdzo0TPJJJpBQBDDbaMpF4+cPiIm2plHVzWKggnyin3HOiCqwyiwOiJ4JgsyfmLaUdOCAQCW8y3gKHBpAILExsQ6GeqJcORWJ4nEXwT5Qk3+FcW1GGHGMLjGp/CrIpHPyrIntVHaGkitM43vIXEiWiD5d6jirW3UMTmrugr6ddxVM/unysRO5oAT5tsL8/gXov4wnZHWK0JIvcy8ZQZFXGlxLt/1wCGUrFVNUiPTH5INBSD84xPGyDu9mGn5Ops+BcHD0jL1OAQQGaqPPJrPylAmp34wDrysGfdUYBJlIGD9LVkmqualDKOYfPxdL2nNvw58/A19y02YnRxjZcHNkntgWoQn6Ga5HtmnwVIWd6GRUP+2/HAxdcJFVBzH+AHf822fUkiuCI1fzhoHciVb/c884wu7v34NXEACQ7RTol6f++ON5NWv+eX/QPHn9qp~0~-1~-1; ak_bmsc=0D4C780433DD9497E85B79A7F4A2D8B1~000000000000000000000000000000~YAAQbOQ1F0+qLUmWAQAAoC5wURtYeGrKClOX+zUPjgs3by3lc2OxoLMz3xv0lhsnZUnGdTeq6VAFS4zMGnV84p/eYxaUPpkdNvvD9JoEy9GYuIfN7FcKdW82cdYr0lBiCqV6klCdpYCMRJ1nW3z0E/DQw/PAu32CjJRrXxn8bSvwhY3PsrWX5Hl3N1RpxVB5+Qt3zW4THSgSH4bTfKP01q7xzqpCL47dJpUwR5xVpokr0oi2TJwzcTuQZYZjquyPkRn26+g9v8rgkTLPuzeaD0zEZmb0Z1ye3tmf7oGT9QFmC1WCkfuHTTz2j6nioG3BWLiRoS2QRMGGeEXke/TlTyhAKT2Iypqr5ckaHFq2/DUA1PQCi43W/rnTi0RqsKA+OP5X5IHsHToLSTD71HmV1Oeoia7zlHseGtbyi3a9Ptm6VPDZ0jq4cZ+6WqECpKJ2Dw==; bm_s=YAAQbOQ1F1CqLUmWAQAAoC5wUQNoIosLtOdQm/zux33UOl9ESva8AyWP1nzcpyPfimhuv/EEkWG2//ymDFj9W+IYD7ZZBfgmiToBXAYQWzvRL2F0u/Grg7ZeqXHRFbNfnZGuXXya6ytd6ctLyM7uk7nh5oSWnTQVy68d1oSsTOTmbRYUxU1dniFjE/MEUmUYSB+jKtMl6741F5Ihc1zf6+UJlRrzjts8qfSZJEWP/Lbc4C7tCZb55pCEjc/hnnFA4JcrhUTitQZexvuAdX9spE7PC6sFdALwUdSwCPafZGbLf1W+ZJjydQ887S59IDS7gFYMYQrIfFl2zzLvoPfLQbL85pVoRaDS1fkAI5YDqqHAFbUI5+WT7GOFY3rb7bqRq5WrrIuddNE/kcvUNjpdZfBGn5N0ODh8SHoPZ0bim3Utn1yfLM5KZoIgmixQZYCjrZzauzav7uy8uomFBi0GANxMVuwocsMv6EeJbVg1; bm_ss=ab8e18ef4e; bm_sv=C99BCE32EA80FFA2ACC08CC6094B0B87~YAAQbOQ1F1GqLUmWAQAAoC5wURsQVQCJv9ScVTeLNjo2EFy+4dmYQME2WofEhIBaHFgmMoH6io7laJu0S3EaVoSO4Lp9Coa7ivgmI520nsehoCsYLz2UHFpIRpkem65ktcfGXM08FZMmnrI0AGbKBDmHB39k7uiOWlSeHb13Ptuy7oTicP0vWUO8UYiZyavppHT+uStZTTopeBOyIoLe2FSxYQuoqGxeeC548L9fqkDzLIargQZSoFKHM0OTpXQ2bsk=~1; bm_sz=BD0F4718CC3595247B6847DF6849E773~YAAQXuQ1FxgzESeWAQAAb05tURvreYkUXK3znNPllN8FFCYDb1AciFtSNP8wXr3LCMmaqIdh9s8OpBfFtA18bTD11sr+C53mDiyHahyrQJlu2JTa+gKB8JimVeiwHwqOBsZf/Ak6ZJyBJDoX/azZ323M9pz2oI7Tart6lcWoQGvwLEgE/aCvdprJFuAS2EGCJZBOHLmMyXLcnzWDAeML4RnJHYutS25jY1u2So9WOWGW4E8viZ5oCqc0daCO8JDSde4Kpcx59LORbKKzu3pxxU8EFFbCjRdQaU03X8PwNbW/RWNXGU1kM6/kHuEXZDeEwvQMvXjIUKfPiHxkU7n4r9O+m6g9p+ubugfZfkvlmWI=~3551281~4535607; overrideAbTestGroup=%5B%5D; sid=ab0a0ce72bfb425494e3bb300e8feedc18828dd0",
  //   },
  // };
  // request(options, function (error, response) {
  //   if (error) throw new Error(error);
  //   console.log(response.body);
  // });

  //     // myHeaders.append(
  //     //   "Referer",
  //     //   `https://www.coupang.com/vp/products/${productId}?itemId=${vendorItemId}&vendorItemId=${itemId}`,
  //     // );
  //     // // myHeaders.append(
  //     // //   "User-Agent",
  //     // //   "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  //     // // );
  //     // // myHeaders.append(
  //     // //   "Cookie",
  //     // //   "bm_s=YAAQDNojF8mAiEiWAQAAv47rSAPzX9vBQgD46eyg3ZZBP297KPcVCjsZjNdX01Nc8WjoBkU4HSIla1U9xtiM2VzeM6VBHl7p2gnXX25sTvRrkBgQnDeQz8pfq4gWuLNf+tB4V75H8ws4/WCJhTY1oDsU++9xjMy7rxiy7N8QfExz3jRcAter6BkXbpq9qTmsOAkI7bZ9D1eC0hTBoTrLBPbakJMvzqjZnAELA9QIzP6jPjCIdNFqcwmnZ2By/J/x9efMaX76w+hmkS2YVopBmhoKN9tE9Vmg02svD1F1OQJB+GsxBmcRWgxjbXHlqhkqCluortVKZLRDXUm0WRxbTnF7eY2epPHzZeX3GSYundH8bLk0BBY2hu9y0D5xSDiboiBEvLrBdJ4SYbLolFlYRTzU/i7xZkaM/HN6PHRHYbGhfaJPIvLijmiLzqTQp6Ht1gxN69iC0+euVQ==;",
  //     // // );
  //     // myHeaders.append("Accept", "*/*");
  //     // myHeaders.append("Accept-Encoding", "gzip, deflate, br, zstd");
  //     // myHeaders.append("Accept-Language", "ko-KR,ko;q=0.9");
  //     // const myHeaders = new Headers();
  //     // myHeaders.append(
  //     //   "Referer",
  //     //   "https://www.coupang.com/vp/products/2057097384?itemId=3496664341&vendorItemId=71482891598",
  //     // );
  //     // myHeaders.append(
  //     //   "Cookie",
  //     //   "MARKETID=4582282478309293724418; PCID=4582282478309293724418; _abck=EF7BE2B0C29338B5C33C11FD1D8D6943~-1~YAAQruQ1Fy+ZLEiWAQAAj+pfUQ0fPili8kR32wVVVQg0QyB9UfCvfo81cPlbOvY0P0vfZsrpYf7Q+bFnyQ5asT23N7VVCX7pGj3YUOoVU7OjSz6PXtFSbQZkKPP/IRCv4xo07GC4owvpoWw7KsUjL2PQJofSMbmyXrJXWPGM9+Smj/qXJLovUM3HD/aXrZoSB41NgBnuJi8oF/alRzpVwLdzRGbnxygG706RXc15Akv9+WK3LPtHrM3NQJmVSTykDWFn7FWWAJibwoeItGENPmpExADZZHerf9SFO7lr2gREpmHA0PZsimFgrES6AzMUZvXu78piaIMGy34YBgcI8CyjRFBXe0oIZ9HEk71tb/Je32ndapfaW025ZuX/ZL85+0XMsrPEIr6RYFE7L/ael3T22+Yo1/3GPFDwcM0ZljBM90Bjjbm/sr8STV6YLYLEu4fI5S4BiHsUhhL070R4Xqa/DsNhgLlWiiHZcfKctrw7Cl5DFcwN5P/fDewrmFHU0LpGuqMPj88EdgREptafcwbsok9hus5RKCrmrpwtMQy0Wla+BFthAuO6DfDCQGoiogiPfx28gOFKSyxF9RGWnY5+~0~-1~-1; ak_bmsc=0D4C780433DD9497E85B79A7F4A2D8B1~000000000000000000000000000000~YAAQruQ1FzCZLEiWAQAAj+pfURv0DUhYBR7FdFOl1WHvf02RLEJVPvRfd3fxeCGUP1XSqXKPTTYdJn9V0+ZMP/4364Alz8AF2tHxFOLj7PRt598tVjJbne13AOu+3Z5ZsvpvfG6lc2DDH5gAEfJ0a1kkMmNrL2Y0Q9FEYb0INlyssGnKUjaTL1LCmKRPTUMy/US5IgR808e3BTVmUVjaQF380IXqsR6xLQvxZjwKbzOc5OaTh/hd+VOi1Ql2xFZqAUiW3mDb1Frr10IJCH4IkewYXU0AC4OkJ1wwve5FvIfXFNZ/Fcw13QWZFHORLc3+rLsab3KOlDMJ4MEDHFVjmuAVfBnFfTZ1wj5AEMjoS+LL+SrtHcLyIIryO3C3pRR3AFAGs22te4JtBfInXrPcd+D0aPfcp5TXFOqJrE2CJX86+NmQ8znLVUSC2JnkXgFuiA==; bm_s=YAAQXuQ1FxYzESeWAQAAb05tUQO80zW6XYaIWf0la1fq6atcYHCl17sMNAS/E7kyz05TGjBhomRkp+bNmD8z5mw8XHwyvFACieFnO8i7cCHDv//gfhX9YZtzLwdwFj8HTkyzLdJ97LT3p/EVU5QdIhf+tbpUReIGqZ+Iz1MpDNNYIM4Hb6hOrKsVucI8/C5VwiOWG6Q4Ymk7gcImK+SRBoWoP8uWt4DSz5nZpPv2L720OpTov6MpjHsk/ApHpdybBjwVgtJ/PCBw1lZhOqwIWPYl0AdQ7zKeU20A0fVVB2SvuBS1D3bf62zhCUk/PUinE9RmWxe4XoLy860HXAOxi4iDm/Zb1tCkgfjMxJJmVoTW5hABg938f4TxiIuFv+H8cEaPHw7boHpt5QNuQkpApblPXzsilkKx7o+UY3EvvrhZ4pOpt39OsxrBJ9tQctlFLXc2woJArExJFKArb/NtkJo9/kwZqRrm1sP2Z0X4; bm_ss=ab8e18ef4e; bm_sv=C99BCE32EA80FFA2ACC08CC6094B0B87~YAAQXuQ1FxczESeWAQAAb05tURv09w7p982C+M+HzxaIEo0dOPHLYT3VV87/Km6+awydRD1EQB65PzN44eZ5DaTEsQK/uyi0T8KaKp2c07hzSD5HLthM9xaAC0E9JhT4bgDQEC8xdangK4yaRGD3Z5sNBfyHNgLEmEu9Iwyu9XcGeRFADPGJsJJnqT6pTQMpcUM3zTvxiQpKxAfjVylWUaDM5yojjZ8ib7LbriIkGsEIJ4hJmDGIDxU0UVidCH4tkd0=~1; bm_sz=BD0F4718CC3595247B6847DF6849E773~YAAQXuQ1FxgzESeWAQAAb05tURvreYkUXK3znNPllN8FFCYDb1AciFtSNP8wXr3LCMmaqIdh9s8OpBfFtA18bTD11sr+C53mDiyHahyrQJlu2JTa+gKB8JimVeiwHwqOBsZf/Ak6ZJyBJDoX/azZ323M9pz2oI7Tart6lcWoQGvwLEgE/aCvdprJFuAS2EGCJZBOHLmMyXLcnzWDAeML4RnJHYutS25jY1u2So9WOWGW4E8viZ5oCqc0daCO8JDSde4Kpcx59LORbKKzu3pxxU8EFFbCjRdQaU03X8PwNbW/RWNXGU1kM6/kHuEXZDeEwvQMvXjIUKfPiHxkU7n4r9O+m6g9p+ubugfZfkvlmWI=~3551281~4535607; overrideAbTestGroup=%5B%5D; sid=ab0a0ce72bfb425494e3bb300e8feedc18828dd0",
  //     // );

  //     // const requestOptions: RequestInit = {
  //     //   method: "GET",
  //     //   headers: myHeaders,
  //     //   redirect: "follow",
  //     // };
  //     // const cookies = [
  //     //   "sid=ab0a0ce72bfb425494e3bb300e8feedc18828dd0",
  //     //   "PCID=10936919318449480680884",
  //     //   "MARKETID=10936919318449480680884",
  //     //   "x-coupang-accept-language=ko-KR",
  //     //   "x-coupang-target-market=KR",
  //     //   "_fbp=fb.1.1745118047358.419499054811712738",
  //     //   "ak_bmsc=0D4C780433DD9497E85B79A7F4A2D8B1~000000000000000000000000000000~YAAQtuQ1F/ZlEyeWAQAAXi4kURvu04sB76s7UzaqBIE/UzpZAIsJRHHiJCUEdpcZxH/YKw7Y5B5fkAtaeJjN+m3Z/coCElex/CxCV++SjOZC2xrAHvQ23cSPUIcvpFBjw5NS2n9YLkXL6ECx2nohceRtQ0bYCElXKArzZyYC4T0j46b98rvRElyEVXUFs9p4AdjURKyuI4iIPosKy5hlTCCY50v3eYS8OJCMiYHQpYo2r4Aa1MDROdA9ueNhOPC8eWn0ecbwc6P8VJwqbuzNL7HezeuAosiTCzocfJk+KQezSCUIzNgIOX82ssBZ/mBh4PbCSc/c4vDaiPhPluJQ6/46TJUKs4ahyd5iNsChIY90bheqGv3IiDgbAuL3vsdyxrjJy+7tWa0DsFK5PGWXPc+rpd+S/d5UQ1B4PF9GaAxne0wOv/cuYcTxSAlmmVpaEY+CTazqZTaOe3XVhBkX",
  //     //   "bm_ss=ab8e18ef4e",
  //     //   "bm_so=5B0367F6206346DFFAA2505D74F58E23908C92615F4425F75C4AFCBF6E4F05B0~YAAQVOQ1F2u29UCWAQAAIvReUQN4FvJg0XYSoTmXi6WOevXltl0zo1/WHUjBh/i9PzGOeLo4f6y/wMC+RWKdkABhY56AF1aoQBxTgObdXJnaRZ+glBQJ+h2/Oi6A6o+PFb0RBcpS5Ak13KSTY4pbqc2WQ8IFDziGIPWwLABd04JFMs2YM2/wEI8vbJoAIJB7VbdWpUKTEmO9G4/0OV6sv0GV4IptXpPOhWdo3UXe4AZkIo+BBO38j/y974AWanXRMjZdr7QiZKv7eeyi4Ogc0AHK3Jz844+aTOd8euuKm6xipuMjyOAL82B8f/yi9ZvM3RQ5UfHmWtq+R5tz4pazlogJuuxVAXjRJHYGa4Dwictve9yowC1vf6CRejP3Gn4v9PJX6kXmOkpksGQbuvsqotpV71FSwCLh6VYRqorHRYl50+yziZMcmp14YL0F8B7WGqFLBlEZjBkOy53r8yl7PA ==",
  //     //   "bm_lso=5B0367F6206346DFFAA2505D74F58E23908C92615F4425F75C4AFCBF6E4F05B0~YAAQVOQ1F2u29UCWAQAAIvReUQN4FvJg0XYSoTmXi6WOevXltl0zo1/WHUjBh/i9PzGOeLo4f6y/wMC+RWKdkABhY56AF1aoQBxTgObdXJnaRZ+glBQJ+h2/Oi6A6o+PFb0RBcpS5Ak13KSTY4pbqc2WQ8IFDziGIPWwLABd04JFMs2YM2/wEI8vbJoAIJB7VbdWpUKTEmO9G4/0OV6sv0GV4IptXpPOhWdo3UXe4AZkIo+BBO38j/y974AWanXRMjZdr7QiZKv7eeyi4Ogc0AHK3Jz844+aTOd8euuKm6xipuMjyOAL82B8f/yi9ZvM3RQ5UfHmWtq+R5tz4pazlogJuuxVAXjRJHYGa4Dwictve9yowC1vf6CRejP3Gn4v9PJX6kXmOkpksGQbuvsqotpV71FSwCLh6VYRqorHRYl50+yziZMcmp14YL0F8B7WGqFLBlEZjBkOy53r8yl7PA ==^ 1745121900135",
  //     //   "overrideAbTestGroup=%5B%5D;",
  //     //   "bm_sc=4~1~748682941~YAAQVOQ1FwW39UCWAQAAlvpeUQPAtBxVjRl61JC7o3XiwwqmgJBlqsp2Qycyw9ViHy7LIDdDObnL3k9g2a4qThbFViKuidnbALMJYrMRV7EVhRt / xirtB5B256tD9R + DA6zw6omtGH0MGXS2qM3NNB7RmopyQg8GHmuofiHPEvtByrNOSlECEbNqzs5NxBKvzMGeAgxVxcx2KJWtl7JnXzqWgzpS9uNXxs9 / iXHCTAqEUDldRmHraGJa3v6GkOI5d65 / +pR1aFuSwGMI3qcxUUUntRpi9oK / A6wELzylTVViup1oOMuoN7J4MuQF4AL9sStdB4bzUjy4IpvMthO01TYQQQgPKlIHbA6YFYrfRW5bstgOSrCQ8koMNbYGXBTQo84xunHeNkXVGS05kRs=",
  //     //   "web-session-id=92b2821d-c382-4ea6-bf64-c99295a825f9;",
  //     //   "baby-isWide=wide",
  //     //   "cto_bundle=b5rRRV9uN1o4c3IxN0c1VXd3ZUMzYlNlRDhGRWpTaGpibk1kdFI1Q25RNENsSzlFa2tqb1hLWkZ5NmwlMkZ2V2xRRHduRXAxZVJzQWdQSVAlMkYxTVBzbjJiUlVnSzR2RjJaNG5tOE16bGNwR2UwckFXdWxkc2VrcHk5WWRsem1UcHBvQVZTWTE",
  //     //   "bm_sz=C4240E8050D71200E3AF1659B3B2C32D~YAAQVOQ1F3i39UCWAQAAdf5eURvf1BHoIfQvmrpUmwJ+fmVFCcQ7fy1sc763ozAVgKodM1BXHnUyMTypuf3qYj/OeA0ljqrvcQsYRB3fzZOiWJiu0ZvI2gc3S2eN0LabsZ8fHLiktDAq0Fkmax2IQpZbmND/eWiqxDY6fZQRUL6wxSoeeCitexx0wrWKa9V64IGYzbXflmtb0tGHl5N59V5+FSuiVks28gYbLBC3tUnNxr/K08+I6PJJGCgJtXBMgIewBsMfNic+ySygsosA2TBCjn9u8ACime6w8HkEEhnkrMYdFDtpniueWLTuJwdunCFxAmVgqLDimLuq8FfoA1xMESuPBPKIYPoEUaAUau7myaSV6 /014Gc8gntmRLpo7VQ6Qcvl8S0Tig571j6udGou+puj3FUibsMJubUlQVOWVjzy27/PPb9Ww+CMOOmKrCxnPDAINkSX~3225399~4470067",
  //     //   "bm_s=YAAQVOQ1F3S39UCWAQAAc/5eUQNXfoQxzss9odfJG5/m9n6o34upZeEZmHAXswiR5AKiO+dj5CTzLY0u9hAwbuOlD/TNm/RhhrhldxnRC25hFWM6SMcSi9xMpUyCSzR4+e0CRgCTfY6h1xqqK86QHE5hwTpeg3uDq2HKmidJRa7FuAOeIx9bEh0XsadTk4a0u9f5Y0Zr7vOUgTgkzRkmV1OS4zshKJ8iuTYoLRkHvyQOFHC3QwQtzTO5bk9OMRLIcZyJPPO0j3IDoZuduVif3P8nY2AfhcXY8C6YDW3qDIaUEt77i2Is4+HaWv54tMmYqhpm5b4abf1GfKJyhky0wIZTJbWqm5pYinBZ30MbMX5cgRVo2mabqzGunltMnMCtc++XJhjbVghdWt70s1UkaAYuAISpGddKphXWUiHSnDHYMUrd0jv7+4D97ac5h8QU1aw0UKlCSi2+F8iWPPhIU4uxfagqreTSLZM=",
  //     //   "bm_sv=C99BCE32EA80FFA2ACC08CC6094B0B87~YAAQVOQ1F3W39UCWAQAAc/5eURuDTpRPQROe4SS1zieLvV8DIGSIxLwa+SXfwzaUr3/fVwuqcZoW8QnYVPosgaPDHnmICMf7nRwdebOKKZmmv0tk46Jh2qfgiuTWTUVk6mbEZ0ZVVnzbmecHpbWlY4Y+AO40whQfl6GPCxx9a+1vVPHiWRyYcn2TN++zQ/XKQpjAW7gHPpeE7MfcsskYjOXPBaBY2ehP5QI6eoPXpMRcEZlB4H7k6dsoWUVsSE21ltE=~1;",
  //     //   "_abck = EF7BE2B0C29338B5C33C11FD1D8D6943~0~YAAQVOQ1F4a39UCWAQAA2/5eUQ1L5Rz+WMogdPgK7+VwPnSNP7FyhbpTWbOSOPtsA6C0QB2j4JiQzV5HamYGz4OeGJuIq7e5A1LBiGOWt7j7OWrrqpQEfAR2NMCRCGpLzemk6k4mXUY8G5eDhSvHn+qvhFB4sePZ4uLDXoG0tZ9YQLHyeufXa+0mJblFg9+625sb1SrM9bb9duEGEoNjfh/zLCPNDlJ3EVn6CVo+6ZpvKof7T4wwdxPX+sJydKizRYFm/ripyLkZhRvqAP8bYLtzlk7DYt4SYeooYtthT+0do1upVzu8FzY2Mme1G65IYDZpLLMjBMIiDFFL0Ey69qYB7fvsXuOxqXwgTWe1h2OA8vw9LEuCvs9jrLSpH3s1uYXQ+6hHTiKq14HjJjYZlOvJG844Q3hMYuulTbvr95Gd2idai8o/NuvRkZwBwufhoFKCGZDOSKds/KcfvOERgRdFlAdwDvuJx//XMpDzzENv4ZSVNA+8qPFta/aVUQNPGBBbeyMZ+1zzXlyXZQjFafWu/hTTYCYY+/aXi9Trj2Y4hdG+y6b7HBL5br/qlDyql53deBZY+V2bgTpKo0CEiRdF~-1~-1~-1)",
  //     // ];
  //     // myHeaders.append(
  //     //   "Referer",
  //     //   `https://www.coupang.com/vp/products/${productId}?itemId=${vendorItemId}&vendorItemId=${itemId}`,
  //     // );
  //     // myHeaders.append("Cookie", cookies.join("; "));

  //     // console.log("cookies", cookies);

  //     // const requestOptions: RequestInit = {
  //     //   method: "GET",
  //     //   headers: myHeaders,
  //     //   redirect: "follow",
  //     // };

  //     const url = `https://www.coupang.com/vp/products/${productId}/vendoritems/${vendorItemId}/quantity-info?quantity=1`;

  //     fetch(url, requestOptions)
  //       .then(async (response) => {
  //         const d = await response.json();
  //         console.log(d.headers);
  //         return d;
  //       })
  //       .then((result) => resolve(result))
  //       .catch(() =>
  //         reject(
  //           `🚨 쿠팡 수량 조회 실패: productId(${productId}), vendorItemId(${vendorItemId}), itemId(${itemId})`,
  //         ),
  //       );
  //   });
};

export async function GET(req: NextRequest) {
  try {
    // ✅ URL에서 id 파라미터 추출
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ error: "Missing id parameter" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ✅ 외부 API 호출
    const { data } = await axios.get(
      `https://api.mindpang.com/api/coupang/getItemById.php?id=${id}`,
    );

    const { productId, vendorItemId, itemId, lastUpdated, price } = data;

    data.thumbnail = data.thumbnail.replace("230x230", "600x600");

    const coupangItem: any = await getCoupangItemRequest({
      productId,
      vendorItemId,
      itemId,
    });
    console.log("coupangItem", coupangItem[0] ? true : false);

    // 새롭게 가격을 가져옴
    if (!lastUpdated || getTodayDate() !== lastUpdated.substring(0, 10)) {
      const nowPrice = coupangItem[0].moduleData[3].priceInfo.finalPrice.price
        ? coupangItem[0].moduleData[3].priceInfo.finalPrice.price
        : coupangItem[0].moduleData[1].detailPriceBundle.finalPrice
            .bestPriceInfo.price;

      const params = {
        id,
        highPrice: nowPrice >= price ? nowPrice : price,
        lowPrice: nowPrice <= price ? nowPrice : price,
      };

      const updateUrl = `https://api.mindpang.com/api/coupang/updatePrice.php`;
      await axios.post(updateUrl, params);
    }
    // ✅ 결과 반환

    return new Response(
      JSON.stringify({
        ...data,
        info: coupangItem[0] ?? {},
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);

    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
