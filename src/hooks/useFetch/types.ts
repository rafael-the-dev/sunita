

type OnErrorType = (error: Error) => void;
type OnSuccessType = <T>(res: Response, data: T) => void;
export type FetchDataPropsType = { options?: RequestInit, onError?: OnErrorType, onSuccess?: OnSuccessType, path?: string, signal?: AbortSignal };
export type FetchDataFuncType = ({ options, onError, onSuccess, path, signal }: FetchDataPropsType) => Promise<void>;
