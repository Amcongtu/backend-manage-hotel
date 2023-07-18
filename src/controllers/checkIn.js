import db from "../models/index.js"
import { responseHelper } from "../helpers/response.js"

export const createCheckIn = async (req, res) => {
    const { booking, date, status, description, employee } = req.body;

    const currentDate = new Date();
    const checkInDate = date || currentDate.toISOString(); // Sử dụng date từ request body hoặc lấy ngày giờ hiện tại dưới định dạng ISO

    const transaction = await db.sequelize.transaction();

    try {
        const existingBooking = await db.Booking.findOne({ where: { id: booking } });
        const existingEmployee = await db.Employee.findOne({ where: { id: employee } });

        if (!existingBooking) {
            return res.status(400).json(responseHelper(400, "Đặt phòng không tồn tại", false, []));
        }

        if (!existingEmployee) {
            return res.status(400).json(responseHelper(400, "Nhân viên không tồn tại", false, []));
        }

        const checkIn = await db.CheckIn.create({
            booking,
            date: checkInDate,
            status: status || "checkedIn",
            description: description || "",
            employee,
        }, { transaction });

        // Cập nhật trạng thái của booking thành "checkedIn"
        existingBooking.status = "checkedIn";
        await existingBooking.save({ transaction });

        await transaction.commit();

        return res.status(200).json(responseHelper(200, "Tạo Check-in thành công", true, checkIn));
    } catch (error) {
        await transaction.rollback();
        console.log(error);
        return res.status(500).json(responseHelper(500, "Tạo Check-in không thành công", false, []));
    }
};
