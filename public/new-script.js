const POLLING_TIME = 10000;

// Key for localStorage
const localStorageKey = "telegramPosts";

// Function to create a Telegram widget for a given post ID
function createTelegramWidget(postId) {
  const widgetContainer = document.createElement("div");
  widgetContainer.className = "telegram-widget";

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://telegram.org/js/telegram-widget.js?22";
  script.setAttribute("data-telegram-post", `thisonejsbot/${postId}`);
  script.setAttribute("data-width", "100%");
  script.setAttribute("data-color", "13B4C6");
  script.setAttribute("data-dark", "1");
  script.setAttribute("data-dark-color", "39C4E8");

  widgetContainer.appendChild(script);
  return widgetContainer;
}

// Function to save posts to localStorage
function savePostsToLocalStorage(posts) {
  localStorage.setItem(localStorageKey, JSON.stringify(posts));
}

// Function to load posts from localStorage
function loadPostsFromLocalStorage() {
  const posts = localStorage.getItem(localStorageKey);
  return posts ? JSON.parse(posts) : [];
}

// Function to render posts
function renderPosts(posts) {
  const widgetArea = document.querySelector(".telegram-container");
  widgetArea.innerHTML = ""; // Clear the existing widgets

  posts.forEach((postId) => {
    const widget = createTelegramWidget(postId);
    widgetArea.appendChild(widget);
  });
}

// Function to fetch the latest post ID from the server
async function fetchLatestPostId() {
  try {
    const response = await fetch("/latest-post-id");
    const data = await response.json();
    if (data.postId) {
      document.getElementById("channelImageOnClient").src =
        data.channelImageLink;
      document.getElementById("heading").innerHTML = data.channelName;
      // Load existing posts from localStorage
      const posts = loadPostsFromLocalStorage();

      // Add the new post ID if it doesn't already exist
      if (!posts.includes(data.postId)) {
        posts.unshift(data.postId); // Add to the beginning of the array
        savePostsToLocalStorage(posts); // Save updated posts to localStorage
        renderPosts(posts); // Re-render the posts
      }
    }
  } catch (error) {
    console.error("Failed to fetch latest post ID:", error);
  }
}

// Load posts from localStorage when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const posts = loadPostsFromLocalStorage();
  renderPosts(posts); // Render posts from localStorage
  fetchLatestPostId(); // Fetch the latest post
});

// Fetch the latest post ID every 10 seconds
setInterval(fetchLatestPostId, POLLING_TIME);
