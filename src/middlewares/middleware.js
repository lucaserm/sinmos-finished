exports.middlewareGlobal = (req, res, next)  =>{
    res.locals.variable = 'jafh318aizi82k1a9token.';
    next();
};