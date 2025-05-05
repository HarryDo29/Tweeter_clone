export enum UserVerifyStatus {
  Unverified, // chưa xác thực email, mặc định = 0
  Verified, // đã xác thực email = 1
  Banned // bị khóa = 2
}

export enum TokenType {
  AccessToken, //0
  RefreshToken, //1
  EmailVerifyToken, //2
  PasswordResetToken //3
}
