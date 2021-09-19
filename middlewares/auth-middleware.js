const ApiError = require('../exceptions/api-error');
const tokenService = require('../service/token-service');

module.exports = function(req, res, next) {
    try {
        const authrizationHeader = req.headers.authorization;
        if(!authrizationHeader) {
            return next(ApiError.UnauthorizedError);
        }

        const accessToken = authrizationHeader.split(' ')[1];
        if(!accessToken) {
            return next(ApiError.UnauthorizedError);
        }

        const userData = tokenService.validateAcсessToken(accessToken);
        if(!userData) {
            return next(ApiError.UnauthorizedError());
        }

        req.user = userData;
        next();
    } catch(e) {
        next(e);
    }
}