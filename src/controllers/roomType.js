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
                    value: image[i].image || "",
                    valueId: image[i].imageId || "",
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

export const getRoomAndRelatedData = async (req, res) => {
    const { code } = req.params;

    try {
        const roomType = await db.RoomType.findOne({
            where: { code },
            attributes: ['id', 'code', 'name', 'description', 'capacity', 'area', 'status', 'employee', 'priceBegin'],
            include: [
                {
                    model: db.ImageRoomType,
                    attributes: ['value']

                }
            ]
        });

        if (!roomType) {
            return res.status(404).json(responseHelper(404, "Không tìm thấy loại phòng", false, {}));
        }

        const relatedRooms = await db.Room.findAll({
            where: { roomType: roomType.id, status: "published" }, // Sửa thành where: { roomType: roomType.id }
            attributes: ['code', 'name', 'description', 'price', 'capacity'],
            include: [
                {
                    model: db.ImageRoom,
                    attributes: ['value']
                }
            ]
        });

        const result = {
            id: roomType.id,
            code: roomType.code,
            name: roomType.name,
            description: roomType.description,
            capacity: roomType.capacity,
            area: roomType.area,
            status: roomType.status,
            employee: roomType.employee,
            priceBegin: roomType.priceBegin,
            image: roomType.ImageRoomTypes,
            rooms: relatedRooms
        };

        return res.status(200).json(responseHelper(200, "Lấy thông tin phòng và dữ liệu liên quan thành công", true, result));
    } catch (error) {
        return res.status(500).json(responseHelper(500, "Lỗi khi lấy thông tin phòng và dữ liệu liên quan", false, []));
    }
};
export const getAllRoomTypes = async (req, res) => {
    const { status } = req.query;

    try {
        let roomTypes;

        if (status) {
            roomTypes = await db.RoomType.findAll({
                where: { status },
                include: [
                    {
                        model: db.ImageRoomType,
                        attributes: ['value'],
                    },
                    {
                        model: db.Employee,
                        attributes: ['id', 'name', 'email'],
                    },
                ],
            });
        } else {
            roomTypes = await db.RoomType.findAll({
                include: [
                    {
                        model: db.ImageRoomType,
                        attributes: ['value'],
                    },
                    {
                        model: db.Employee,
                        attributes: ['id', 'name', 'email'],
                    },
                ],
            });
        }

        return res.status(200).json(responseHelper(200, "Danh sách loại phòng", true, roomTypes));
    } catch (error) {
        console.log(error);

        return res.status(500).json(responseHelper(500, "Lỗi khi lấy danh sách loại phòng", false, []));
    }
};


export const updateRoomType = async (req, res) => {
    const { id } = req.params;
    const { code, name, description, capacity, area, status, employee, priceBegin } = req.body;

    try {
        const existingEmployee = await db.Employee.findOne({ where: { id: employee } });
        if (!existingEmployee) {
            return res.status(400).json(responseHelper(400, "Nhân viên không tồn tại", false, []));
        }

        const roomType = await db.RoomType.findOne({ where: { id } });
        if (!roomType) {
            return res.status(404).json(responseHelper(404, "Không tìm thấy loại phòng", false, {}));
        }

        const updatedRoomType = await roomType.update({
            code,
            name,
            description,
            capacity,
            area,
            status,
            employee,
            priceBegin
        });

        return res.status(200).json(responseHelper(200, "Cập nhật loại phòng thành công", true, updatedRoomType));
    } catch (error) {
        return res.status(500).json(responseHelper(500, "Cập nhật loại phòng không thành công", false, []));
    }
};

export const deleteRoomType = async (req, res) => {
    const { id } = req.params;

    const transaction = await db.sequelize.transaction();

    try {
        const roomType = await db.RoomType.findOne({ where: { id }, transaction });

        if (!roomType) {
            await transaction.rollback();
            return res.status(404).json(responseHelper(404, "Không tìm thấy loại phòng", false, {}));
        }

        // Xóa các phòng liên quan
        await db.Room.destroy({ where: { roomType: id }, transaction });

        // Xóa các ảnh liên quan trong ImageRoomTypes
        await db.ImageRoomType.destroy({ where: { roomType: id }, transaction });

        // Xóa loại phòng
        await roomType.destroy({ transaction });

        await transaction.commit();

        return res.status(200).json(responseHelper(200, "Xóa loại phòng thành công", true, {}));
    } catch (error) {
        await transaction.rollback();
        return res.status(500).json(responseHelper(500, "Xóa loại phòng không thành công", false, []));
    }
};
