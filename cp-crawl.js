const myHeaders = new Headers();
// myHeaders.append(
//   "Cookie",
//   "MARKETID=12740477998490946916376; PCID=12740477998490946916376; _abck=1B65F38949165669230138FF2AD4F43E~-1~YAAQWGf2SM5ZA0iWAQAApgGTVw1/HTvLXjudT8ThvwxnU2VvLZcFtBTchKP8KeXcUQCj/tEJvLzimRnkYbJAYNr4wZoq/APf+4kXn+Ipsf904Mj+O2UcvcKkIS8/75fSAN+lyehJPsIuc+4AYhWd0Ncajs7dOqqteSZjg5CQ5rtfggSRCkpYyXtaFpj9Mdb6R6BivYhBeXxraTGWOjBjHJOEozUFefy8F0tycTqoZf+E+c554X7SKfA9zOtDifv9xOQjf0i1WNSVWM2lbtzYc+iH7HSmSAgxc1IbfFCvxVvIPq0djfDCPqDRlO9ObIO0qOp2lzO/qgmc1ks8JlpjemjX64NvXDk5IpQthPUnfdu4Rk0VeZiwwFhKOp/IzQl/OcwEmpXbP/AqYA2jjTaUvbYMaeH6VVPXeoPct/NCEGhVZ7rilvgBD9k=~-1~-1~-1; bm_s=YAAQWGf2SFRaA0iWAQAAAheTVwPjuGxSeUVjydVLBif6bAQkyXT88ywA6Fusg1FZk//7PMtY53Ne2UBWXHh5B3P33C6QUVjm3HCuQYZw0Nzi98XzvAp5UsoqRaJ/Xi13YxWta/l/5s/TfmTT0Upg6TBtvgLWZ6oxYCaEGR2tCfIgnFKkFVfBf5D+raWpPzEHUAkh8AtENDdg63yQmfwPqoOGcZZUVYZal7OUZsCz5MbExsdyAuShWfkLlHrar9SHg1h3nokwPk3A78/9Tf3WFJMRvaR/N72XJkrrpc+tMFq91PBOGo0URn1xp2yFrGQGPEkx/MGmOA7+H3QFcEj/qTr687Akpf20HduzBr2Q4MlciibvoLJmRrFjlKvVEzvpUGxS7yPHVBPfbbQl83T3K2//zmIkwmWod+q4EX2OfDwx3IA6ODi8v/nuGbdfV14d37bJE2y8rE6E2TvfWQQ=; sid=893e2feb92914776a4ab0f782306d1373c205384; x-coupang-accept-language=ko-KR; x-coupang-target-market=KR"
// );

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow",
};

fetch(
  "https://reco.coupang.com/recommend/widget?productIds=7545917765&itemIds=13839086102&vendorItemIds=78716677180&widgetId=APP_SDP_001",
  requestOptions,
)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
