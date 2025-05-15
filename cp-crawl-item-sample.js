function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const run = async () => {
  while (1) {
    await sleep(1000);
    const myHeaders = new Headers();
    myHeaders.append(
      "Referer",
      "https://www.coupang.com/vp/products/7535557148?vendorItemId=86776466577&sourceType=HOME_RELATED_ADS&searchId=feed-4d7951ea43544258982baffc3ee8cfec-related_ads&clickEventId=c51c61a0-3158-11f0-989d-3151df937fd5&isAddedCart=",
    );
    myHeaders.append(
      "Cookie",
      "PCID=9532304728558661331907; _abck=D14A13885DDCC4E270C35B3D8E6D406B~-1~YAAQBNojF+ESJs6WAQAASdS50g11dbgv423XbYAv8s/jaNK3rf0Yt3X1JTGSlzAt7ce6SFAICI0/R09h8adGT+fo+7Lv/2/OLAZjrNR1q53Hx1fyRpLDkEdl8KqUUR7+rQoFIhALfkmqPkKtAARL/vYgUrxUYbn8QZ9HeLK3YVT5cLFdmyokUwdMYNurG2PcUOSdZpMlG9zluYKspz1B8ddHRdZdW7mN0Mnw0Vlj8g3UkUALr1RMj69kAO9V7ePl+bauk1MZqZCqDuuZWHSIRloY6prC3vyVRzTerH9b9xA+h1HnHVTWKHsswUILoUvhPcNKUz5S8kTaBOJVHW6flothiOQXECk+8+Cu9bURrGv6UwQKXGalxjhBcCRpkfX0r3e6NjXc0XOuK8V5b//xwszcu9fToQuca4LTmyCXjIe2tTmfNRHJpH2Ryeox6mMc2MM=~-1~-1~-1; bm_s=YAAQBNojF/9EJs6WAQAAyCK60gMcDOXiE24Wuo9tFtJtONoIJUdO22VFMoYb/3TdFBwd0fjLun8McZZ/F4AKA+9kiPBd+lrArUYTQYn9eo6jojw8dlHNhlLYv4tktVFWpBQEu+mD4O3LVrsBQzDGR99eLMmtjZt+sHeRydOkJbM3MPiNhBOiqY83DCyuzgR0uI8BJQdG3RPuBRtgDkpBfaxKDXD/peORT0Eu8EgIr4cJmZU8V2IPXN6OQTmHi14RjMJ66VJsYdMrZxewe42U5vWFR/tZt2gADfwmxT1zj762Flx8g/DVvlBuinhbYUtxkIomLkdJ31czb3hYVLOt4HIqvRFQKBmVvrLilBxzoxmyu5SmAYj78zjNkUkddcsyPhfNtUwNg7/aVPj9Q439EDb0Lgash78WfZ0YC8c1uaGjTVrl0kujD+5qDlmivFSu9+0rvhAFnwKBAMdRQrhq13mBnUsh0xPXcJqKxJ+bbFThFCWzdJoBpXbB1rsOM6KW44kzq9Xvq+jShIwbQJ0YfpwLQZAqHgTS8EeDdjzY1tGAYoC9XQAjYzaRYDK3YkW9A6/GbJO+d6Stgrmhj5Q=; bm_ss=ab8e18ef4e; bm_sz=82FB8556DA736DE9B01A370ED8CC1317~YAAQBNojF+MSJs6WAQAASdS50htOaQoKmOLlj3Y2yq4Gn+wKF8AbTfpVUaBgPQK1iUT6vg2uTH8c8L/t9saLS5wdQa3i/DMyGc33nOvuOLg03ibf/fD9vNCE0PXBKAZ7oJ1ldnvdDpM0X3uLCLPCIeM3owEXHfCdA7o9yqqyOtlkriNia4A2Ns3owmWUbrAS3mbaO+Reg3/v0KEnPp3Gyug3pRl4sRi8R6u162PjSpPuRJOWlr/DWJPRRR2gx+ZbJN3+CmfDIYg3taLIdshm7yOo1HxapKwHBfF52Mq7vgatOusvEZtaT4WXbgZSzpY2WCtLltvUW5DfOgSHoeQw3So7ik4l2ejUrYBu7Q2K~3618372~3686711; overrideAbTestGroup=%5B%5D; sid=849a54e596854b1aae78eb4185201fcded793bb1",
    );

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      "https://www.coupang.com/vp/products/7535557148/vendoritems/86776466577/quantity-info?quantity=1",
      requestOptions,
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  }
};

run();
