'use stict'

var Equipo = require("../modelos/equipos.model");


function crearEquipo(req, res) {

    var equipoModel = new Equipo();
    var params = req.body;

    if (params.nombre && params.liga) {
        equipoModel.usuario = req.user.sub;
        equipoModel.nombre = params.nombre;
        equipoModel.liga = params.liga;
        equipoModel.puntos = 0;
        equipoModel.golesfavor = 0;
        equipoModel.golesContra = 0;
        equipoModel.diferenciaGoles = 0;
        Equipo.findOne({ nombre: params.nombre, liga: params.liga, usuario: req.user.sub }, (err, equipoEncontrado) => {
            if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
            if (!equipoEncontrado) {
                Equipo.find((err, equipos) => {
                    if (err) return res.status(500).send({ mensaje: 'error en la peticion' });

                    if (equipos.length >= 100) {
                        return res.status(500).send({ mensaje: 'maximo de equipos alcanzado' });
                    } else {
                        equipoModel.save((err, equipoguardado) => {
                            if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
                            if (!equipoguardado) return res.status(500).send({ mensaje: 'no se guardó el equipo' });
                            return res.status(200).send({ equipoguardado });

                        });
                    }
                });

            } else {
                return res.status(500).send({ mensaje: 'este equipo ya existe' });
            }
        });

    } else {
        return res.status(500).send({ mensaje: 'faltan datos' });
    }

}

function verEquipos(req, res) {

    var params = req.body;
    if (params.liga) {
        Equipo.find({ liga: params.liga }, (err, equiposEncontrados) => {
            if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
            if (!equiposEncontrados) return res.status(500).send({ mensaje: 'Aún no hay equipos' });

            return res.status(200).send({ equiposEncontrados });
        });
    }
}

function editarEquipo(req, res) {
    var params = req.body;
    var EquipoId = req.params.id;
    delete params.liga

    Equipo.findByIdAndUpdate(EquipoId, params, { new: true }, (err, equipoActualizado) => {
        if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
        if (!equipoActualizado) return res.status(500).send({ mensaje: 'no se pudo actualizar el equipo' });

        return res.status(200).send({ equipoActualizado });

    });
}

function eliminarEquipo(req, res) {

    var EquipoId = req.params.id;

    Equipo.findByIdAndDelete(EquipoId, (err, equipoEliminado) => {
        if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
        if (!equipoEliminado) res.status(500).send({ mensaje: 'no se pudo eliminar el equipo' });

        return res.status(200).send({ mensaje: 'se ha eliminado el equipo' + equipoEliminado });
    });

}

function obtenerEquipo(req, res) {
    var id = req.params.id;

    Equipo.findOne({ _id: id }, (err, Equipo_registrado) => {
        if (err) return res.status(500).send({ mensaje: "Error en peticion" });
        if (!Equipo_registrado) return res.status(500).send({ mensaje: "Error en peticion" });
        return res.status(200).send({ Equipo_registrado });
    })

}
module.exports = {
    verEquipos,
    crearEquipo,
    editarEquipo,
    eliminarEquipo,
    obtenerEquipo
}