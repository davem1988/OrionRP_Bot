const schema = require('../../models/dashboard');
const jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWT_SECRET
module.exports = {
    name: '/callback',
    run: async (req, res) => {
        if (!req.query.code) res.redirect('/login');
        let oauthData;
        try {
            oauthData = await process.oauth.tokenRequest({
                code: req.query.code,
                scope: "identify",
                grantType: "authorization_code",
            });
        } catch (e) {};
        if (!oauthData) return res.redirect('/login');
        const user = await process.oauth.getUser(oauthData.access_token);
        let data = await schema.findOne({
            userID: user.id
        });
        if (!data) data = new schema({
            userID: user.id
        });
        // By default data._id looks like `new ObjectId("61d1b8293bc06ad731f3a43b")`
        // we need just the id to be able to use it in the JWT.
        const id = data._id.toString();
        data.access_token = oauthData.access_token;
        data.refresh_token = oauthData.refresh_token;
        data.expires_in = oauthData.expires_in;
        data.secretAccessKey = jwt.sign({
            userID: user.id,
            uuid: id
        }, jwt_secret);
        data.user = {
            id: user.id,
            username: user.username,
            discriminator: user.discriminator,
            avatar: user.avatar
        };
        await data.save();
        res.cookie('token', data.secretAccessKey, { maxAge: 86400000 });
        res.end(`<script>window.location.href = '/dashboard';</script>`);
    }
};
