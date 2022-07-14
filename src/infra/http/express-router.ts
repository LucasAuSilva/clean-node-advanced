import { Controller } from '@/application/controllers'

import { RequestHandler } from 'express'

type Adapter = (controller: Controller) => RequestHandler

export const adaptExpressRoute: Adapter = controller => async (req, res) => {
  const httpResponse = await controller.handle({ ...req.body })
  if (httpResponse.statusCode === 200) {
    res.status(200).json(httpResponse.data)
  } else {
    res.status(httpResponse.statusCode).json({ error: httpResponse.data.message })
  }
}
