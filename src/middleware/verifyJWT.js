import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
dotenv.config();


function verifyJWT(req, res, next){
    const token = req.headers["authorization"]

    if(!token){
        return res
          .status(401)
          .json({ auth: false, message: "Nenhum token fornecido." });
    }

    try {
      jwt.verify(token, process.env.SECRET, function (err, decoded) {
        if (err) {
          return res.status(403).json({
            auth: false,
            message: "Falha ao autenticar o token.",
          });
        } else {
          req.id = decoded.id;
          req.email = decoded.email;
          next();
        }
      });
    } catch (error) {
      console.error("Erro durante a verificação do token:", error);
      return res
        .status(500)
        .json({ auth: false, message: "Internal server error" });
    }
}

export {verifyJWT}