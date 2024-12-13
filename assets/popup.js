// - extract YouTube Video ID from a URL
function extractVideoId(url) {
  const videoIdMatch = url.match(
    /[?&]v=([a-zA-Z0-9_-]{11})|youtu\.be\/([a-zA-Z0-9_-]{11})/
  );
  if (videoIdMatch) {
    return videoIdMatch[1] || videoIdMatch[2];
  }
  return null;
}

// - set thumbnail with fallback
function setThumbnailWithFallback(videoId) {
  const resolutions = [
    "maxresdefault",
    "sddefault",
    "hqdefault",
    "mqdefault",
    "default",
  ];
  const previewImage = document.querySelector("[data-previewImage]");
  const textElement = document.querySelector("[data-text]");
  const spinner = document.getElementById("spinner");

  if (!videoId || !previewImage) {
    textElement.textContent = "Invalid YouTube URL.";
    return;
  }

  let currentIndex = 0;

  // Show spinner while fetching
  spinner.style.display = "block";

  function tryLoadThumbnail() {
    const resolution = resolutions[currentIndex];
    const imageUrl = `https://img.youtube.com/vi/${videoId}/${resolution}.jpg`;

    // - Check if the image exists
    fetch(imageUrl, { method: "HEAD" })
      .then((response) => {
        if (response.ok) {
          previewImage.src = imageUrl; // Set the valid thumbnail

          spinner.style.display = "none";
        } else {
          // - Image not found (404 or other errors), try the next resolution
          currentIndex++;
          if (currentIndex < resolutions.length) {
            tryLoadThumbnail();
          } else {
            textElement.textContent = "Unable to load thumbnail.";
            spinner.style.display = "none";
            console.log("No valid thumbnail found.");
          }
        }
      })
      .catch(() => {
        // - If fetch fails (e.g., network error), try the next resolution
        currentIndex++;
        if (currentIndex < resolutions.length) {
          tryLoadThumbnail();
        } else {
          textElement.textContent = "Unable to load thumbnail.";
          spinner.style.display = "none";
          console.log("Error fetching thumbnail.");
        }
      });
  }

  tryLoadThumbnail();
}

// - download the thumbnail
function downloadThumbnail(videoId) {
  const link = document.createElement("a");
  const previewImage = document.querySelector("[data-previewImage]");
  if (previewImage && previewImage.src) {
    link.href = previewImage.src;
    link.download = `youtube-thumbnail-${videoId}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    console.log("No thumbnail to download.");
  }
}

// - Main function
function main() {
  const urlInput = document.getElementById("url-input");
  const downloadBtn = document.getElementById("download-btn");

  urlInput.addEventListener("input", () => {
    const url = urlInput.value.trim();
    const videoId = extractVideoId(url);
    if (videoId) {
      setThumbnailWithFallback(videoId);
      downloadBtn.dataset.videoId = videoId; // Save videoId for download
    } else {
      console.log("No valid video ID found.");
    }
  });

  // - download button
  downloadBtn.addEventListener("click", () => {
    const urlInput = document.getElementById("url-input");
    if (urlInput.value.trim() !== "") {
      const videoId = downloadBtn.dataset.videoId;
      if (videoId) {
        downloadThumbnail(videoId);
      } else {
        console.log("No video ID available for download.");
      }
    } else {
      const textElement = document.querySelector("[data-text]");
      textElement.textContent = "Please enter a YouTube URL first.";
      textElement.style.color = "#982525e0";
      downloadBtn.dataset.videoId = "";
      setTimeout(() => {
        textElement.textContent = "";
      }, 2000);
    }
  });
}

document.addEventListener("DOMContentLoaded", main);
