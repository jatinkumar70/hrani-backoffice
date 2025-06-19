export enum LoadState {
    NotLoaded = 0,
    InProgress = 1,
    Loaded = 2,
    Failed = 3,
  }


export enum ILoadState {
    idle = 0,
    pending = 1,
    succeeded = 2,
    failed = 3,
}

export enum ERROR_MESSAGES {
  "NO_RECORD_FOUND" = "Unfortunately, there are no records available at the moment.",
  "SERVER_ERROR" = "Someting went to be wrong!",
  "POLICY_NOT_FOUND" = "Oops! We couldn't find any records at the moment. Please ensure that the provided information is accurate and try again.",
}