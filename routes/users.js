var express = require('express');
var pg = require('pg');
var randtoken = require('rand-token');
var router = express.Router();

const conString = "postgres://postgres:m20a03r92@localhost/pagoFacil"

var client = new pg.Client(conString);
client.connect();
var app = express();

const { check, validationResult } = require('express-validator/check');

/* registro */
router.post('/registrar',  [
  check('Nombre').isLength({ min: 1 }),
  check('Apellido').isLength({ min: 1 }),
  check('DocumentoIdentidad').isLength({ min: 1 }),
  check('TipoDocumento').isLength({ min: 1 }),
  check('Email').isLength({ min: 1 }),
  check('Password').isLength({ min: 1 }),
  check('DOB').isLength({ min: 1 })
], function(req, res, next) {
	
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}

	data = req.body;
	insertData = {
		"nombre": data.Nombre,
		"apellido": data.Apellido,
		"documento_identidad": data.DocumentoIdentidad,
		"tipo_documento": data.TipoDocumento,
		"email": data.Email,
		"password": data.Password,
		"fecha_nacimiento": data.DOB,
		"sexo": null,
		"nombre_banco": null,
		"numero_cuenta": null,
		"tipo_cuenta": null,
		"email_banco": null,
		"comision": 0,
		"estado": "PENDIENTE",
		"id_usuario": randtoken.generate(15)
	}
	
	if (req.body.hasOwnProperty("Sexo"))
		insertData.sexo = data.Sexo;
	if (req.body.hasOwnProperty("NombreBanco"))
		insertData.nombre_banco = data.NombreBanco;
	if (req.body.hasOwnProperty("NumeroCuenta"))
		insertData.numero_cuenta = data.NumeroCuenta;
	if (req.body.hasOwnProperty("TipoCuenta"))
		insertData.tipo_cuenta = data.TipoCuenta;
	if (req.body.hasOwnProperty("EmailContactoBanco"))
		insertData.email_banco = data.EmailContactoBanco;

	var insertQuery = "insert into usuarios (nombre, apellido, documento_identidad, tipo_documento, email, password, "+
			" fecha_nacimiento, sexo, nombre_banco, numero_cuenta, tipo_cuenta, email_banco, comision, estado, id_usuario) "+
			" values ('"+insertData.nombre+"', '"+insertData.apellido+"', '"+insertData.documento_identidad+"', '"+insertData.tipo_documento+"', '"+insertData.email+"', '"+insertData.password+
			"', "+insertData.fecha_nacimiento+", '"+insertData.sexo+"', '"+insertData.nombre_banco+"', '"+insertData.numero_cuenta+"', '"+insertData.tipo_cuenta+"', '"+insertData.email_banco+
			"', "+insertData.comision+", '"+insertData.estado+"', '"+insertData.id_usuario+"')";

	client.query(insertQuery, [], (err, result) => {
		if (err) {
			return res.send(err);
		} else {
			var response = {
				"Status": "Ok",
				"Id": insertData.id_usuario
			};
			res.send(response);
    		res.end();
		}
		client.end();
	});

});

router.get('/registrar', function(req, res) {
  res.render('register');
});

/* GET comision referidor. */
router.get('/saldo/:id', function(req, res) {
	var id = req.params.id;
  	var selectQuery = "Select usuarios.id, usuarios.comision, usuarios.estado, transacciones.id_trx, transacciones.monto, transacciones.pagada,"+ 
				" transacciones.fecha_transaccion from usuarios inner join transacciones on transacciones.id_ref = usuarios.id_usuario"+
				" where usuarios.id_usuario = '"+id+"'";

	client.query(selectQuery, [], (err, result) => {
		if (err) {
			return res.send(err)
		} else {
  			var response = {};
  			response['idUsuario'] = id;
  			var saldo = {};
			var months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  			
  			result.rows.forEach(function (index) {
  				monthYear = months[index.fecha_transaccion.getMonth()] +""+ index.fecha_transaccion.getFullYear();
  				if (!saldo.hasOwnProperty(monthYear)){
  					saldo[monthYear] = {};
  					saldo[monthYear]['ComisionPagada'] = 0;
  					saldo[monthYear]['SaldoAPagar'] = 0
  				} 
  				if (index.pagada == "Y")
					saldo[monthYear]['ComisionPagada'] += index.monto * index.comision;
  				else
					saldo[monthYear]['SaldoAPagar'] = index.monto * index.comision;
  			});
			response.Saldo = saldo;
			console.log(response);
  			return res.json(response);
  			// return res.json(result.rows);
		    res.end();
		    client.end()	
		}
	})
});

/*PUT activar usuario*/
router.get('/activar/:id', function(req, res, next) {
  res.render('activar');
});

function handlePut(req, res) {
    res.send('Activate the user');
  // code ...
}

router.post('/activar/:id', handlePut);





module.exports = router;