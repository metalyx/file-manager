const serverError = (res, errorMessage = 'Unexpected server error') => {
    console.error(errorMessage);
    return res.status(500).json({
        message: errorMessage,
    });
};

module.exports = serverError;
