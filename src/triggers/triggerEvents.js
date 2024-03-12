const EventEmitter = require('events');
const { update } = require('lodash');
class MyEmitter extends EventEmitter{}
const EVENT = new MyEmitter
const LISTENER = require('../utils/listeners');

EVENT.addListener('update-history', LISTENER.addProductSalon);

module.exports = EVENT;