import db from "../models/index.js"
import { responseHelper } from "../helpers/response.js"
import bcrypt from "bcrypt"
import { v4 } from "uuid"
import jwt from "jsonwebtoken"


export const registerEmployee = async (req, res, next) => {

    var {
        username,
        password,
        name,
        position,
        salary,
        email,
        address,
        phone,
        hireDate,
        status,
        department
    } = req.body

    if (!username || !password || !name || !position || !email) {
        return res.status(400).json(responseHelper(400, "Dữ liệu nhập vào bị thiếu", true, []))
    }

    const hashPassword = await bcrypt.hash(password, bcrypt.genSaltSync(12))

    try {
        const response = await db.Employee.findOrCreate({
            where: { username },
            defaults: {
                username,
                department,
                password: hashPassword,
                code: v4(),
                name,
                position,
                salary,
                email,
                address,
                phone,
                hireDate,
                status
            }
        })

        if (!response[1]) {
            return res.status(400).json(responseHelper(200, "Tồn tài tại khoản trong hệ thống", false, [token]))

        }
        const token = response[1] && jwt.sign({ code: response[0].code, username: response[0].username, position: response[0].position }, process.env.JWT_SECRET, { expiresIn: "2d" })

        return res.status(200).json(responseHelper(200, "Đăng ký thành công", true, [token]))
    }
    catch (error) {
        return res.status(200).json(responseHelper(500, "Đăng ký không thành công", false, [token]))
    }
}


export const loginEmployee = async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res
            .status(400)
            .json(responseHelper(400, "Bạn phải nhập tài khoản và mật khẩu.", false, []));
    }

    try {
        const employee = await db.Employee.findOne({ where: { username } });

        if (!employee) {
            return res
                .status(401)
                .json(responseHelper(401, "Tài khoản không tồn tại", false, []));
        }

        const isPasswordMatch = await bcrypt.compare(password, employee.password);

        if (!isPasswordMatch) {
            return res
                .status(401)
                .json(responseHelper(401, "Mật khẩu hoặc tài khoản không chính xác", false, []));
        }

        const token = jwt.sign(
            { code: employee.code, username: employee.username, position: employee.position },
            process.env.JWT_SECRET,
            { expiresIn: "2d" }
        );

        return res
            .status(200)
            .json(responseHelper(200, "Đăng nhập thành công", true,
                {
                    token: token,
                    name: employee.name,
                    position: employee.position,
                    salary: employee.salary,
                    email: employee.email,
                    address: employee.address,
                    phone: employee.phone,
                    hireDate: employee.hireDate,
                }));
    } catch (error) {
        return res
            .status(500)
            .json(responseHelper(500, "Hệ thống đang bảo trì!", false, []));
    }
};

export const getEmployees = async (req, res) => {
    try {
        const employees = await db.Employee.findAll({
            attributes: { exclude: ['password'] } // Loại bỏ trường 'password'
        });

        return res.status(200).json(responseHelper(200, 'Lấy danh sách nhân viên thành công', true, employees));
    } catch (error) {
        console.log(error);
        return res.status(500).json(responseHelper(500, 'Lỗi khi lấy danh sách nhân viên', false, {}));
    }
};
