const { token } = req.body;

const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID
});

const payload = ticket.getPayload();

if (!payload.email_verified) {
    return res.status(400).json({
        message: "Google email is not verified."
    });
}

let account = await Account.findOne({ email: payload.email });

if (!account) {
    account = await Account.create({
        email: payload.email,
        name: payload.name,
        phoneNumber: "",
        address: "",
        googleId: payload.sub,
        authProvider: "google"
    });
} else if (account.authProvider === "local") {
    return res.status(400).json({
        message: "Please sign in using your password."
    });
}

if (!account.googleId) {
    account.googleId = payload.sub;
    await account.save();
}
const jwtToken = jwt.sign(
    {
        accountId: account._id
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "7d"
    }
);

return res.json({
    token: jwtToken,
    account
});