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



// export const createBooking = async (req, res) => {
//     let {
//         customer,
//         room,
//         checkInDate,
//         checkOutDate,
//         status,
//         employee,
//         paymentAmount,
//         paymentMethod,
//         services
//     } = req.body;

//     let transporter = nodemailer.createTransport({
//         host: "smtp.gmail.com",
//         port: 587,
//         secure: false, // true for 465, false for other ports
//         auth: {
//             user: "phamminhquan12c1@gmail.com", // generated ethereal user
//             pass: process.env.APP_PASS_MAIL // generated ethereal password
//         }
//     })

//     const transaction = await db.sequelize.transaction();

//     try {
//         if (!employee) {
//             employee = null;
//         }
//         if (!status) {
//             status = "spending";
//         }
//         if (!checkInDate || !checkOutDate) {
//             return res.status(400).json(responseHelper(400, "Ngày check in hoặc check out không được để trống", false, []));
//         }

//         if (!services)
//         {
//             services = [];
//         }


//         const existingCustomer = await db.Customer.findOne({ where: { id: customer } });
//         const existingRoom = await db.Room.findOne({ where: { id: room } });
//         const existingBooking = await db.Booking.findOne({ where: { room, checkInDate, checkOutDate } });

//         if (!existingCustomer) {
//             return res.status(400).json(responseHelper(400, "Khách hàng không tồn tại", false, []));
//         }

//         if (!existingRoom) {
//             return res.status(400).json(responseHelper(400, "Phòng không tồn tại", false, []));
//         }

//         if (existingBooking) {
//             return res.status(400).json(responseHelper(400, "Đặt phòng không hợp lệ", false, []));
//         }

//         // Tính toán tổng tiền dựa trên giá phòng và số ngày đặt phòng
//         const pricePerNight = existingRoom.price;
//         const numberOfNights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
//         const total = pricePerNight * numberOfNights;

//         const booking = await db.Booking.create({
//             customer,
//             room,
//             checkInDate,
//             checkOutDate,
//             status,
//             total,
//             employee
//         }, { transaction });

//         // Tạo thanh toán cho đặt phòng
//         const payment = await db.Payment.create({
//             booking: booking.id,
//             paymentAmount: paymentAmount || 0,
//             paymentDate: new Date(),
//             employee,
//             paymentMethod: paymentMethod || "Chuyển khoản"
//         }, { transaction });

//         await transaction.commit();
//         try {
//             //  await sgMail.send(mailConfig("lebaonhi12c!@gmail.com", email, "XÁC NHẬN ĐẶT PHÒNG TẠI Q&N HOTEL", "ĐẶT PHÒNG THÀNH CÔNG"))
//             await transporter.sendMail(mailConfig(existingCustomer.email, "phamminhquan12c1@gmail.com", "XÁC NHẬN ĐẶT PHÒNG TẠI Q&N HOTEL", "ĐẶT PHÒNG THÀNH CÔNG"))
//         }
//         catch (error) {
//             return res.status(200).json(responseHelper(200, `Đặt phòng thành công.`, true, { booking, payment }));
//         }

//         return res.status(200).json(responseHelper(200, `Đặt phòng thành công, chúng tôi đã mail đến địa chỉ ${existingCustomer.email}`, true, { booking, payment }));
//     }
//     catch (error) {
//         await transaction.rollback();
//         return res.status(500).json(responseHelper(500, "Đặt phòng không thành công", false, []));
//     }
// };


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

        await transaction.commit();

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
                    existingCustomer.email,
                    "phamminhquan12c1@gmail.com",
                    "XÁC NHẬN ĐẶT PHÒNG TẠI Q&N HOTEL",
                    "ĐẶT PHÒNG THÀNH CÔNG"
                )
            );
        } catch (error) {
            return res
                .status(200)
                .json(responseHelper(200, `Đặt phòng thành công.`, true, { booking, payment }));
        }

        return res
            .status(200)
            .json(
                responseHelper(
                    200,
                    `Đặt phòng thành công, chúng tôi đã mail đến địa chỉ ${existingCustomer.email}`,
                    true,
                    { booking, payment }
                )
            );
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
    let { status } = req.body;

    try {
        const booking = await db.Booking.findOne({ where: { id } });

        if (!booking) {
            return res.status(404).json(responseHelper(404, "Không tìm thấy booking", false, {}));
        }

        if (!status) {
            status = "confirmed"
        }

        booking.status = status;
        await booking.save();

        return res.status(200).json(responseHelper(200, "Cập nhật trạng thái thành công", true, booking));
    } catch (error) {
        return res.status(500).json(responseHelper(500, "Cập nhật trạng thái không thành công", false, []));
    }
};


export const getTodayBookings = async (req, res) => {
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0); // Đặt thời gian về 00:00:00

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999); // Đặt thời gian về 23:59:59.999

    try {
        const bookings = await db.Booking.findAll({
            where: {
                checkInDate: {
                    [db.Sequelize.Op.between]: [startOfDay, endOfDay], // Sử dụng phạm vi thời gian
                },
                status: { [db.Sequelize.Op.notIn]: ["cancelled", "spending"] },
            },
            include: [
                {
                    model: db.Employee, // Lấy thông tin nhân viên
                    attributes: ['id', 'name', 'email'] // Chỉ lấy các trường id, name, email của nhân viên
                },
                {
                    model: db.Customer, // Lấy thông tin khách hàng
                    attributes: ['id', 'name', 'email'] // Chỉ lấy các trường id, name, email của khách hàng
                }
            ],
        });

        return res.status(200).json(responseHelper(200, "Danh sách booking hôm nay", true, bookings));
    } catch (error) {
        return res.status(500).json(responseHelper(500, "Lỗi khi lấy danh sách booking hôm nay", false, []));
    }
};