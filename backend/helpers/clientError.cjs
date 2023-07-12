const clientError = (res, errorMessage = 'Wrong request') => {
    console.error(errorMessage);
    if (!res) {
        return;
    }

    return res.status(400).json({
        message: errorMessage,
    });
};

module.exports = clientError;
