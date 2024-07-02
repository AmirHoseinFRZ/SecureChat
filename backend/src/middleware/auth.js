const jwt = require('jsonwebtoken');
const config = require('config');
const {Admin: User} = require('../models/user');

module.exports = function (permission){
    return function (req, res, next) {
        const token = req.cookies['x-auth-token'];

        if (!token) {
            return res.sendStatus(401); // Unauthorized
        }

        jwt.verify(token, config.get('jwtPrivateKey'), async (err, admin) => {
            if (err) {
                return res.sendStatus(403); // Forbidden
            }
            req.admin = admin;

            if (permission) {
                const user = await User.findByPk(req.admin.id);
                const role = await user.getRoles();
                let permissions = await role[0].getPermissions();
                permissions = permissions.map((p) => p.code);
                if(permissions.includes(permission) || permissions.includes('ALL_' + permission.split('_')[1])) next();
                else
                    return res.sendStatus(403); // Forbidden
            }
            else next();
        });
    }
}
