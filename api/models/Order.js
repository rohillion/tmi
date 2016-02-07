/**
 * Order.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport('smtps://todaysmenuisapp%40gmail.com:TmiRocks!@smtp.gmail.com');

// setup e-mail data with unicode symbols
var mailOptions = {
    from: 'Tmi App Order <todaysmenuisapp@gmail.com>', // Default From
    to: 'gagusherrera@gmail.com, rohillion@hotmail.com', // list of receivers
    subject: '', // Subject line
    //text: 'Un pedido nuevo! €€€ =)', // plaintext body
    html: '' // html body
};

module.exports = {

    attributes: {
        client: {
            model: 'user'
        },
        dish: {
            model: 'dish'
        },
        qty: 'string',
        active: 'boolean'
    },

    afterCreate: function (insertedRecord, cb) {

        console.log(insertedRecord);
        User.findOne({
            id: insertedRecord.client
        }, function (err, user) {
            if (err) {
                console.log('Order:afterCreate: User Lookup Error: ', err);
            }
console.log(user);
            Dish.findOne({
                id: insertedRecord.dish
            }, function (err, dish) {
                if (err) {
                    console.log('Order:afterCreate: Dish Lookup Error: ', err);
                }
console.log(dish);
                //Set client name
                mailOptions.from = user.name + '<todaysmenuisapp@gmail.com>';

                //Set client name
                mailOptions.subject = insertedRecord.qty + ' ' + dish.name;


                mailOptions.html = '<i>Menu Details</i>\
                                    <ul>\
                                        <li><b>Client: </b>'+user.name+'</li>\
                                        <li><b>Address: </b>'+user.address+'</li>\
                                        <li><b>Location: </b>\
                                            <a href="https://maps.google.ie/?q='+user.address+'&sll='+user.location.lat+','+user.location.lng+'">Go to maps</a>\
                                        </li>\
                                        <li><b>Phone: </b>'+user.phone+'</li>\
                                    </ul>\
                                    <i>Menu Details</i>\
                                    <ul>\
                                        <li><b>Dish: </b>' + dish.name + '</li>\
                                        <li><b>Qty: </b>' + insertedRecord.qty + '</li>\
                                        <li><b>Total: </b>€' + insertedRecord.qty * dish.price + '</li>\
                                    </ul>';
                
                ' maps.google.com/?q=ThePlace&sll=latitude,longitude'

                // send mail with defined transport object
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: ' + info.response);
                });

            });

        });

        cb();
    }
};