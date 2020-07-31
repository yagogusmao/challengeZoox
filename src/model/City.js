/**
 * Archive: City.js
 * 
 * @author Yago Gusmão <yagogusmao1998@gmail.com>
 * 
 * City's model
 */

const moongose = require('mongoose');
const Schema = moongose.Schema;

const CitySchema = new Schema({
    name: { type: String, required: true },
    state_id: { type: "ObjectId", ref: "state", required: true },
    date_creation: { type: Date, required: true },
    date_last_update: { type: Date, required: true }
})

CitySchema.methods.create = function create(name, state_id) {
    if (typeof name === "string") this.name = name;
    else throw "O tipo do nome deve ser string.";
    this.state_id = state_id;
    this.date_creation = new Date();
    this.date_last_update = this.date_creation;
}

module.exports = moongose.model('city', CitySchema);