/**
 * <p>
 * Finalidade da Classe: Finalidade da classe.
 * item de processo em autorização de fornecimento.
 * </p>
 *
 * <p>
 * Copyright: Copyright (c) Synergia - DCC - UFMG
 * </p>
 *
 * @author lucasmonteiro
 * @author Última modificação realizada por : lucasmonteiro $.
 * @version :: 30/06/2016#$.
 *
 */

var validator = require('validator');
var winston = require('winston');
var moment = require('moment');

/**
 * Faz o escape dos caracteres não vãlidos e retira espaços desnecessários
 * @param req
 * @param res
 * @param next
 */
module.exports.escapeAndTrim = function(req, res, next) {

    var params = req.params;

    for(prop in params) {
        params[prop] = validator.escape(params[prop]);
        params[prop] = params[prop].replace(/ +(?= )/g,'').trim();
    }

    next();
};

/**
 * Imprime o log de cada requisição na tela
 * @param req
 * @param res
 * @param next
 */
module.exports.logRequest = function(req, res, next) {

    winston.info(moment().format('LTS') + " " +  req.method + " " +  req.url);

    next();
};

/**
 * Função para permitir domínios requisitar e enviar jsons a esse web service permitindo CORS Domain
 * essa função irá adicionar headers a cada resposta de requisição esses headers que contem informações sobre
 * permissões desse webservice alem dos parametros 'req' e 'res' existe o 'next' que informa a aplicação que apos
 * adicionar os headers, a mesma pode dar prosseguimento
 * @param req
 * @param res
 * @param next
 */
module.exports.allowCors = function(req, res,next){

    //header que determina lista de dominios altorizados a trocar informação com esse webservice
    res.header('Access-Control-Allow-Origin','*');

    res.header('Access-Control-Allow-Methods','GET');

    //res.header('Access-Control-Allow-Credentials',true);

    next();
}