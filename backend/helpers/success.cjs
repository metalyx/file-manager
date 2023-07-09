const success = (res, message = 'Success') => {
    return res.status(200).json({
        message,
    });
};

module.exports = success;
