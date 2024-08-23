import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT.js";
import { getOnu, snOnu } from "../query.js";

const router = Router();

/**
 * @description Buscar todos os dados das ONUs
 * @route GET /onus
 */
const getAllOnu = router.get("", verifyJWT, async (req, res) => {
  const query = await getOnu();
  try {
    res.status(200).json(query);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erro" });
  }
});

/**
 * @description Buscar todos os dados das ONUs
 * @route GET /onus
 */
const getSnOnu = router.post("/sn", verifyJWT, async (req, res) => {
  const { sn } = req.body;

  const query = await snOnu(sn);
  try {
    res.status(200).json(query);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erro" });
  }
});

export { getAllOnu, getSnOnu };
