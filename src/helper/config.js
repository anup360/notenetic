const DEVELOPMENT_CONFIG = {
  //base_url: "https://kxmbz6w1sc.execute-api.us-east-2.amazonaws.com/prod/api",
  base_url: "https://zk5f9iji22.execute-api.us-east-2.amazonaws.com/Stage/api",
  //base_url: 'https://localhost:44384/api',
  statusCode: 200,
  unAuthorized: 401,
  noPermission: 403,
  internalServer: 500,
  internalServerError: 501,
  TOKEN: "token",
  OTP_TOKEN: "otpToken",
  REFRESH_TOKEN: "refeshtoken",
  LOGIN_TIME: "loginTime",
  TOKEN_EXPIRETIME: "accessTokenExpireTime",
  REFRESHTOKEN_EXPIRETIME: "refeshTokenExpireTime",
  LAST_URL: "lasturl",
  IS_TEMP_PASSWORD: "isTemp"
};
export default process.env.NODE_ENV === "development" ? DEVELOPMENT_CONFIG : DEVELOPMENT_CONFIG;


