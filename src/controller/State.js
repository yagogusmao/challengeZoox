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
const queryString = require('query-string');
const mongoose = require('mongoose');

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
            res.status(200).json({ success: true, message: "Estados salvos no sistema.", states })
        })
    })
    .put(async (req, res) => {
        const { _id, state } = req.body;
        if (mongoose.Types.ObjectId.isValid(_id)) {
            if (await State.findOne({ name: state.name }))
                return res.status(400).json({ success: false, message: "Já existe um estado com este nome." });
            if (await State.findOne({ abbreviation: state.abbreviation }))
                return res.status(400).json({ success: false, message: "Já existe um estado com esta abreviação." });
            const state_updated = await State.findByIdAndUpdate(_id, { ...state, date_last_update: new Date() }, { new: true });
            if (!state_updated) res.status(400).json({ success: false, message: "Estado não encontrado." });
            else res.status(200).json({ success: true, message: "Estado atualizado com sucesso.", state: state_updated })
        } else res.status(400).json({ success: false, message: "Insira um formato válido de _id." });
    })
    .delete(async (req, res) => {
        const { _id } = queryString.parse(req._parsedUrl.query);
        if (mongoose.Types.ObjectId.isValid(_id)) {
            const state = await State.findById(_id);
            if (!state) return res.status(400).json({ success: false, message: "Estado não encontrado." });
            await state.deleteOne();
            City.find({ state_id: _id }).then(async citys => await Promise.all(citys.map(city => city.deleteOne())))
            res.status(200).json({})
        } else res.status(400).json({ success: false, message: "Insira um formato válido de _id." });
    })
    
module.exports = router;