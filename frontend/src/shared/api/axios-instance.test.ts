import type { InternalAxiosRequestConfig } from "axios";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { useAuthStore } from "@/store/auth-store";
import { api } from "./axios-instance";

function mockSuccessfulRequest() {
  let requestConfig: InternalAxiosRequestConfig | undefined;

  api.defaults.adapter = async (config) => {
    requestConfig = config;

    return {
      data: {},
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    };
  };

  return {
    getRequestConfig: () => requestConfig,
  };
}

describe("api axios instance", () => {
  let originalAdapter: typeof api.defaults.adapter;

  beforeEach(() => {
    originalAdapter = api.defaults.adapter;

    useAuthStore.setState({
      accessToken: null,
      hasHydrated: false,
    });
  });

  afterEach(() => {
    api.defaults.adapter = originalAdapter;
  });

  it("adds Authorization header when access token exists", async () => {
    // Arrange
    useAuthStore.getState().setAccessToken("test-access-token");

    const request = mockSuccessfulRequest();

    // Act
    await api.get("/test");

    // Assert
    expect(request.getRequestConfig()).toBeDefined();
    expect(request.getRequestConfig()?.headers?.Authorization).toBe(
      "Bearer test-access-token",
    );
  });

  it("does not add Authorization header when access token is missing", async () => {
    // Arrange
    const request = mockSuccessfulRequest();

    // Act
    await api.get("/test");

    // Assert
    expect(request.getRequestConfig()).toBeDefined();
    expect(request.getRequestConfig()?.headers?.Authorization).toBeUndefined();
  });

  it("logs out when response status is 401", async () => {
    // Arrange
    useAuthStore.getState().setAccessToken("test-access-token");

    api.defaults.adapter = async () => {
      return Promise.reject({
        response: {
          status: 401,
        },
      });
    };

    // Act
    await expect(api.get("/test")).rejects.toBeDefined();

    // Assert
    expect(useAuthStore.getState().accessToken).toBeNull();
  });
});
