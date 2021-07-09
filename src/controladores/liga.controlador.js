'use strict'

var Liga = require("../modelos/ligas.model");
var Equipo = require("../modelos/equipos.model");

function crearLiga(req, res) {

    var ligaModel = new Liga();
    var params = req.body;

    if (params.nombre) {
        ligaModel.nombre = params.nombre;
        ligaModel.usuario = req.user.sub;
        Liga.findOne({ nombre: params.nombre, usuario: req.user.sub }, (err, ligaEncontrada) => {
            if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
            if (!ligaEncontrada) {
                ligaModel.save((err, ligaGuardada) => {
                    if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
                    if (!ligaGuardada) return res.status(500).send({ mensaje: 'no se guardó la liga' });
                    return res.status(200).send({ ligaGuardada });
                });

            } else {
                return res.status(500).send({ mensaje: 'este equipo ya existe' });
            }
        });

    } else {
        return res.status(500).send({ mensaje: 'no puede dejar parametros vacios' });
    }

}

function verLigas(req, res) {

    Liga.find({ usuario: req.user.sub }, (err, ligasEncontradas) => {
        if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
        if (!ligasEncontradas) return res.status(500).send({ mensaje: 'Aún no hay ligas' });

        return res.status(200).send({ ligasEncontradas });
    });
}

function editarLiga(req, res) {
    var params = req.body;
    var LigaId = req.params.id;
    delete params.usuario;
    Liga.findByIdAndUpdate(LigaId, params, { new: true }, (err, ligaActualizada) => {
        if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
        if (!ligaActualizada) return res.status(500).send({ mensaje: 'no se pudo actualizar la liga' });

        return res.status(200).send({ ligaActualizada });

    });
}

function eliminarLiga(req, res) {

    var LigaId = req.params.id;

    Liga.findByIdAndDelete(LigaId, (err, ligaEliminada) => {
        if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
        if (!ligaEliminada) res.status(500).send({ mensaje: 'no se pudo eliminar la liga' });

        Equipo.deleteMany({ liga: LigaId }, (err, equiposEliminados) => {
            if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
            if (!equiposEliminados) res.status(500).send({ mensaje: 'no se pudo eliminar los equipos' });

            return res.status(200).send({ mensaje: 'se ha eliminado la liga' + ligaEliminada });
        });
    });

}

function obtenerLiga(req, res) {
    var id = req.params.id;

    Liga.findOne({ _id: id }, (err, liga_registrado) => {
        if (err) return res.status(500).send({ mensaje: "Error en peticion" });
        if (!liga_registrado) return res.status(500).send({ mensaje: "Error en peticion" });
        return res.status(200).send({ liga_registrado });
    })

}
module.exports = {
    crearLiga,
    verLigas,
    editarLiga,
    eliminarLiga,
    obtenerLiga
}