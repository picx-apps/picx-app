import { userStore } from "../pinia/auth";
import { createFetch, type UseFetchOptions, type UseFetchReturn } from "@vueuse/core";
import { isArray } from "lodash-es";

export interface CreateServiceOptions {
  /**
   * Default Options for the useFetch function
   */
  options?: UseFetchOptions;
  /**
   * Options for the fetch request
   */
  fetchOptions?: RequestInit;
}

export function createService(baseUrl: string, serviceOptions: CreateServiceOptions = {}) {
  const options: UseFetchOptions = {
    refetch: true,
    timeout: 30 * 1000,
    beforeFetch({ options, cancel }) {
      const user = userStore().getAuth;
      if (!user?.access_token) {
        cancel();
      }

      options.headers = {
        ...options.headers,
      };

      options.body = isArray(options.body) ? JSON.stringify(options.body) : options.body;

      return {
        options,
      };
    },
    ...serviceOptions.options,
  };

  const fetchOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
    },
    ...serviceOptions.fetchOptions,
  };
  const fetch = createFetch({
    baseUrl: baseUrl,
    options,
    fetchOptions,
  });

  return fetch;
}

/**
 * @fn return to after deconstruction is data
 */
export async function unFetchData<T = any>(
  fetch: UseFetchReturn<T> & PromiseLike<UseFetchReturn<T>>,
): Promise<APIResult<T>> {
  const { data } = (await fetch.then()) as UseFetchReturn<any>;
  return data.value;
}

interface StringLike {
  toString(): string;
}

/**
 * @fn join params
 */
export function paramsSerializer(params: Record<string, StringLike | undefined> | object) {
  if (!params) return;
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    const value = v?.toString();
    if (!value) {
      return;
    }
    query.append(k, value);
  });
  return "?" + query.toString();
}

declare global {
  type APIResult<T = any> = {
    code: number | string;
    count: number;
    message: string | undefined;
    data: T;
  };
}
