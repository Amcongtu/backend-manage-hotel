import db from "../models/index.js"
import { responseHelper } from "../helpers/response.js"

export const createCheckOut = async (req, res) => {
    const { booking, date, description, status, employee } = req.body;

    const currentDate = new Date();
    const checkOutDate = date || currentDate; // Sử dụng date từ request body hoặc lấy ngày giờ hiện tại dưới định dạng ISO

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

        const checkOut = await db.CheckOut.create({
            booking,
            date: checkOutDate,
            description: description || "",
            status: status || "checkedOut",
            employee
        }, { transaction });

        // Cập nhật trạng thái của booking thành "checkedOut"
        existingBooking.status = "checkedOut";
        await existingBooking.save({ transaction });

        await transaction.commit();

        return res.status(200).json(responseHelper(200, "Thêm Check-out thành công", true, checkOut));
    } catch (error) {
        await transaction.rollback();
        console.log(error);
        return res.status(500).json(responseHelper(500, "Thêm Check-out không thành công", false, []));
    }
};
