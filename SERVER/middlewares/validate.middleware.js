// middlewares/validate.middleware.js
export const validateJoi = function(joiSchema) {
    return (req, res, next) => {
        const { value, error } = joiSchema.validate(req.body);

        if (error) {
            return res.status(400).json({ error: error.details });
        } else {
            req.body = value;
            next();
        }
    };
};

