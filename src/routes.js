import { Router } from "express";
import database from "./database";
import 'dotenv-safe/config';

const jwt = new require('jsonwebtoken');
const routes = new Router();
var aQuery = "";

routes.get("/", (req, res) => {
    /*
  #swagger.description = 'Apresentanção da API.'
*/
    return res.json({ message: "API INVENTARIO SOPASTA V1" });
});

routes.post("/enviaregistro", verifyJWT, (req, res) => {
      /*
  #swagger.description = 'Envio de registros de inventário para a tabela USU_TContagem da base Apontamentos da Sopasta.'
 

  #swagger.parameters['codemp'] = {
	description: 'Código da Empresa.',
    type: 'number',
    required: true,
    in: 'body',
    example: 1,
  }

 #swagger.parameters['codfil'] = {
   description: 'Código da Filial.',
   type: 'number',
   required: true,
   in: 'body',
   example: 1,
  }

  #swagger.parameters['codori'] = {
   description: 'Código da origem do produto.',
   type: 'string',
   required: true,
   in: 'body',
   example: 'BOB',
  }

  #swagger.parameters['codbar'] = {
   description: 'Código de Barras do produto.',
   type: 'string',
   required: true,
   in: 'body',
   example: 'MN120304020215487XYZ',
  }
*/

    var nCodEmp = req.body.codemp;
    var nCodFil = req.body.codfil;
    var aCodOri = req.body.codori;
    var aCodBar = req.body.codbar;
    var data;
    aCodBar = aCodBar.trim();
    var aNomUsu = req.nomusu;
    var nRetErr = 0;

    if (nCodEmp == 0 || nCodEmp == null || nCodEmp == undefined) {
        nRetErr = 1;
        return res.json({
            message: "Código da Empresa esta vazio !",
            error: nRetErr
        });
    }

    if (nCodFil == 0 || nCodFil == null || nCodFil == undefined) {
        nRetErr = 1;
        return res.json({
            message: "Código da Filial esta vazio !",
            error: nRetErr
        });
    }

    if (aCodOri != "BOB" && aCodOri != "CHA" && aCodOri != "EMB") {
        nRetErr = 1;
        return res.json({
            message: "Origem deve ser BOB–Bobina ou CHA-Chapas ou EMB–Embalagens !",
            error: nRetErr
        });
    }

    if (aCodBar == "" || aCodBar == undefined || aCodBar == null) {
        nRetErr = 1;
        return res.json({
            message: "Código de Barras deve ser informado !",
            error: nRetErr
        });
    }

    if (nRetErr == 0) {
        aQuery = "INSERT INTO APONTAMENTOS.USU_TContagem A                                \
        (A.USU_CodEmp,A.USU_CodFil,A.USU_Origem,                                          \
         A.USU_Data,                                                                      \
         A.USU_Seq ,                                                                      \
         A.USU_CodBar,                                                                    \
         A.USU_Hora ,A.USU_CodUsu,A.USU_NomUsu,A.USU_EnvErp)                              \
         VALUES                                                                           \
         ("+ nCodEmp + "," + nCodFil + ",'" + aCodOri + "',                                          \
          TO_DATE(TO_CHAR(SysDate, 'DD/MM/YYYY'), 'DD/MM/YYYY'),                          \
          (SELECT NVL(MAX(B.USU_Seq),0)+1                                                 \
             FROM APONTAMENTOS.USU_TContagem B                                            \
            WHERE B.USU_CodEmp = "+ nCodEmp + "                                              \
              AND B.USU_CodFil = "+ nCodFil + "                                              \
              AND B.USU_Origem = '"+ aCodOri + "'                                            \
              AND B.USU_Data = TO_DATE(TO_CHAR(SysDate, 'DD/MM/YYYY'), 'DD/MM/YYYY')),    \
          '"+ aCodBar + "',                                                                  \
          TO_NUMBER(TO_CHAR(SYSDATE,'hh24'))*60 + TO_NUMBER(TO_CHAR(SYSDATE,'mi')),       \
          0,'"+ aNomUsu + "','N')";
        fExecQuery(aQuery).then(response => {
            data = response[0];
            nRetErr = response[1];
            if (nRetErr == 1) {
                return res.json({
                    message: data.toString(),
                    error: nRetErr
                });
            } else {
                return res.json({
                    message: "Registro Inserido com sucesso !",
                    error: nRetErr
                });
            };

        })
    }

});

async function fExecQuery(aQuery) {
    var RetQue;
    var RetErr = 0;
    try {
        RetQue = await database.raw(aQuery);
    } catch (error) {
        RetQue = error;
        RetErr = 1;
    }
    return [RetQue, RetErr];
}

function verifyJWT(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(401).json({ auth: false, message: 'Usuário sem token autenticado!' });
    }

    jwt.verify(token, process.env.SECRET, function (err, decoded) {
        if (err) {
            return res.status(500).json({ auth: false, message: 'Falhou na validação do TOKEN!' });
        }

        // se tudo estiver ok, salva no request para uso posterior        
        req.nomusu = decoded.aNomUsu;
        next();
    });
}

export default routes;