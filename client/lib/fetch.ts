// Store original fetch before any scripts can override it
const originalFetch = window.fetch;

// Robust fetch function that falls back to XMLHttpRequest if fetch is compromised
export const robustFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  // First try the original native fetch
  try {
    if (originalFetch && typeof originalFetch === 'function') {
      return await originalFetch(url, options);
    }
  } catch (error) {
    console.warn('Native fetch failed, falling back to XMLHttpRequest:', error);
  }

  // Fallback to XMLHttpRequest if fetch is compromised
  return new Promise<Response>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const method = options.method || 'GET';

    xhr.open(method, url, true);

    // Set headers
    if (options.headers) {
      const headers = options.headers as Record<string, string>;
      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });
    }

    // Handle response
    xhr.onload = () => {
      // Create a Response-like object
      const response = {
        ok: xhr.status >= 200 && xhr.status < 300,
        status: xhr.status,
        statusText: xhr.statusText,
        headers: new Headers(),
        json: async () => {
          try {
            return JSON.parse(xhr.responseText);
          } catch (e) {
            throw new Error('Invalid JSON response');
          }
        },
        text: async () => xhr.responseText,
      } as Response;

      resolve(response);
    };

    xhr.onerror = () => {
      reject(new Error(`XMLHttpRequest failed: ${xhr.status} ${xhr.statusText}`));
    };

    xhr.ontimeout = () => {
      reject(new Error('XMLHttpRequest timeout'));
    };

    // Set timeout
    xhr.timeout = 10000; // 10 seconds

    // Send request
    try {
      if (options.body) {
        xhr.send(options.body as string);
      } else {
        xhr.send();
      }
    } catch (error) {
      reject(error);
    }
  });
};
