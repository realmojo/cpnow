const getCrawlList = async () => {
  try {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    const response = await fetch(
      "https://cpnow.kr/api/crawlwait",
      requestOptions,
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("getCrawlList 에러 발생:", error);
  }
};

const getProductItem = async (id) => {
  if (id) {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };
      const response = await fetch(
        `https://cpnow.kr/api/product?id=${id}`,
        requestOptions,
      );
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("getProductItem 에러 발생:", error);
    }
  }
  return "";
};

const sleepRandom30to60 = async () => {
  const minMs = 5000; // 30초
  const maxMs = 5000; // 60초
  const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;

  return new Promise((resolve) => setTimeout(resolve, delay));
};

const run = async () => {
  console.log("🚀 START");

  while (true) {
    const data = await getCrawlList();

    if (data && data.length > 0) {
      for (const item of data) {
        const { pId } = item;
        console.log("pId : ", pId);
        const productItem = await getProductItem(pId);
        let { link } = productItem;

        // location.href = link;
        console.log("잠시 기다림... 5초");
        await sleepRandom30to60(); // 잠시 기다림
        window.open(link, "_blank");
      }
    }
    // 잠시 대기
    console.log(`⏰ 한 바퀴 다돌아서 5분(${new Date()}) 대기`);
    await new Promise((res) => setTimeout(res, 60000 * 5));
  }
};

run();
