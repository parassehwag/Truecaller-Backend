import express from "express";

import { loginUser, signUpUser } from "../controller/user-controller.js";
import {markSpam} from "../controller/spam-controller.js";
import { searchByName , searchByPhoneNumber} from "../controller/search-controller.js";
import {addContacts} from "../controller/global-contacts.js";
import authenticateToken from "../controller/jwt-controller.js";

const router = express.Router();

router.post("/signUp", signUpUser);
router.post("/login", loginUser);
//authenticateToken Authentication Token is Passed To Frontend During Login , which should be resent back in headder file to access the private routes.
router.post("/userContacts",/*authenticateToken*/addContacts);
router.post('/markspam', markSpam);                           
router.get('/searchByName',searchByName);                    
router.get('/searchByPhoneNumber',searchByPhoneNumber);       

export default router;