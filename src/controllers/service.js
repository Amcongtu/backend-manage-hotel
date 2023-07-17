import db from "../models/index.js"
import { responseHelper } from "../helpers/response.js"


export const createService = async (req, res) => {
    const { code, name, employee, amount, status } = req.body;


    try {
        const existingEmployee = await db.Employee.findOne({ where: { id: employee } });

        if (!existingEmployee) {
            return res.status(400).json(responseHelper(400, "Nhân viên không tồn tại", false, []));
        }

        const existingService = await db.Service.findOne({ where: { code } });

        if (existingService) {
            return res.status(400).json(responseHelper(400, "Dịch vụ đã tồn tại", false, []));
        }

        const service = await db.Service.create({
            code,
            name,
            employee,
            amount: amount || 0,
            status: status || "draft"
        });

        return res.status(201).json(responseHelper(201, "Thêm dịch vụ thành công", true, service));
    } 
    catch (error) 
    {

        return res.status(500).json(responseHelper(500, "Thêm dịch vụ không thành công", false, []));
    }
};

export const getServices = async (req, res) => {
    const { status } = req.query;
    let whereCondition = {};

    if (status) {
        whereCondition = { status };
    }

    try {
        const services = await db.Service.findAll({
            where: whereCondition
        });

        return res.status(200).json(responseHelper(200, 'Lấy danh sách dịch vụ thành công', true, services));
    } catch (error) {
        console.log(error);
        return res.status(500).json(responseHelper(500, 'Lỗi khi lấy danh sách dịch vụ', false, {}));
    }
};