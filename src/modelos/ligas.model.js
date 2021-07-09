'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var LigaSchema = Schema({
    nombre: String,
    usuario: { type: Schema.Types.ObjectId, ref: 'usuarios' }
});

module.exports = mongoose.model('ligas', LigaSchema);