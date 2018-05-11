const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Vote = require('../models/Vote');

const Pusher = require('pusher');

let pusher = new Pusher({
    appId: '524136',
    key: '24f9a55f5dea39ccb061',
    secret: '876c041a2c5e45741a8c',
    cluster: 'eu',
    encrypted: true
});

router.get('/', (req, res) => {
    Vote.find().then(votes => res.json({
        success: true,
        votes: votes
    }))
});

router.post('/', (req, res) => {
    const newVote = {
        os: req.body.os,
        points: 1
    };

    new Vote(newVote).save().then(vote => {
        pusher.trigger('os-pool', 'os-vote', {
            points: parseInt(vote.points),
            os: vote.os
        });
    });

    return res.json({success: true, message: 'Thank you for voting'});
});


module.exports = router;