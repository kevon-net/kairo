export enum TimerDirection {
  UP = 'up',
  DOWN = 'down',
}

export enum SortOrder {
  ASCENDING = 'ASCENDING',
  DESCENDING = 'DESCENDING',
  DEFAULT = 'DEFAULT',
}

export enum Request {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export enum Platform {
  TWITTER = 'TWITTER',
  FACEBOOK = 'FACEBOOK',
  LINKEDIN = 'LINKEDIN',
  WHATSAPP = 'WHATSAPP',
  INSTAGRAM = 'INSTAGRAM',
}

export enum HashingAlgorithm {
  BCRYPT = 'bcrypt',
  SHA256 = 'sha256',
  SHA512 = 'sha512',
}

export enum JwtAlgorithm {
  HS256 = 'HS256',
}

export enum SwitchPricing {
  MONTHLY = 'MONTHLY',
  ANNUALLY = 'ANNUALLY',
}

export enum NotificationVariant {
  SUCCESS = 'success',
  WARNING = 'warning',
  FAILED = 'failed',
}
