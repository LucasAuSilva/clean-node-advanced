import './config/module-alias'

import { setupApp } from '@/main/config/app'
import { env } from '@/main/config/env'

setupApp()
  .then(app => {
    app.listen(env.appPort, () => console.log(`Server running at http://localhost:${env.appPort}`))
  })
  .catch(console.error)
