import db from "../models/index.js"
import { responseHelper } from "../helpers/response.js"

export const createPayment = async (req, res) => {
    const { booking, paymentAmount, paymentDate, employee, paymentMethod } = req.body;


    try {
        const existingBooking = await db.Booking.findOne({ where: { id: booking } });
        const existingEmployee = await db.Employee.findOne({ where: { id: employee } });

        if (!paymentAmount) {
            return res.status(400).json(responseHelper(400, "Số tiền thanh toán là bắt buộc.", false, []));
        }

        if (!existingBooking) {
            return res.status(400).json(responseHelper(400, "Đặt phòng không tồn tại", false, []));
        }

        if (!existingEmployee) {
            return res.status(400).json(responseHelper(400, "Nhân viên không tồn tại", false, []));
        }

        const payment = await db.Payment.create({
            booking,
            paymentAmount,
            paymentDate: paymentDate || new Date(),
            employee,
            paymentMethod: paymentMethod || "Chuyển khoản"
        });

        return res.status(200).json(responseHelper(200, "Thêm thanh toán thành công", true, payment));
    } catch (error) {

        return res.status(500).json(responseHelper(500, "Thêm thanh toán không thành công", false, []));
    }
};

export const getPayments = async (req, res) => {
    try {
        const payments = await db.Payment.findAll({
            include: [
                {
                    model: db.Booking,
                    attributes: ['id', 'checkInDate'],
                },
                {
                    model: db.Employee,
                    attributes: ['id', 'name', 'email'],
                },
            ],
        });

        return res.status(200).json(responseHelper(200, 'Lấy danh sách thanh toán thành công', true, payments));
    } catch (error) {
        console.log(error);
        return res.status(500).json(responseHelper(500, 'Lỗi khi lấy danh sách thanh toán', false, {}));
    }
};