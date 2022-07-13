import dotenv from 'dotenv'
dotenv.config()

export const env = {
  appPort: process.env.PORT ?? '5050',
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? '',
    clientSecret: process.env.FB_CLIENT_SECRET ?? ''
  }
}
