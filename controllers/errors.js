



const handlePSQLErrors = (err, req, res, next) => {
    const badReqCode = ['42703']
    if (badReqCode.includes(err.code)) {
        res.status(400).send({ msg: "Bad request" })
    } else {
        next(err)
    }
}

const send404 = (req, res, next) => {
    res.status(404).send({ msg: 'Route not found' });
};

const handleInternalServerErrors = (err, req, res, next) => {
    res.status(500).send({msg: "Internal server error"})
}

module.exports = {send404 , handleInternalServerErrors, handlePSQLErrors}