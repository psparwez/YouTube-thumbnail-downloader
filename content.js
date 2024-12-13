function executeScript() {
  console.log("Content script injected");
  downloadThumbnails();
}

executeScript();

sendThumbnailInfo();

let lastVideoId = "";
setInterval(() => {
  const currentVideoId = new URLSearchParams(window.location.search).get("v");
  if (currentVideoId && currentVideoId !== lastVideoId) {
    lastVideoId = currentVideoId;
    sendThumbnailInfo();
  }
}, 1000);
