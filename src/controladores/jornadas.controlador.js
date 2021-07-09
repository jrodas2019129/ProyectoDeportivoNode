'use strict'

var Jornada = require("../modelos/jornadas.model");
var Equipo = require("../modelos/equipos.model");

function crearJornada(req, res) {

    var jornadaModel = new Jornada();
    var params = req.body;

    if (params.nombre && params.liga) {
        jornadaModel.nombre = params.nombre;
        jornadaModel.liga = params.liga;
        Jornada.findOne({ nombre: params.nombre }, (err, jornadaEncontrada) => {
            if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
            if (!jornadaEncontrada) {
                Equipo.find((err, equipoEncontrados) => {
                    if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
                    if (!equipoEncontrados) return res.status(500).send({ mensaje: 'no hay equipos todavía para crear jornadas' });

                    Jornada.find((err, noJornadas) => {
                        if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
                        if (!noJornadas) return res.status(500).send({ mensaje: 'no hay jornadas' });

                        if (noJornadas.length < equipoEncontrados.length) {

                            jornadaModel.save((err, jornadaGuardada) => {
                                if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
                                if (!jornadaGuardada) return res.status(500).send({ mensaje: 'no se guardó la jornada' });
                                return res.status(200).send({ jornadaGuardada });
                            });
                        } else if (equipoEncontrados.length == 0)
                            return res.status(500).send({ mensaje: 'aun no hay equipos' });
                    });
                });
            } else {
                return res.status(500).send({ mensaje: 'esta jornada ya existe' });
            }
        });

    } else {
        return res.status(500).send({ mensaje: 'no puede dejar parametros vacios' });
    }

}

function agregarResultado1(req, res) {
    var params = req.body;
    var equipoModel = Equipo();

    Equipo.findOne({ nombre: params.equipo }, (err, equipoEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'error en la peticion' });

        equipoModel.nombre = equipoEncontrado.nombre;
        equipoModel.liga = equipoEncontrado.liga;
        equipoModel.puntos = equipoEncontrado.puntos + params.golesEquipo1;
        equipoModel.golesFavor = equipoEncontrado.golesFavor + params.golesEquipo1;
        equipoModel.golesContra = equipoEncontrado.golesContra + params.equipo2;
        equipoModel.diferenciaGoles = equipoModel.golesFavor - equipoModel.golesContra;

        Equipo.findByIdAndUpdate(equipoEncontrado.id, equipoModel, { new: true }, (err, equipoActualizado) => {
            if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
            if (!equipoActualizado) return res.status(500).send({ mensaje: 'no se actualizó el equipo' });

            Equipo.updateOne({ nombre: params.equipo }, {
                $push: {
                    enfrentamientos: {
                        enfrentamiento: params.equipo + " vs " + params.equipo2,
                        resultado: params.golesEquipo1 + " - " + params.golesEquipo2
                    }
                }
            }, (err, resultadoAgregada) => {

                return res.status(200).send({ resultadoAgregada });

            })



        });
    });
}

function agregarResultado2(req, res) {
    var params = req.body;
    var equipoModel = Equipo();

    Equipo.findOne({ nombre: params.equipo }, (err, equipoEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'error en la peticion' });

        equipoModel.nombre = equipoEncontrado.nombre;
        equipoModel.imagen = equipoEncontrado.imagen;
        equipoModel.liga = equipoEncontrado.liga;
        equipoModel.puntos = equipoEncontrado.puntos + params.golesEquipo2;
        equipoModel.golesFavor = equipoEncontrado.golesFavor + params.golesEquipo2;
        equipoModel.golesContra = equipoEncontrado.golesContra + params.equipo1;
        equipoModel.diferenciaGoles = equipoModel.golesFavor - equipoModel.golesContra;

        Equipo.findByIdAndUpdate(equipoEncontrado.id, equipoModel, { new: true }, (err, equipoActualizado) => {
            if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
            if (!equipoActualizado) return res.status(500).send({ mensaje: 'no se actualizó el equipo' });

            return res.status(200).send({ equipoActualizado });
        });

    });


}

module.exports = {
    crearJornada,
    agregarResultado1,
    agregarResultado2
}