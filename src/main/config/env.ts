import dotenv from 'dotenv'
dotenv.config()

export const env = {
  appPort: process.env.PORT ?? '5050',
  jwtSecret: process.env.JWT_SECRET ?? 'change_to_jwt_secret',
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? 'change_to_facebook_id',
    clientSecret: process.env.FB_CLIENT_SECRET ?? 'change_to_facebook_secret'
  }
}
