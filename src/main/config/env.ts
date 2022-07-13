import dotenv from 'dotenv'
dotenv.config()

export const env = {
  appPort: process.env.PORT ?? '5050',
  jwtSecret: process.env.JWT_SECRET ?? 'asdhakjsdbkajsbd',
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? '',
    clientSecret: process.env.FB_CLIENT_SECRET ?? ''
  }
}
