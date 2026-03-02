if (process.env.NODE_ENV === "development") {
  const socket = new WebSocket("ws://localhost:9797");

  function send(level, args) {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          level,
          message: args
            .map((a) =>
              typeof a === "object"
                ? JSON.stringify(a, null, 2)
                : String(a)
            )
            .join(" "),
        })
      );
    }
  }

  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;

  console.log = (...args) => {
    originalLog(...args);
    send("info", args);
  };

  console.warn = (...args) => {
    originalWarn(...args);
    send("warn", args);
  };

  console.error = (...args) => {
    originalError(...args);
    send("error", args);
  };

  window.addEventListener("error", (event) => {
    console.error("Unhandled Error:", event.error || event.message);
  });

  window.addEventListener("unhandledrejection", (event) => {
    console.error("Unhandled Promise Rejection:", event.reason);
  });
}