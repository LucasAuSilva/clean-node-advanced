import dotenv from 'dotenv'
dotenv.config()

export const env = {
  appPort: process.env.PORT ?? '5050',
  jwtSecret: process.env.JWT_SECRET ?? 'change_to_jwt_secret',
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? 'change_to_facebook_id',
    clientSecret: process.env.FB_CLIENT_SECRET ?? 'change_to_facebook_secret'
  },
  s3: {
    accessKey: process.env.AWS_S3_ACCESS_KEY ?? 'change_to_aws_id',
    secret: process.env.AWS_S3_SECRET ?? 'change_to_aws_secret',
    bucket: process.env.AWS_S3_BUCKET ?? 'change_to_aws_bucket'
  }
}
