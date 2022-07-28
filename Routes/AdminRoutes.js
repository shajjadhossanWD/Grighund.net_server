const express = require("express");
const router = express.Router();

const { addNewAdmin,
    getAllAdmin,
    changeAdminStatus,
    deleteAdmin,
    loginAdmin,
    getCurrentAdmin,
    sendResetPasswordEmail,
    resetPassword,
    updateAdminProfile,
    verifyOTP,
    getAdminById,
    updateAllAdminProfile } = require("../Controller/AdminController");

const upload = require("../Middleware/Upload");
const auth = require("../Middleware/AdminAuthMiddleware");

router.post("/admin/add", [auth, upload.single("image")], addNewAdmin);
router.get("/admin/all", getAllAdmin);
router.put("/admin/change-status/:id", auth, changeAdminStatus);
router.delete("/admin/delete/:id", auth, deleteAdmin);
router.post("/admin/login", loginAdmin);
router.post("/admin/verify", auth, verifyOTP);
router.get("/admin/current", auth, getCurrentAdmin);
router.post("/admin/send-reset-password-email", sendResetPasswordEmail);
router.put("/admin/reset-password", auth, resetPassword);
router.put("/admin/update-profile/:id", upload.single("image"), updateAdminProfile)
router.put("/admin/update-all-profile/:id", upload.single("image"), updateAllAdminProfile)
router.get("/admin/:id", getAdminById);


module.exports = router;