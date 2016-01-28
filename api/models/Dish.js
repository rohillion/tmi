/**
 * Dish.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        active:'boolean',
        name: {
            type: 'string',
            size: '30'
        },
        imagePath: 'string',
        menu: {
            model: 'menu'
        },
        poll: {
            model: 'poll'
        }
    }
};