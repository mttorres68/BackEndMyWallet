import { Router } from "express"
import { verifyJWT } from "../middleware/verifyJWT.js"

const router = Router()

/**
 * @description Validação do token do usuário
 * @route POST /token/validate
 */
const validateToken = router.post("/validate", verifyJWT, (req, res) => {
  const userInfo = {
    id: req.id,
    email: req.email
  }

  res.status(200).json(userInfo)
})

export { validateToken }
