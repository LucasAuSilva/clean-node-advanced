import { Router } from 'express'

export default (router: Router): void => {
  router.post('/api/login/facebook', (_req, res) => {
    res.send({ data: 'any_data' })
  })
}
