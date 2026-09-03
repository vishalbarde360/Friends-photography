const express=require("express"); const router=express.Router(); const c=require("../controllers/user.controller"); const auth=require("../middleware/auth.user.js");
router.post("/register",c.registerUser); router.post("/setup-admin",c.setupAdmin); router.post("/login",c.loginUser); router.post("/logout",c.logoutUser); router.get("/me",auth,c.getCurrentUser); module.exports=router;
