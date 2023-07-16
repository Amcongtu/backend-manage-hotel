import db from "../models/index.js"
import { responseHelper } from "../helpers/response.js"


export const createFacility = async (req, res) => {
    const { code, name, description, employee, status } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!code || !name || !employee) {
        return res.status(400).json(responseHelper(400, "Vui lòng cung cấp đủ thông tin", false, []));
    }

    try {
        const existingEmployee = await db.Employee.findOne({ where: { id: employee } });

        if (!existingEmployee) {
            return res.status(400).json(responseHelper(400, "Nhân viên không tồn tại", false, []));
        }

        const facility = await db.Facility.create({
            code,
            name,
            description: description || "",
            employee,
            status: status || "draft"
        });

        return res.status(201).json(responseHelper(200, "Thêm dịch vụ thành công", true, facility));
    } catch (error) {

        return res.status(500).json(responseHelper(500, "Thêm dịch vụ không thành công", false, []));
    }
}

export const updateFacility = async (req, res) => {
    const { id } = req.params;
    const { name, description, employee, status } = req.body;
    
    try {
        const existingFacility = await db.Facility.findByPk(id);
    
        if (!existingFacility) {
            return res.status(404).json(responseHelper(404, "Không tìm thấy dịch vụ", false, []));
        }

        if (name) {
            existingFacility.name = name;
        }
    
        if (description) {
            existingFacility.description = description;
        }
    
        if (employee) {
            const existingEmployee = await db.Employee.findOne({ where: { id: employee } });
    
            if (!existingEmployee) {
                return res.status(400).json(responseHelper(400, "Nhân viên không tồn tại", false, []));
            }
    
            existingFacility.employee = employee;
        }
    
        if (status) {
            existingFacility.status = status;
        }
    
        await existingFacility.save();
    
        return res.status(200).json(responseHelper(200, "Sửa dịch vụ thành công", true, existingFacility));
    } catch (error) {
    
        return res.status(500).json(responseHelper(500, "Sửa dịch vụ không thành công", false, []));
    }
}