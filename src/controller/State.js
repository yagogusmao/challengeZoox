/**
 * Archive: State.js
 * 
 * @author Yago Gusmão <yagogusmao1998@gmail.com>
 * 
 * State's controller
 */

const express = require('express');
const router = express.Router();
const State = require('../model/State');
const City = require('../model/City');
const mongoose = require('mongoose');
const moment = require('moment');

router.route('/')
    .post(async (req, res) => {
        const { name, abbreviation } = req.body;
        if (await State.findOne({ name }))
            return res.status(400).json({ success: false, message: "Já existe um estado com este nome." });
        if (await State.findOne({ abbreviation }))
            return res.status(400).json({ success: false, message: "Já existe um estado com esta abreviação." });
        try {
            const state = new State();
            state.create(name, abbreviation);
            await state.save((error, state) => {
                if (error) res.status(400).json({ success: false, message: "Erro na hora de salvar o estado." });
                else res.status(201).json({ success: true, message: "Estado criado com sucesso.", state })
            })
        } catch (error) { res.status(400).json({ success: false, message: error + "" }) }
    })
    .get((req, res) => {
        State.find().then(states => {
            res.status(200).json({ 
                success: true, 
                message: "Estados salvos no sistema.", 
                states: states.map(state => {
                    return {
                        _id: state._id,
                        name: state.name,
                        abbreviation: state.abbreviation,
                        date_creation: moment(state.date_creation).format("DD/MM/YYYY"),
                        date_last_update: moment(state.date_last_update).format("DD/MM/YYYY"),
                    }
                }) 
            })
        })
    })
router.route('/:_id')
    .get((req, res) => {
        const { _id } = req.params;
        if (mongoose.Types.ObjectId.isValid(_id)) {
            State.findById(_id).then(async state => {
                const cities = await City.find({state_id: state._id});
                res.status(200).json({ success: true, message: "Estado salvo no sistema.", state, cities })
            })
        } else res.status(400).json({ success: false, message: "Insira um formato válido de _id." });
    })
    .put(async (req, res) => {
        const { _id } = req.params;
        const state_to_update = req.body;
        if (mongoose.Types.ObjectId.isValid(_id)) {
            const state = await State.findById(_id);
            if (state) {
                const state_name = await State.findOne({ name: state_to_update.name });
                const state_abbreviation = await State.findOne({ abbreviation: state_to_update.abbreviation });
                if (state_name && state_name.name !== state.name)
                    return res.status(400).json({ success: false, message: "Já existe um estado com este nome." });
                if (state_abbreviation && state_abbreviation.abbreviation !== state.abbreviation)
                    return res.status(400).json({ success: false, message: "Já existe um estado com esta abreviação." });
                const state_updated = await State.findByIdAndUpdate(_id, { ...state_to_update, date_last_update: new Date() }, { new: true });
                res.status(200).json({ success: true, message: "Estado atualizado com sucesso.", state: state_updated })
            } else res.status(400).json({ success: false, message: "Estado não encontrado." });
        } else res.status(400).json({ success: false, message: "Insira um formato válido de _id." });
    })
    .delete(async (req, res) => {
        const { _id } = req.params;
        if (mongoose.Types.ObjectId.isValid(_id)) {
            const state = await State.findById(_id);
            if (!state) return res.status(400).json({ success: false, message: "Estado não encontrado." });
            await state.deleteOne();
            City.find({ state_id: _id }).then(async citys => await Promise.all(citys.map(city => city.deleteOne())))
            res.status(200).json({})
        } else res.status(400).json({ success: false, message: "Insira um formato válido de _id." });
    })

module.exports = router;