

export type FetchDataPropsType = { options?: RequestInit, path?: string, signal?: AbortSignal };
export type FetchDataFuncType = ({ options, path, signal }: FetchDataPropsType) => Promise<void>;
