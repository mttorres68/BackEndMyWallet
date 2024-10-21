import { Router } from "express"
import { fetchDataNfce } from "../lib/scrapingNFE/scrapingNfe.js"
import { verifyJWT } from "../middleware/verifyJWT.js"

const router = Router()

/**
 * @description Realizar autenticação do usuário
 * @route GET  /nfce
 */

export const nfce = router.get("/consulta", verifyJWT, async (req, res) => {
  const { url } = req.body
  // console.log(url);

  try {
    const data = await fetchDataNfce(url)
    console.log(data)

    return res.json(data)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Erro interno do servidor" })
  }
})
