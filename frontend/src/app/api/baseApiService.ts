import { API_BASE_URL } from "@/constants";

/**
 * Shape of an error payload returned by the backend.
 */
export interface ApiErrorPayload {
  message?: string;
  code?: string;
  details?: unknown;
}

/**
 * Error wrapper used by API services to surface HTTP failures with metadata.
 */
export class ApiError extends Error {
  public readonly status: number;
  public readonly statusText: string;
  public readonly payload?: ApiErrorPayload | string;

  constructor(status: number, statusText: string, payload?: ApiErrorPayload | string) {
    super(typeof payload === "string" ? payload : payload?.message ?? statusText);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
    this.payload = payload;
  }
}

type FetchFn = typeof fetch;

/**
 * Optional configuration accepted by each API service.
 */
export interface ApiServiceConfig {
  baseUrl?: string;
  fetchFn?: FetchFn;
}

/**
 * Base class that encapsulates HTTP plumbing shared across frontend services.
 */
export abstract class BaseApiService {
  protected readonly baseUrl: string;
  protected readonly fetchFn: FetchFn;

  protected constructor(config: ApiServiceConfig = {}) {
    this.baseUrl = config.baseUrl ?? API_BASE_URL;
    this.fetchFn = config.fetchFn ?? fetch;
  }

  /**
   * Compose an absolute URL by combining the configured base with the provided path.
   */
  protected buildUrl(path: string): string {
    if (!path) {
      throw new Error("Path is required for API requests.");
    }

    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${this.baseUrl}${normalizedPath}`;
  }

  /**
   * Convenience wrapper for GET requests returning JSON payloads.
   */
  protected async getJson<T>(path: string, init: RequestInit = {}): Promise<T> {
    return this.requestJson<T>(path, this.buildRequestInit({ ...init, method: "GET" }));
  }

  /**
   * Convenience wrapper for POST requests with optional JSON bodies.
   */
  protected async postJson<T>(path: string, body?: unknown, init: RequestInit = {}): Promise<T> {
    const requestInit: RequestInit = this.buildRequestInit({
      ...init,
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    return this.requestJson<T>(path, requestInit);
  }

  /**
   * Execute a POST request and return the raw blob response.
   */
  protected async postForBlob(path: string, body?: unknown, init: RequestInit = {}): Promise<Blob> {
    const requestInit: RequestInit = this.buildRequestInit({
      ...init,
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const response = await this.execute(path, requestInit, false);
    return response.blob();
  }

  /**
   * Execute a GET request and return the raw blob response.
   */
  protected async getBlob(path: string, init: RequestInit = {}): Promise<Blob> {
    const response = await this.execute(path, this.buildRequestInit({ ...init, method: "GET" }), false);
    return response.blob();
  }

  /**
   * Merge call-site request options with defaults applied to every request.
   */
  protected buildRequestInit(init: RequestInit = {}): RequestInit {
    return {
      ...init,
      cache: init.cache ?? "no-store",
    };
  }

  private async requestJson<T>(path: string, init: RequestInit): Promise<T> {
    const response = await this.execute(path, init, true);
    return response.json() as Promise<T>;
  }

  private async execute(path: string, init: RequestInit, expectJson: boolean): Promise<Response> {
    const headers = new Headers(init.headers);

    if (expectJson && !headers.has("Accept")) {
      headers.set("Accept", "application/json");
    }

    if (init.body !== undefined && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    const response = await this.fetchFn(this.buildUrl(path), {
      ...init,
      headers,
    });

    if (!response.ok) {
      let payload: ApiErrorPayload | string | undefined;

      if (expectJson) {
        try {
          payload = await response.json();
        } catch (error) {
          payload = await response.text();
        }
      } else {
        payload = await response.text();
      }

      throw new ApiError(response.status, response.statusText, payload);
    }

    if (expectJson) {
      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) {
        throw new ApiError(
          response.status,
          response.statusText,
          `Expected JSON response but received content-type: ${contentType}`,
        );
      }
    }

    return response;
  }
}

