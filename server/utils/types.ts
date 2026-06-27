export type ServerFunctionResponse<T = void> = Promise<
  | {
      success: true;
      message: string;
      data?: T;
    }
  | {
      success: false;
      message: string;
      error: unknown;
    }
>;

/** Generic wrapper for paginated backend responses. */
export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  pagesCount: number;
}
