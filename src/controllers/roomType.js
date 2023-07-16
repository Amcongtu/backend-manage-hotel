import db from "../models"
import { responseHelper } from "../helpers/response"

export const addRoomType = async (req, res) => {
    const { code, name, description, capacity, area, status, image, employee, priceBegin } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!code || !name || !employee) {
        return res.status(400).json(responseHelper(400, "Dữ liệu nhập vào bị thiếu", false, []));
    }

    const transaction = await db.sequelize.transaction();

    try {
        const existingEmployee = await db.Employee.findOne({ where: { id: employee } });

        if (!existingEmployee) {
            return res.status(400).json(responseHelper(400, "Nhân viên không tồn tại", false, []));
        }

        const existingRoomType = await db.RoomType.findOne({ where: { code } });

        if (existingRoomType) {
            return res.status(400).json(responseHelper(400, "Loại phòng đã tồn tại", false, []));
        }

        const roomType = await db.RoomType.create({
            code,
            name,
            description,
            capacity,
            area,
            status,
            employee,
            priceBegin
        }, { transaction });

        // Thêm dữ liệu từ mảng image vào bảng ImageRoomTypes
        if (Array.isArray(image)) {
            for (let i = 0; i < image.length; i++) {
                await db.ImageRoomType.create({
                    value: image[i].image,
                    valueId: image[i].imageId,
                    roomType: roomType.id
                }, { transaction });
            }
        }

        await transaction.commit();

        return res.status(200).json(responseHelper(200, "Thêm loại phòng thành công", true, roomType));
    } catch (error) {
        await transaction.rollback();

        return res.status(500).json(responseHelper(500, "Thêm loại phòng không thành công", false, []));
    }
};