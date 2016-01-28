var cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: sails.config.cloudinary.CLOUDINARY_NAME,
    api_key: sails.config.cloudinary.CLOUDINARY_KEY,
    api_secret: sails.config.cloudinary.CLOUDINARY_SECRET
});

module.exports = {

    upload: function (req, res) {
        req.file('file').upload(function (err, uploadedFiles) {
            if (err) {
                res.json(500, err);
            } else {
                if (uploadedFiles.length > 0) {
                    cloudinary.uploader.upload(uploadedFiles[0].fd, function (result) {
                        Dish.update(req.param('id'), {
                            imagePath: result.url
                        }, function (err) {
                            if (err) {
                                res.json(500, err);
                            } else {
                                res.json(200, {
                                    url: result.url
                                });
                            }
                        });
                    });
                }
            }
        });
    }
};

//API_URL: 'https://api.cloudinary.com/v1_1/kitchsy/image/upload',
//UPLOAD_PRESET: 'krosjmtm'