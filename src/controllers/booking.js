import db from "../models/index.js"
import { responseHelper } from "../helpers/response.js"
import nodemailer from "nodemailer"
const mailConfig = (to, from, subject, text,) => {
    return {
        to: to,
        from: from, // Use the email address or domain you verified above
        subject: subject,
        text: text,
        html: '<strong>Cám ơn bạn đã tin tưởng và sử dụng dịch vụ tại Q&N HOTEL</strong>',
    }
}


export const createBooking = async (req, res) => {
    let {
        customer,
        room,
        checkInDate,
        checkOutDate,
        status,
        employee,
        paymentAmount,
        paymentMethod,
        services
    } = req.body;

    const transaction = await db.sequelize.transaction();

    try {
        if (!employee) {
            employee = null;
        }
        if (!status) {
            status = "spending";
        }
        if (!checkInDate || !checkOutDate) {
            return res
                .status(400)
                .json(
                    responseHelper(
                        400,
                        "Ngày check in hoặc check out không được để trống",
                        false,
                        []
                    )
                );
        }

        if (!services) {
            services = [];
        }

        const existingCustomer = await db.Customer.findOne({
            where: { id: customer },
        });
        const existingRoom = await db.Room.findOne({ where: { id: room } });
        const existingBooking = await db.Booking.findOne({
            where: { room, checkInDate, checkOutDate },
        });

        if (!existingCustomer) {
            return res
                .status(400)
                .json(responseHelper(400, "Khách hàng không tồn tại", false, []));
        }

        if (!existingRoom) {
            return res
                .status(400)
                .json(responseHelper(400, "Phòng không tồn tại", false, []));
        }

        if (existingBooking) {
            return res
                .status(400)
                .json(responseHelper(400, "Đặt phòng không hợp lệ", false, []));
        }

        // Chuyển đổi giá trị checkInDate và checkOutDate sang kiểu dữ liệu Date
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);

        // Tính toán tổng số ngày đặt phòng
        const timeDiff = Math.abs(checkOut.getTime() - checkIn.getTime());
        const numberOfNights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        // Tính toán tổng tiền dựa trên giá phòng và số ngày đặt phòng
        const pricePerNight = existingRoom.price;
        const total = pricePerNight * numberOfNights;

        let serviceTotal = 0;
        for (const service of services) {
            const serviceData = await db.Service.findByPk(service.id);
            if (serviceData) {
                const servicePrice = serviceData.amount;
                serviceTotal += Number(servicePrice);
            }
        }

        const booking = await db.Booking.create(
            {
                customer,
                room,
                checkInDate: checkIn,
                checkOutDate: checkOut,
                status,
                total: total + serviceTotal,
                employee,
            },
            { transaction }
        );

        // Tạo danh sách các dịch vụ đi kèm
        for (const service of services) {
            await db.ServiceOfBooking.create(
                {
                    booking: booking.id,
                    service: service.id,
                },
                { transaction }
            );
        }

        // Tạo thanh toán cho đặt phòng
        const payment = await db.Payment.create(
            {
                booking: booking.id,
                paymentAmount: paymentAmount || 0,
                paymentDate: new Date(),
                employee,
                paymentMethod: paymentMethod || "Chuyển khoản",
            },
            { transaction }
        );
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "phamminhquan12c1@gmail.com",
                pass: process.env.APP_PASS_MAIL
            }
        });

        let mailContent = {
            to: existingCustomer.email,
            from: "phamminhquan12c1@gmail.com",
            subject: "XÁC NHẬN ĐẶT PHÒNG TẠI Q&N HOTEL",
            text: "Đặt phòng thành công"
        };

        try {
            await transporter.sendMail(mailContent);
        } catch (error) {
            return res
                .status(200)
                .json(responseHelper(200, `Đặt phòng thành công.`, true, { booking, payment }));
        }

        // Kiểm tra nếu status là "checkedIn", thêm checkin mới
        if (status === "checkedIn") {
            try {
                const existingEmployee = await db.Employee.findOne({ where: { id: employee } });

                if (!existingEmployee) {
                    return res.status(400).json(responseHelper(400, "Nhân viên không tồn tại", false, []));
                }

                const currentDate = new Date();
                const checkInDate = currentDate.toISOString();

                const checkIn = await db.CheckIn.create({
                    booking: booking.id,
                    date: checkInDate,
                    status: "checkedIn",
                    description: "Checked in",
                    employee,
                }, { transaction });

                // Cập nhật trạng thái của booking thành "checkedIn"
                booking.status = "checkedIn";
                await booking.save({ transaction });

                await transaction.commit();

                return res.status(200).json(responseHelper(200, "Đặt phòng và check-in thành công", true, { booking, payment, checkIn }));
            } catch (error) {
                await transaction.rollback();
                return res.status(500).json(responseHelper(500, "Đặt phòng và check-in không thành công", false, []));
            }
        } else {
            // Nếu status không phải "checkedIn", commit transaction và trả về kết quả đặt phòng
            await transaction.commit();
            return res.status(200).json(responseHelper(200, "Đặt phòng thành công", true, { booking, payment }));
        }
    } catch (error) {
        await transaction.rollback();
        return res
            .status(500)
            .json(responseHelper(500, "Đặt phòng không thành công", false, []));
    }
};


export const getBookingList = async (req, res) => {
    try {
        const bookings = await db.Booking.findAll({
            include: [
                {
                    model: db.Customer,
                    attributes: ['id', 'name', 'email', 'phone'],
                },
                {
                    model: db.Room,
                    attributes: ['id', 'code'],
                },
            ],
        });

        return res.status(200).json(responseHelper(200, 'Danh sách booking', true, bookings));
    } catch (error) {
        console.log(error);
        return res.status(500).json(responseHelper(500, 'Lỗi khi lấy danh sách booking', false, {}));
    }
};
export const updateBookingStatus = async (req, res) => {
    const { id } = req.params;
    let { status, employee } = req.body;

    const transaction = await db.sequelize.transaction();

    if(!employee) {
        employee=null
    }
    try {
        const booking = await db.Booking.findOne({
            where: { id },
            include: [
                {
                    model: db.Customer,
                    attributes: ['email'],
                },
            ],
        });

        let title = "CÁM ƠN BẠN ĐÃ SỬ DỤNG DỊCH VỤ CỦA Q&N HOTEL";
        let message = "Cám ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi";

        if (!booking) {
            return res.status(404).json(responseHelper(404, "Không tìm thấy booking", false, {}));
        }

        if (!status) {
            title = "XÁC NHẬN ĐƠN ĐẶT PHÒNG ĐÃ ĐƯỢC XÁC NHẬN Q&N HOTEL";
            status = "confirmed";
            message = "Chúng tôi đã xác nhận đơn đặt phòng của bạn, cám ơn bạn đã sử dụng dịch vụ của chúng tôi.";
        }

        if (status != "cancelled" && status != "confirmed" && status != "requestCancel") {
            return res.status(400).json(responseHelper(400, "Trạng thái không hợp lệ", false, {}));
        }
        if (status === "cancelled") {
            title = "XÁC NHẬN HỦY ĐƠN ĐẶT PHÒNG TẠI Q&N HOTEL";
            status = "cancelled";
            message = "Chúng tôi đã hủy đơn đặt phòng của bạn, cám ơn bạn đã sử dụng dịch vụ của chúng tôi.";
        }

        if (status === "requestCancel")
        {
            title = "XÁC NHẬN CỦA Q&N HOTEL";
            status = "requestCancel";
            message = "Chúng tôi nhận được yêu cầu hủy đơn đặt phòng của bạn, chúng tôi sẽ phản hồi sớm nhất. Cám ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi.";
        }

        booking.status = status;
        booking.employee = employee

        await booking.save({ transaction });
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: "phamminhquan12c1@gmail.com", // generated ethereal user
                pass: process.env.APP_PASS_MAIL // generated ethereal password
            }
        })

        try {
            await transporter.sendMail(
                mailConfig(
                    booking.Customer.email,
                    "phamminhquan12c1@gmail.com",
                    title,
                    message
                )
            );
        } catch (error) {
            console.log(error)
            await transaction.rollback();
            return res.status(400).json(responseHelper(200, "Cập nhật trạng thái không thành công", true, {}));
        }

        await transaction.commit();

        return res.status(200).json(responseHelper(200, "Cập nhật trạng thái thành công", true, booking));
    } catch (error) {
        await transaction.rollback();
        return res.status(500).json(responseHelper(500, "Cập nhật trạng thái không thành công", false, []));
    }
};



export const getTodayBookings = async (req, res) => {
    const { status, phone } = req.query;

    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0); // Đặt thời gian về 00:00:00

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999); // Đặt thời gian về 23:59:59.999

    let whereCondition = {
        [db.Sequelize.Op.and]: [
            { checkInDate: { [db.Sequelize.Op.lte]: endOfDay } }, // Ngày check-in phải nhỏ hơn hoặc bằng endOfDay
            { checkOutDate: { [db.Sequelize.Op.gte]: startOfDay } }, // Ngày check-out phải lớn hơn hoặc bằng startOfDay
        ],
    };

    if (status) {
        whereCondition = {
            ...whereCondition,
            [db.Sequelize.Op.or]: [
                { status: { [db.Sequelize.Op.notIn]: ["cancelled", "spending"] } },
                { status },
            ],
        };
    } else {
        whereCondition = {
            ...whereCondition,
            status: { [db.Sequelize.Op.notIn]: ["cancelled", "spending"] },
        };
    }

    if (phone) {
        whereCondition = {
            ...whereCondition,
            "$Customer.phone$": phone,
        };
    }

    try {
        const bookings = await db.Booking.findAll({
            where: whereCondition,
            include: [
                {
                    model: db.Employee,
                    attributes: ['id', 'name', 'email'],
                },
                {
                    model: db.Customer,
                    attributes: ['id', 'name', 'email'],
                    where: phone ? { phone } : {},
                },
                {
                    model: db.CheckIn,
                    attributes: ['date'],
                },
                {
                    model: db.CheckOut,
                    attributes: ['date'],
                },
            ],
        });

        return res.status(200).json(responseHelper(200, "Danh sách booking hôm nay", true, bookings));
    } catch (error) {
        console.log(error);
        return res.status(500).json(responseHelper(500, "Lỗi khi lấy danh sách booking hôm nay", false, []));
    }
};


export const getCustomerBookings = async (req, res) => {
    const { id } = req.params;

    try {
        const customer = await db.Customer.findOne({ where: { id } });

        if (!customer) {
            return res.status(404).json(responseHelper(404, "Khách hàng không tồn tại", false, {}));
        }

        const bookings = await db.Booking.findAll({
            where: { customer: id },
            include: [
                {
                    model: db.Employee,
                    attributes: ['id', 'name', 'email'],
                },
                {
                    model: db.Room,
                    attributes: ['id', 'name'],
                    include: [
                        {
                            model: db.ImageRoom,
                            attributes: ['value'],
                        },
                    ],
                },
                {
                    model: db.CheckIn,
                    attributes: ['date'],
                },
                {
                    model: db.CheckOut,
                    attributes: ['date'],
                },
                {
                    model: db.Payment,
                    attributes: [[db.sequelize.fn('SUM', db.sequelize.col('paymentAmount')), 'totalPayment']],
                },
            ],
            group: ['Booking.id', 'Employee.id', 'Room.id'],
        });

        return res.status(200).json(responseHelper(200, "Danh sách đơn đặt phòng của khách hàng", true, bookings));
    } catch (error) {
        console.log(error);
        return res.status(500).json(responseHelper(500, "Lỗi khi lấy danh sách đơn đặt phòng của khách hàng", false, []));
    }
};

export const getBookingDetails = async (req, res) => {
    const { id } = req.params;

    try {
        const booking = await db.Booking.findOne({
            where: { id },
            include: [
                {
                    model: db.Customer,
                    attributes: ['id', 'name', 'email', 'phone'],
                },
                {
                    model: db.Room,
                    attributes: ['id', 'name', "code", 'price'],
                },
                {
                    model: db.Employee,
                    attributes: ['id', 'name', 'email'],
                },
                {
                    model: db.CheckIn,
                    attributes: ['date', 'status', 'description'],
                },
                {
                    model: db.CheckOut,
                    attributes: ['date', 'status', 'description'],
                },
                {
                    model: db.Payment,
                    attributes: ['id', 'paymentAmount', 'paymentDate', 'paymentMethod'],
                },
                {
                    model: db.ServiceOfBooking,
                    include: {
                        model: db.Service,
                        attributes: ['id', 'name', 'amount'],
                    },
                },
            ],
        });

        if (!booking) {
            return res.status(404).json(responseHelper(404, "Không tìm thấy đơn đặt phòng", false, {}));
        }

        return res.status(200).json(responseHelper(200, "Thông tin chi tiết đơn đặt phòng", true, booking));
    } catch (error) {
        console.log(error);
        return res.status(500).json(responseHelper(500, "Lỗi khi lấy thông tin chi tiết đơn đặt phòng", false, []));
    }
};
