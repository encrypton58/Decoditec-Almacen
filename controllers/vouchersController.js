const modelVoucher = require('../models/modelVouchers')
const Vale = require('../util/Vale')

function renderSearchView(req, res) {
    res.render('dashboard/vouchers/search.pug', { LOC: "dv", nombreArea: "Busqueda De Vales", sideLoc: "bv" })
}

function renderRegisterView(req, res) {
    res.render('dashboard/vouchers/register.pug', { LOC: "dv", nombreArea: "Registrar Vales", sideLoc: "rv" })
}

function renderEditView(req, res) {
    modelVoucher.valesLimit(req.query.pagination, (results) => {
        res.render('dashboard/vouchers/edit.pug', { LOC: "dv", nombreArea: "Editar Vales", vales: results, sideLoc: "ev" })
    })
}

function numberOfRegisters(req, res) {
    modelVoucher.numberOfRegisters().then(value => res.json(value)).catch(value => res.json(value))
}

function searchVouchers(req, res) {
    let tdv = req.query.tdv
    let filtro1 = req.query.f1
    let filtro2 = req.query.f2
    let plc1 = req.query.plc1
    let plc2 = req.query.plc2
    let version = req.query.version;
    let tipoDeVale

    if (version == "v2") {
        tipoDeVale = tdv.substr(0, tdv.length - 1)
        tipoDeVale += "_" + version
    } else {
        tipoDeVale = tdv
    }

    modelVoucher.searchVouchers(filtro1, plc1, filtro2, plc2, tipoDeVale).then(results => res.json(results))
        .catch(results => res.json(results))

}

function registerVoucher(req, res) {
    const Vale = require('../util/Vale')
    let tipoDeVale = req.body.tdv
    delete req.body.tdv
    let vale = new Vale(req.body.noFolio, req.body.nombre, req.body.fecha,
        req.body.proyecto, req.body.recibio,
        req.body.entrego, req.body.materiales, req.body.obserVale)
    modelVoucher.registerVoucher(vale, tipoDeVale).then(value => res.json(value))
        .catch(value => res.json(value))
}

function getUniqueVoucher(req, res) {
    let folio = req.params.folio
    let table = req.params.table
    let material = req.query.material
    let version = req.query.ver
    if (material && folio && table && version) {
        modelVoucher.getUniqueVoucher(material, folio, table, version)
            .then(value => res.json(value))
            .catch(value => res.json(value))
    } else {
        res.json({ error: "ID" })
    }
}

function deleteVoucher(req, res) {
    let folio = req.body.folio
    let tabla = req.body.tabla
    let material = req.body.material
    if (folio && tabla) {
        modelVoucher.deleteVoucher(material, folio, tabla)
            .then(value => res.json(value))
            .catch(value => res.json(value))
    } else {
        res.json({ error: "NoDataFull" })
    }
}

function editVoucher(req, res) {
    let db = require('../database/Connection')
    let tabla = req.body.tabla

    if (tabla == "vales_de_salidas" || tabla == "vales_de_entradas") {
        let v = req.body.vale
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
        console.log(oldVale);

        db.query("UPDATE " + tabla + " SET ? WHERE nofolio = ? AND material = ?", [oldVale, vale.noFolio, oldVale.material], (err, results) => {
            if (err) {
                console.log(err);
                res.json({ msg: "DB_errno" })
            } else {
                if (results.affectedRows > 0) {
                    res.json({ editado: true })
                } else {
                    res.json({ editado: false })
                }
            }
        })

    } else if (tabla == "vales_de_salida_v2") {
        let v = req.body.vale
        let vale = new Vale(v.noFolio, v.nombre, v.fecha, v.proyecto, v.recibio, v.entrego, JSON.stringify(v.materiales), v.obserVale)
        db.query("UPDATE " + tabla + " SET ? WHERE nofolio = ?", [vale, vale.noFolio], (err, results) => {
            if (err) {
                console.log(err);
                res.json({ msg: "DB_errno" })
            } else {
                if (results.affectedRows > 0) {
                    res.json({ editado: true })
                } else {
                    res.json({ editado: false })
                }
            }
        })
    }
}

module.exports = {
    renderSearchView,
    renderRegisterView,
    renderEditView,
    numberOfRegisters,
    searchVouchers,
    registerVoucher,
    getUniqueVoucher,
    deleteVoucher,
    editVoucher
}