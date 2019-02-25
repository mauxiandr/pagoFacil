/* README */

El sistema fue realizado con Node.js y Express.js

La base de datos es con Postgresql (utilicé PgAdmin III), en el archivo pagoFacilDB.backup es en formato texto plano de la BD y el archivo pagoFacil.backup en formato custom.

Tanto en la tabla usuarios y transacciones existe un campo id y un campo id_usuario y id_trx respectivamente, la relación entre las mismas se realiza mediante la clave foreana id_trx de la tabla transacciones que apunta al campo id_usuario de la tabla usuarios, estos campos son creados aleatoreamente al crear el registro del usuario o de la transacción. Estos campos (id_usuario y id_trx) son los usuados para las rutas de la aplicación

Las rutas son:
http://localhost:3000/transaccion/registrar
http://localhost:3000/usuario/saldo/{id_usuario}
http://localhost:3000/usuario/activar/{id_usuario}
http://localhost:3000/transaccion/pagar/{id_trx}
http://localhost:3000/usuario/saldo/{id_usuario}

Las entradas son iguales a las establecidas en el formato de la prueba.