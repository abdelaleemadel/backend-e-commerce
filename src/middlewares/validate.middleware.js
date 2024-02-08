const validate = (schema) => {
    return (req, res, next) => {
        const data = { ...req.body, ...req.params, ...req.query };
        const validation = schema.validate(data, { abortEarly: false })
        if (validation.error) {
            const errorMessages = validation.error.details.map(detail => detail.message);
            return next(new Error(errorMessages, { cause: 400 }))
        }
        return next()
    }
}

export default validate;