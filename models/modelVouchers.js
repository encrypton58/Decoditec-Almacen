const db = require('../database/Connection')


function valesLimit(startCount, callback) {
    db.query(`SELECT * FROM vales_de_salidas ORDER BY fecha DESC LIMIT ${startCount}, 50`, (err, results) => {
        if (err) {
            console.log(err);
            callback(err)
        } else {
            callback(results)
        }
    })
}

function numberOfRegisters() {
    return new Promise((resolve, reject) => {
        db.query("SELECT COUNT(*) AS registros FROM vales_de_salidas", (err, results) => {
            if (err) {
                console.log(err);
                reject({ msg: err })
            } else {
                resolve(results)
            }
        })
    })

}

function searchVouchers(filtro1, plc1, filtro2, plc2, tipoDeVale) {
    return new Promise((resolve, reject) => {
        if (tipoDeVale != "vales_de_salidas" || tipoDeVale != "vales_de_entradas" ||
            tipoDeVale != "vales_de_salida_v2" || tipoDeVale != "vales_de_entrada_v2") {
            if (filtro1 && plc1 && filtro2 && plc2) {
                db.query(`SELECT * FROM ${tipoDeVale} WHERE ${filtro1} LIKE '%${plc1}%' AND ${filtro2} LIKE '%${plc2}%'`, (err, results) => {
                    if (err) {
                        console.log(err);
                        reject({ msg: err.message })
                    } else {
                        resolve(results)
                    }
                })
            } else if (filtro1 && plc1) {
                db.query(`SELECT * FROM ${tipoDeVale} WHERE ${filtro1} LIKE '%${plc1}%'`, (err, results) => {
                    if (err) {
                        console.log(err);
                        reject({ msg: err.message })
                    } else {
                        resolve(results)
                    }
                })
            }
        }
    })
}

function registerVoucher(vale, tipoDeVale) {
    return new Promise((resolve, reject) => {
        if (tipoDeVale == "vs") {
            let strJson = JSON.stringify(vale.materiales)
            db.query(`INSERT INTO vales_de_salida_v2 VALUES(?,?,?,?,?,?,?,?)`, [
                vale.noFolio, vale.nombre, vale.fecha, vale.proyecto, vale.recibio,
                vale.entrego, strJson, vale.obserVale
            ], (err, results) => {
                if (err) {
                    console.log(err);
                    reject(err.sqlMessage)
                } else {
                    if (results.affectedRows > 0) {
                        resolve({ msg: true })
                    } else {
                        resolve({ msg: false })
                    }
                }
            })

        } else if (tipoDeVale == "ve") {
            let strJson = JSON.stringify(vale.materiales)
            db.query(`INSERT INTO vales_de_entrada_v2 VALUES(?,?,?,?,?,?,?,?)`, [
                vale.noFolio, vale.nombre, vale.fecha, vale.proyecto, vale.recibio,
                vale.entrego, strJson, vale.obserVale
            ], (err, results) => {
                if (err) {
                    console.log(err);
                    reject(err.sqlMessage)
                } else {
                    if (results.affectedRows > 0) {
                        resolve({ msg: true })
                    } else {
                        resolve({ msg: false })
                    }
                }
            })
        }
    })
}

function getUniqueVoucher(material, folio, table, version) {
    return new Promise((resolve, reject) => {
        if (version == "v2") {
            db.query(`SELECT * FROM ${table} WHERE noFolio = ?`, [folio], (err, results) => {
                if (err) {
                    console.log(err);
                    reject({ msg: "DB_erno" })
                } else {
                    resolve(results)
                }
            })
        } else {
            db.query(`SELECT * FROM ${table} WHERE noFolio = ? AND material = ?`, [folio, material], (err, results) => {
                if (err) {
                    console.log(err);
                    reject({ msg: "DB_erno" })
                } else {
                    resolve(results)
                }
            })
        }
    })
}

function deleteVoucher(material, folio, tabla) {
    return new Promise((resolve, reject) => {
        if (tabla == "vales_de_salidas") {
            db.query("DELETE FROM " + tabla + " WHERE noFolio = ? AND material = ?", [folio, material], (err, results) => {
                if (err) {
                    console.log(err);
                    reject({ msg: "DB_err" })
                } else {
                    console.log(results);
                    if (results.affectedRows > 0) {
                        resolve({ eliminado: true })
                    } else {
                        resolve({ eliminado: false })
                    }
                }
            })
        } else {
            db.query("DELETE FROM " + tabla + " WHERE noFolio = ?", [folio], (err, results) => {
                if (err) {
                    console.log(err);
                    reject({ msg: "DB_err" })
                } else {
                    console.log(results);
                    if (results.affectedRows > 0) {
                        resolve({ eliminado: true })
                    } else {
                        resolve({ eliminado: false })
                    }
                }
            })
        }
    })
}

function editVoucher(req) {
    return new Promise((resolve, reject) => {
        let tabla = req.body.tabla
        if (tabla == "vales_de_salidas" || tabla == "vales_de_entradas") {
            let v = req.body.vale
            console.log(tabla, v)
            let vale = new Vale(v.noFolio, v.nombre, v.fecha, v.proyecto, v.recibio, v.entrego, v.materiales)
            console.log(vale);
            let oldVale = {
                nombre: vale.nombre,
                noFolio: vale.noFolio,
                fecha: vale.fecha,
                cantidad: vale.materiales[0].cantidad,
                material: vale.materiales[0].material,
                proyecto: vale.proyecto,
                recibio: vale.recibio,
                entrego: vale.entrego,
                observacion: vale.materiales[0].observacion
            }
            db.query("UPDATE " + tabla + " SET ? WHERE nofolio = ? AND material = ?", [oldVale, vale.noFolio, oldVale.material], (err, results) => {
                if (err) {
                    console.log(err);
                    reject({ msg: "DB_errno" })
                } else {
                    if (results.affectedRows > 0) {
                        resolve({ editado: true })
                    } else {
                        resolve({ editado: false })
                    }
                }
            })
        } else if (tabla == "vales_de_salida_v2") {
            let v = req.body.vale
            let vale = new Vale(v.noFolio, v.nombre, v.fecha, v.proyecto, v.recibio, v.entrego, JSON.stringify(v.materiales), v.obserVale)
            db.query("UPDATE " + tabla + " SET ? WHERE nofolio = ?", [vale, vale.noFolio], (err, results) => {
                if (err) {
                    console.log(err);
                    reject({ msg: "DB_errno" })
                } else {
                    if (results.affectedRows > 0) {
                        resolve({ editado: true })
                    } else {
                        resolve({ editado: false })
                    }
                }
            })
        }
    })
}

function Vale(noFolio, nombre, fecha, proyecto, recibio, entrego, materiales, tdv) {
    this.noFolio = noFolio
    this.nombre = nombre
    this.fecha = fecha
    this.proyecto = proyecto
    this.recibio = recibio
    this.entrego = entrego
    this.materiales = materiales
    this.tdv = tdv
}

module.exports = {
    valesLimit,
    numberOfRegisters,
    searchVouchers,
    registerVoucher,
    getUniqueVoucher,
    deleteVoucher,
    editVoucher
}