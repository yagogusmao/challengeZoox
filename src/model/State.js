/**
 * Archive: State.js
 * 
 * @author Yago Gusmão <yagogusmao1998@gmail.com>
 * 
 * State's model
 */

const moongose = require('mongoose');
const Schema = moongose.Schema;

const StateSchema = new Schema({
    name: { type: String, required: true, unique: true },
    abbreviation: { type: String, required: true, unique: true },
    date_creation: { type: Date, required: true },
    date_last_update: { type: Date, required: true }
})

StateSchema.methods.create = function create(name, abbreviation) {
    if (typeof name === "string") this.name = name;
    else throw "O tipo do nome deve ser string.";
    if (typeof abbreviation === "string") this.abbreviation = abbreviation;
    else throw "O tipo da abreviação deve ser string.";
    this.date_creation = new Date();
    this.date_last_update = this.date_creation;
}

module.exports = moongose.model('state', StateSchema);