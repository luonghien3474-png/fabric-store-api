import express from "express";
import * as accountController from "../controllers/account.controller.js";

const router = express.Router();

router.post("/signup", accountController.signup);
router.post("/login", accountController.login);
router.post("/google-login", accountController.googleLogin);

router.get("/", accountController.getAccounts);
router.get("/:id", accountController.getAccount);
router.put("/:id", accountController.updateAccount);
router.delete("/:id", accountController.deleteAccount);

export default router;