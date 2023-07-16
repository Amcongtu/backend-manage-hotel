import db from "../models/index.js"
import { responseHelper } from "../helpers/response.js"
import bcrypt from "bcrypt"
import {v4} from "uuid"
import jwt from "jsonwebtoken"


export const registerCustomer = async (req, res, next) =>{
    
    var {
        username,
        password,
        name,
        email,
        phone,
        gender,
        dateOfBirth,
    } = req.body


    if (!username || !password || !name || !phone || !email)
    {
        return res.status(400).json(responseHelper(400, "Dữ liệu nhập vào bị thiếu", true, []))
    }
    
    const hashPassword = await bcrypt.hash(password, bcrypt.genSaltSync(12)) 

    try {
        const response = await db.Customer.findOrCreate({
            where: {username},
            defaults: {
                username,
                password: hashPassword,
                name,
                email,
                phone,
                gender,
                dateOfBirth,
            }
        })   
    
        if (!response[1])
        {
            return res.status(400).json(responseHelper(200, "Tồn tài tại khoản trong hệ thống", false, [token]))

        }
        const token = response[1] && jwt.sign({code: response[0].code, username: response[0].username, position: response[0].position}, process.env.JWT_SECRET, {expiresIn: "2d"})
        
        return res.status(200).json(responseHelper(200, "Đăng ký thành công", true, [token]))
    } 
    catch (error) {
        return res.status(200).json(responseHelper(500, "Đăng ký không thành công", false, [token]))        
    }
}


export const loginCustomer = async (req, res, next) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res
        .status(400)
        .json(responseHelper(400, "Bạn phải nhập tài khoản và mật khẩu.", false, []));
    }
  
    try {
      const Customer = await db.Customer.findOne({ where: { username } });
  
      if (!Customer) {
        return res
          .status(401)
          .json(responseHelper(401, "Tài khoản không tồn tại", false, []));
      }
  
      const isPasswordMatch = await bcrypt.compare(password, Customer.password);
  
      if (!isPasswordMatch) {
        return res
          .status(401)
          .json(responseHelper(401, "Mật khẩu hoặc tài khoản không chính xác", false, []));
      }
  
      const token = jwt.sign(
        { code: Customer.code, username: Customer.username, position: Customer.position },
        process.env.JWT_SECRET,
        { expiresIn: "2d" }
      );
  
      return res
        .status(200)
        .json(responseHelper(200, "Đăng nhập thành công", true, [token]));
    } catch (error) {
      return res
        .status(500)
        .json(responseHelper(500, "Hệ thống đang bảo trì!", false, []));
    }
  };