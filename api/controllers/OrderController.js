/**
 * OrderController
 *
 * @description :: Server-side logic for managing Orders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var OrderController = {
    index: function (req, res) {
        res.view({
            user: req.user
        });
    }
};

module.exports = OrderController;