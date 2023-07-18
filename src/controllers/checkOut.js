import db from "../models/index.js"
import { responseHelper } from "../helpers/response.js"

export const createCheckOut = async (req, res) => {
    const { booking, date, description, status, employee } = req.body;

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
            date,
            description: description || "", 
            status: status || "checkedOut",
            employee
        });

        return res.status(200).json(responseHelper(200, "Thêm Check-out thành công", true, checkOut));
    } catch (error) {
        console.log(error);
        return res.status(500).json(responseHelper(500, "Thêm Check-out không thành công", false, []));
    }
};
