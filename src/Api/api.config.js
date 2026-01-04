// Lightweight fetch-based API instance with interceptors and retry helper
const apiBase =
  (typeof process !== "undefined" &&
    process.env &&
    process.env.REACT_APP_API_BASE) ||
  (typeof window !== "undefined" &&
    window.__env &&
    window.__env.REACT_APP_API_BASE) ||
  "http://localhost:4000/api/v1";

function isAbsoluteUrl(u) {
  return /^https?:\/\//i.test(u);
}

function buildUrl(base, url, params) {
  const full = isAbsoluteUrl(url) ? url : `${base}${url}`;
  if (!params) return full;
  const search = new URLSearchParams(params).toString();
  return search ? `${full}${full.includes("?") ? "&" : "?"}${search}` : full;
}

function createInstance({
  baseURL = apiBase,
  timeout = 60000,
  headers = { "Content-Type": "application/json" },
  withCredentials = true,
} = {}) {
  const requestHandlers = [];
  const responseHandlers = [];

  const interceptors = {
    request: {
      use: (fn) => {
        requestHandlers.push(fn);
        return requestHandlers.length - 1;
      },
    },
    response: {
      use: (onFulfilled, onRejected) => {
        responseHandlers.push({ onFulfilled, onRejected });
        return responseHandlers.length - 1;
      },
    },
  };

  async function runRequestHandlers(cfg) {
    let c = { ...cfg };
    for (const h of requestHandlers) {
      // handlers may be sync or async
      // allow them to modify/return the config
      // if they return undefined, assume they mutated in place
      // otherwise use returned value
      // eslint-disable-next-line no-await-in-loop
      const out = await h(c);
      if (typeof out !== "undefined") c = out;
    }
    return c;
  }

  async function runResponseHandlers(resOrErr, success = true) {
    let acc = resOrErr;
    for (const h of responseHandlers) {
      try {
        if (success && typeof h.onFulfilled === "function") {
          // eslint-disable-next-line no-await-in-loop
          const out = await h.onFulfilled(acc);
          if (typeof out !== "undefined") acc = out;
        } else if (!success && typeof h.onRejected === "function") {
          // eslint-disable-next-line no-await-in-loop
          const out = await h.onRejected(acc);
          if (typeof out !== "undefined") acc = out;
        }
      } catch (e) {
        // if a handler throws, treat as rejection
        acc = e;
        success = false;
      }
    }
    if (success) return acc;
    throw acc;
  }

  async function request(cfg) {
    const finalCfg = await runRequestHandlers({
      baseURL,
      timeout,
      headers: { ...headers },
      withCredentials,
      ...cfg,
    });

    const url = buildUrl(
      finalCfg.baseURL || baseURL,
      finalCfg.url || finalCfg.path || "/",
      finalCfg.params
    );

    const controller = new AbortController();
    const to = finalCfg.timeout || timeout;
    const timer = setTimeout(() => controller.abort(), to);

    const fetchOpts = {
      method: (finalCfg.method || "GET").toUpperCase(),
      headers: finalCfg.headers || {},
      signal: controller.signal,
    };
    if (finalCfg.withCredentials || finalCfg.withCredentials === undefined)
      fetchOpts.credentials = "include";
    if (finalCfg.body !== undefined && finalCfg.body !== null) {
      fetchOpts.body = finalCfg.body;
    }

    try {
      // log request for convenience
      // allow user interceptors to already log as requested
      const raw = await fetch(url, fetchOpts);
      clearTimeout(timer);

      // try to parse JSON, fallback to text
      let data = null;
      const ct = raw.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        try {
          data = await raw.json();
        } catch (e) {
          data = null;
        }
      } else {
        try {
          data = await raw.text();
        } catch (e) {
          data = null;
        }
      }

      const response = { ok: raw.ok, status: raw.status, data, raw };
      return await runResponseHandlers(response, true);
    } catch (err) {
      clearTimeout(timer);
      // network or abort
      return await runResponseHandlers(err, false);
    }
  }

  // convenience methods
  const instance = {
    interceptors,
    request,
    get: (url, cfg = {}) => request({ method: "GET", url, ...cfg }),
    post: (url, body, cfg = {}) =>
      request({
        method: "POST",
        url,
        body:
          typeof body === "object" && !(body instanceof FormData)
            ? JSON.stringify(body)
            : body,
        headers: {
          ...(cfg.headers || {}),
          "Content-Type":
            body instanceof FormData ? undefined : "application/json",
        },
        ...cfg,
      }),
    put: (url, body, cfg = {}) =>
      request({
        method: "PUT",
        url,
        body:
          typeof body === "object" && !(body instanceof FormData)
            ? JSON.stringify(body)
            : body,
        headers: {
          ...(cfg.headers || {}),
          "Content-Type":
            body instanceof FormData ? undefined : "application/json",
        },
        ...cfg,
      }),
    patch: (url, body, cfg = {}) =>
      request({
        method: "PATCH",
        url,
        body:
          typeof body === "object" && !(body instanceof FormData)
            ? JSON.stringify(body)
            : body,
        headers: {
          ...(cfg.headers || {}),
          "Content-Type":
            body instanceof FormData ? undefined : "application/json",
        },
        ...cfg,
      }),
    delete: (url, cfg = {}) => request({ method: "DELETE", url, ...cfg }),
  };

  return instance;
}

export function requestWithRetry(
  fn,
  { retries = 3, retryDelay = 1000, retryOn = (err) => true } = {}
) {
  return new Promise(async (resolve, reject) => {
    let attempt = 0;
    while (attempt < retries) {
      try {
        // fn should be a function returning a promise
        const res = await fn();
        return resolve(res);
      } catch (err) {
        attempt += 1;
        if (attempt >= retries || !retryOn(err)) return reject(err);
        // exponential backoff
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(r, retryDelay * attempt));
      }
    }
    reject(new Error("Retries exhausted"));
  });
}

export const instance = createInstance({
  baseURL: apiBase,
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// expose defaults for logging/compatibility
instance.defaults = { baseURL: apiBase, timeout: 60000 };

// request logging interceptor
instance.interceptors.request.use((config) => {
  try {
    console.log(
      `API Request -> ${(
        (config.method || "").toString() || "GET"
      ).toUpperCase()} ${config.url || config.path} (base: ${
        instance.defaults.baseURL
      }) (timeout: ${config.timeout || instance.defaults.timeout}ms)`
    );
  } catch (e) {
    /* ignore */
  }
  return config;
});

// response / error logging interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error || !error.status) {
      console.error(
        "Network or CORS error when calling API:",
        error && error.message ? error.message : error
      );
    } else {
      console.warn("API response error:", error.status, error.data);
    }
    return Promise.reject(error);
  }
);

export default instance;
