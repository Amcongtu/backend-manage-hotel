import db from "../models/index.js"
import { responseHelper } from "../helpers/response.js"

export const createBooking = async (req, res) => {
    var {
        customer,
        room,
        checkInDate,
        checkOutDate,
        status,
        total,
        employee
    } = req.body;

    const transaction = await db.sequelize.transaction();

    try {
        if(!employee)
        {
            employee = null
        }
        if(!status)
        {
            status = "spending"
        }
        if (!checkInDate || !checkOutDate)
        {
            return res.status(400).json(responseHelper(400, "Ngày check in hoặc check out không được để trống", false, []));
        }
        const existingCustomer = await db.Customer.findOne({ where: { id: customer } });
        const existingRoom = await db.Room.findOne({ where: { id: room } });
        const existingBooking = await db.Booking.findOne({ where: { room, checkInDate, checkOutDate } });

        if (!existingCustomer) {
            return res.status(400).json(responseHelper(400, "Khách hàng không tồn tại", false, []));
        }

        if (!existingRoom) {
            return res.status(400).json(responseHelper(400, "Phòng không tồn tại", false, []));
        }

        if (existingBooking) {
            return res.status(400).json(responseHelper(400, "Đặt phòng không hợp lệ", false, []));
        }

        const booking = await db.Booking.create({
            customer,
            room,
            checkInDate,
            checkOutDate,
            status,
            total,
            employee
        }, { transaction });

        await transaction.commit();

        return res.status(201).json(responseHelper(200, "Đặt phòng thành công", true, booking));
    } catch (error) {
        console.log(error);
        await transaction.rollback();

        return res.status(500).json(responseHelper(500, "Đặt phòng không thành công", false, []));
    }
};