import db from "../models/index.js"
import { responseHelper } from "../helpers/response.js"

export const createCheckOut = async (req, res) => {
    let { booking, date, description, status, employee, services } = req.body;

    const currentDate = new Date();
    const checkOutDate = date || currentDate;

    const transaction = await db.sequelize.transaction();

    try {
        const existingBooking = await db.Booking.findOne({ where: { id: booking } });
        const existingEmployee = await db.Employee.findOne({ where: { id: employee } });

        if (!services)
        {
            services = []
        }
        if (!existingBooking) {
            return res.status(400).json(responseHelper(400, "Đặt phòng không tồn tại", false, []));
        }

        if (!existingEmployee) {
            return res.status(400).json(responseHelper(400, "Nhân viên không tồn tại", false, []));
        }

        // Tính tổng tiền dịch vụ sau khi thêm vào
        let serviceTotal = 0;

        for (const service of services) {

            const existingService = await db.Service.findOne({ where: { id: service.id } });
            if (!existingService) {
                await transaction.rollback();
                return res.status(400).json(responseHelper(400, `Dịch vụ với ID ${service.id} không tồn tại`, false, []));
            }

            // Thêm dịch vụ vào ServiceOfBooking
            await db.ServiceOfBooking.create(
                {
                    booking,
                    service: service.id,
                },
                { transaction }
            );

            // Cộng tiền dịch vụ vào tổng tiền
            serviceTotal += Number(existingService.amount);
        }

        // Cập nhật trường total của bảng Booking
        existingBooking.total = Number(existingBooking.total) + Number(serviceTotal);
        await existingBooking.save({ transaction });

        const checkOut = await db.CheckOut.create({
            booking,
            date: checkOutDate,
            status: status || "checkedOut",
            description: description || "",
            employee,
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
