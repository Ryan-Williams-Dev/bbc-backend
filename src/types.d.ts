declare namespace Express {
  interface Request {
    auth?: any; // You can replace 'any' with a custom type matching your JWT payload
  }
}
