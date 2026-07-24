const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next()
    }
    else {
        return res.status(301).json({ messsge: "Not allowed admins only " })
    }
}

module.exports = { admin }