var express = require('express');
var router = express.Router();

var pg = require('pg');
const conString = "postgres://postgres:m20a03r92@localhost/pagoFacil"

var client = new pg.Client(conString);
client.connect();

var app = express();
const { check, validationResult } = require('express-validator/check');

/* registro */
router.post('/registrar',  [
  check('IdTrx').isLength({ min: 1 }),
  check('Monto').isLength({ min: 1 }),
  check('FechaTransaccion').isLength({ min: 1 }),
  check('Comercio').isLength({ min: 1 }),
  check('IdReferidor').isLength({ min: 1 })
], function(req, res, next) {
	
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}

	data = req.body;
	insertData = {
		"monto": data.Monto,
		"comercio": data.Comercio,
		"fecha_transaccion": data.FechaTransaccion,
		"id_ref": data.IdReferidor,
		"id_trx": data.IdTrx,
		"tipo_moneda": null,
		"detalle": null,
		"pagada": "N",
	}
	
	if (req.body.hasOwnProperty("TipoMoneda"))
		insertData.tipo_moneda = data.TipoMoneda;
	if (req.body.hasOwnProperty("Detalle"))
		insertData.detalle = data.Detalle;

	var insertQuery = "insert into transacciones (monto, tipo_moneda, detalle, comercio, fecha_transaccion, pagada,"+
			" id_ref, id_trx) values ("+insertData.monto+", '"+insertData.tipo_moneda+"', '"+insertData.detalle+
			"', '"+insertData.comercio+"', '"+insertData.fecha_transaccion+"', '"+insertData.pagada+"', '"+insertData.id_ref+
			"', '"+insertData.id_trx+"')";

	client.query(insertQuery, [], (err, result) => {
		if (err) {
			return res.send(err);
		} else {
			var response = {
				"Status": "Ok",
				"Id": insertData.id_trx
			};
			res.send(response);
    		res.end();
		}
		client.end();
	});

});

module.exports = router;