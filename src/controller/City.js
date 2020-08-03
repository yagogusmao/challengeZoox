/**
 * Archive: City.js
 * 
 * @author Yago Gusmão <yagogusmao1998@gmail.com>
 * 
 * City's controller
 */

const express = require('express');
const router = express.Router();
const State = require('../model/State');
const City = require('../model/City');
const queryString = require('query-string');
const mongoose = require('mongoose');

router.route('/')
    .post(async (req, res) => {
        const { name, state_id } = req.body;
        if (mongoose.Types.ObjectId.isValid(state_id)) {
            if (!await State.findById(state_id))
                return res.status(400).json({ success: false, message: "Estado não encontrado." });
            if (await City.findOne({ name, state_id }))
                return res.status(400).json({ success: false, message: "Já existe uma cidade com este nome em seu estado." });
            try {
                const city = new City();
                city.create(name, state_id);
                await city.save((error, state) => {
                    if (error) res.status(400).json({ success: false, message: "Erro na hora de salvar a cidade." });
                    else res.status(201).json({ success: true, message: "Cidade criada com sucesso.", state })
                })
            } catch (error) { res.status(400).json({ success: false, message: error + "" }) }
        } else res.status(400).json({ success: false, message: "Insira um formato válido de _id para Estado." });
    })
    .get(async (req, res) => {
        const states = await State.find();
        let state_names = new Map();
        states.forEach(state => state_names.set(String(state._id), state.name));
        City.find().then(cities => {
            res.status(200).json({
                success: true, message: "Cidades salvas no sistema.", cities: cities.map(city => {
                    return {
                        _id: city._id,
                        name: city.name,
                        state_id: city.state_id,
                        state_name: state_names.get(String(city.state_id)),
                        date_creation: city.date_creation,
                        date_last_update: city.date_last_update
                    }
                })
            })
        })
    })

router.route('/states')
    .get(async (req, res) => {
        const states = await State.find();
        res.status(200).json({
            success: true, message: "Estados no sistema.", states: states.map(state => {
                return {
                    value: state._id,
                    viewValue: state.name
                }
            })
        })
    })

router.route('/:_id')
    .get((req, res) => {
        const { _id } = req.params;
        if (mongoose.Types.ObjectId.isValid(_id)) {
            City.findById(_id).then(city => {
                res.status(200).json({ success: true, message: "Cidade salva no sistema.", city })
            })
        } else res.status(400).json({ success: false, message: "Insira um formato válido de _id." });
    })
    .put(async (req, res) => {
        const { _id } = req.params;
        const { name, state_id } = req.body;
        if (mongoose.Types.ObjectId.isValid(_id)) {
            const city = await City.findById(_id);
            if (city) {
                if (await City.findOne({ name, state_id }))
                    return res.status(400).json({ success: false, message: "Já existe uma cidade com este nome em seu estado." });
                const city_updated = await City.findByIdAndUpdate(_id, { name, state_id, date_last_update: new Date() }, { new: true });
                res.status(200).json({ success: true, message: "Cidade atualizada com sucesso.", city: city_updated })
            } else res.status(400).json({ success: false, message: "Cidade não encontrada." });
        } else res.status(400).json({ success: false, message: "Insira um formato válido de _id." });
    })
    .delete(async (req, res) => {
        const { _id } = req.params;
        if (mongoose.Types.ObjectId.isValid(_id)) {
            const city = await City.findById(_id);
            if (!city) return res.status(400).json({ success: false, message: "Cidade não encontrado." });
            await city.deleteOne();
            res.status(200).json({})
        } else res.status(400).json({ success: false, message: "Insira um formato válido de _id." });
    })

module.exports = router;