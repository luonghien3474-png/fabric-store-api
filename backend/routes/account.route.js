const express = require("express");

const router = express.Router();

const accountController = require("../controllers/account.controller");

router.post("/signup", accountController.signup);

router.post("/login", accountController.login);

router.post("/google-login", accountController.googleLogin);

router.get("/", accountController.getAccounts);

router.get("/:id", accountController.getAccount);

router.put("/:id", accountController.updateAccount);

router.delete("/:id", accountController.deleteAccount);

module.exports = router;