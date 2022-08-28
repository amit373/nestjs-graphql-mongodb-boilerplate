export const enum Environment {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
}

export const enum UserRole {
  admin = 'admin',
  user = 'user',
}

export const errorMessage = {
  SERVER_HEALTH: 'Server is Up Ready to Rock!',
  SOMETHING_WENT_WRONG: 'Something Went wrong!',
  INVALID_TOKEN: 'Invalid token. Please log in again!',
  TOKEN_EXPIRED: 'Your token has expired! Please log in again.',
  PERMISSION_DENIED: 'You do not have permission to perform this action',
  NOT_LOGGED_IN: 'You are not logged in! Please log in to get access.',
  USER_WITH_TOKEN_NOT_EXIST:
    'The user belonging to this token does no longer exist.',
  UNCAUGHT_EXCEPTION: 'UNCAUGHT EXCEPTION! 💥 Shutting down...',
  UNCAUGHT_REJECTION: 'UNCAUGHT REJECTION! 💥 Shutting down...',
  ALREADY_EXIST: 'Already exist',
  RECENTLY_CHANGED_PASSWORD:
    'User recently changed password! Please log in again.',
  TO_MANY_REQUEST:
    'Too many requests from this IP, please try again in an hour!',
  ONLY_IMAGES_ALLOWED: 'Not an image! Please upload only images.',
};

export const COOKIE_NAME = 'token';
