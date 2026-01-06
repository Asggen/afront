window.addEventListener("load", () => {
  const loadingElement = document.getElementById("loading");
  if (loadingElement) {
    setTimeout(() => {
      loadingElement.classList.add('hidden');
    }, 300);
  }
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("Service Worker registered with scope:", registration.scope);
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}