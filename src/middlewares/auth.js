import jwt from "jsonwebtoken"
import { responseHelper } from "../helpers/response.js";

const verifyToken = (req,res,next)=>{
    const token_bearer = req.header('Authorization');
    const token = token_bearer.split(' ')[1];
    const JWT_process = process.env.JWT_SECRET
    if(token){
        jwt.verify(token,JWT_process,(err,user)=>{
            if(err){
                return res.status(403).json({message:"Token không hợp lệ."});
            }
            req.user = user;
            next()
        })
    }
    else{
        return res.status(401).json({message:"You are not authenticated!"});
    }

}

export const getPosition = (req,res,next)=>{
    verifyToken(req,res ,()=>{
        if(req.user){
            return res.status(200).json({
                status:200,
                data: req.user
               
            })
        }else{
            return res.status(403).json({message:"You are not authorized!"});
        }
    })
}



export const verifyAdmin = (req,res,next)=>{
    verifyToken(req,res ,()=>{
        if(req.user){
            if(req.user.position == "admin"){
                return next()
            }
            return res.status(403).json(responseHelper(403, "Bạn không phải là admin", true, []))
        }else{
            return res.status(403).json(responseHelper(403, "Bạn không có quyền truy cập", true, []));
        }
    })
}


export const verifyTokenClient = (req,res,next)=>{
    const token = req.body.access_token_client;
    const JWT_process = process.env.JWT
    if(token){
        jwt.verify(token,JWT_process,(err,user)=>{
            // console.log(user)
            // console.log("chay")
    
            if(err){
                return res.status(403).json(responseHelper(403, "Hết phiên đăng nhập.", true, []));
            }
            req.user = user;
    
            next()
        })
    }
    else{

        return res.status(401).json(responseHelper(401  , "Bạn không có quyền truy cập", true, []));

    }

}
export const verifyClient = (req,res,next)=>{
    verifyTokenClient(req,res ,()=>{

        if(req.user){
            next();
        }else{
            
            return res.status(403).json({message:"You are not authorized!"});
        }
    })
}