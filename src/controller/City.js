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
const mongoose = require('mongoose');
const moment = require('moment');

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
                await city.save((error, city) => {
                    if (error) res.status(400).json({ success: false, message: "Erro na hora de salvar a cidade." });
                    else res.status(201).json({ success: true, message: "Cidade criada com sucesso.", city })
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
                success: true, 
                message: "Cidades salvas no sistema.", 
                cities: cities.map(city => {
                    return {
                        _id: city._id,
                        name: city.name,
                        state_id: city.state_id,
                        state_name: state_names.get(String(city.state_id)),
                        date_creation: moment(city.date_creation).format("DD/MM/YYYY"),
                        date_last_update: moment(city.date_last_update).format("DD/MM/YYYY")
                    }
                })
            })
        })
    })

router.route('/states')
    .get(async (req, res) => {
        const states = await State.find();
        res.status(200).json({
            success: true, 
            message: "Estados no sistema.", 
            states: states.map(state => {
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
                res.status(200).json({ success: true, message: "Cidade encontrada no sistema.", city })
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
        } else res.status(400).json({ success: false, message: "Insira um formato válido de _id para Cidade." });
    })
    .delete(async (req, res) => {
        const { _id } = req.params;
        if (mongoose.Types.ObjectId.isValid(_id)) {
            const city = await City.findById(_id);
            if (!city) return res.status(400).json({ success: false, message: "Cidade não encontrada." });
            await city.deleteOne();
            res.status(200).json({})
        } else res.status(400).json({ success: false, message: "Insira um formato válido de _id para Cidade." });
    })

module.exports = router;