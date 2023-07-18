import db from "../models"
import { responseHelper } from "../helpers/response"

export const getAllRooms = async (req, res) => {
    const { status } = req.query;

    try {
        var rooms = []
        if (!status) {
            rooms = await db.Room.findAll({});
        }
        else {
            rooms = await db.Room.findAll({ where: status });
        }
        return res
            .status(200)
            .json(responseHelper(200, "Lấy danh sách phòng thành công", true, rooms));
    } catch (error) {
        return res
            .status(500)
            .json(responseHelper(500, "Lấy danh sách phòng không thành công", false, []));
    }
};


export const createRoom = async (req, res) => {
    const {
        code,
        name,
        description,
        price,
        capacity,
        roomType,
        image,
        employee,
        status
    } = req.body;

    const transaction = await db.sequelize.transaction();

    try {
        const existingRoomType = await db.RoomType.findOne({ where: { id: roomType } });
        const existingEmployee = await db.Employee.findOne({ where: { id: employee } });
        const existingRoom = await db.Room.findOne({ where: { code } });

        if (!existingRoomType) {
            return res.status(400).json(responseHelper(400, "Loại phòng không tồn tại", false, []));
        }

        if (!existingEmployee) {
            return res.status(400).json(responseHelper(400, "Nhân viên không tồn tại", false, []));
        }

        if (existingRoom) {
            return res.status(400).json(responseHelper(400, "Phòng này đã tồn tại", false, []));
        }

        const room = await db.Room.create({
            code,
            name,
            description: description || "Chưa có cập nhật mô tả",
            price: price || 500000,
            capacity: capacity || 0,
            roomType,
            employee,
            status
        }, { transaction });

        // Thêm dữ liệu từ mảng image vào bảng ImageRooms
        if (Array.isArray(image)) {
            for (let i = 0; i < image.length; i++) {
                await db.ImageRoom.create({
                    value: image[i].value,
                    valueId: image[i].valueId,
                    room: room.id
                }, { transaction });
            }
        }

        await transaction.commit();

        return res.status(201).json(responseHelper(200, "Thêm phòng thành công", true, room));
    } catch (error) {
        await transaction.rollback();

        return res.status(500).json(responseHelper(500, "Thêm phòng không thành công", false, []));
    }
};

export const getRoomById = async (req, res) => {
    const { id } = req.params;

    try {
        const room = await db.Room.findOne({
            where: { id },
            include: [
                {
                    model: db.ImageRoom,
                    attributes: ['value'],
                },
                {
                    model: db.RoomType,
                    include: [
                        {
                            model: db.Employee,
                            attributes: ['id', 'name', 'email'],
                        },
                        {
                            model: db.ImageRoomType,
                            attributes: ['value'],
                        },
                    ],
                },
            ],
        });

        if (!room) {
            return res.status(404).json(responseHelper(404, "Phòng không tồn tại", false, {}));
        }

        return res.status(200).json(responseHelper(200, "Lấy chi tiết phòng thành công", true, room));
    } catch (error) {
        console.log(error);
        return res.status(500).json(responseHelper(500, "Lỗi khi lấy chi tiết phòng", false, {}));
    }
};


export const deleteRoom = async (req, res) => {
    const { id } = req.params;

    const transaction = await db.sequelize.transaction();

    try {
        const room = await db.Room.findOne({ where: { id }, transaction });

        if (!room) {
            await transaction.rollback();
            return res.status(404).json(responseHelper(404, "Phòng không tồn tại", false, {}));
        }

        // Xóa các ảnh liên quan trong ImageRooms
        await db.ImageRoom.destroy({ where: { room: id }, transaction });

        // Xóa phòng
        await room.destroy({ transaction });

        await transaction.commit();

        return res.status(200).json(responseHelper(200, "Xóa phòng thành công", true, {}));
    } catch (error) {
        await transaction.rollback();
        return res.status(500).json(responseHelper(500, "Xóa phòng không thành công", false, []));
    }
};
