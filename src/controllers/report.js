import db from "../models/index.js"
import { responseHelper } from "../helpers/response.js"
import { Op } from "sequelize"
import moment from "moment";

export const getStatistics = async (req, res) => {
    try {
        // Thống kê số lượng phòng
        const totalRooms = await db.Room.count();
        const totalPublishedRooms = await db.Room.count({ where: { status: 'published' } });

        // Thống kê số lượng loại phòng
        const totalRoomTypes = await db.RoomType.count();
        const totalPublishedRoomTypes = await db.RoomType.count({ where: { status: 'published' } });

        // Thống kê số lượng dịch vụ
        const totalServices = await db.Service.count();
        const totalPublishedServices = await db.Service.count({ where: { status: 'published' } });

        // Thống kê số lượng nhân viên
        const totalEmployees = await db.Employee.count();
        const totalActiveEmployees = await db.Employee.count({ where: { status: 'active' } });

        // Kết hợp kết quả thành một object
        const result = {
            room: {
                total: totalRooms,
                roomPublish: totalPublishedRooms,
            },
            roomType: {
                total: totalRoomTypes,
                roomTypePublish: totalPublishedRoomTypes,
            },
            service: {
                total: totalServices,
                servicePublish: totalPublishedServices,
            },
            employee: {
                total: totalEmployees,
                activeEmployees: totalActiveEmployees,
            },
        };

        return res.status(200).json(responseHelper(200, 'Thống kê', true, result));
    } catch (error) {
        console.log(error);
        return res.status(500).json(responseHelper(500, 'Lỗi khi thực hiện thống kê', false, {}));
    }
};





export const getRoomTypeBookingPercentage = async (req, res) => {
    const { dimension } = req.body;

    try {
        let startDate, endDate;

        switch (dimension) {
            case "week":
                startDate = moment().startOf("isoWeek");
                endDate = moment();
                break;
            case "month":
                startDate = moment().startOf("month");
                endDate = moment();
                break;
            case "quarter":
                startDate = moment().startOf("quarter");
                endDate = moment();
                break;
            case "year":
                startDate = moment().startOf("year");
                endDate = moment();
                break;
            default:
                return res.status(400).json(responseHelper(400, "Giá trị 'dimension' không hợp lệ", false, {}));
        }

        // Thực hiện truy vấn dữ liệu để lấy số lượng đặt phòng của từng loại phòng trong khoảng thời gian tương ứng
        const roomTypeBookings = await db.Booking.findAll({
            attributes: [[db.sequelize.col("Room.roomType"), "roomTypeId"], [db.sequelize.fn("COUNT", "Room.roomType"), "bookingCount"]],
            where: {
                checkInDate: { [Op.between]: [startDate.toDate(), endDate.toDate()] },
            },
            include: [
                {
                    model: db.Room,
                    attributes: ["roomType"], // Lấy trường roomType từ bảng Room
                },
            ],
            group: [db.sequelize.col("Room.roomType")], // Gom nhóm theo trường roomType
        });

        // Tính tổng số đặt phòng
        const totalBookings = roomTypeBookings.reduce((total, booking) => total + booking.dataValues.bookingCount, 0);

        // Tính tỷ lệ phần trăm đặt phòng của từng loại phòng và lấy tên của loại phòng (roomType)
        const roomTypePercentage = await Promise.all(roomTypeBookings.map(async (booking) => {
            const roomTypeId = booking.dataValues.roomTypeId;
            const roomTypeName = await db.RoomType.findOne({
                where: { id: roomTypeId },
                attributes: ["name"],
            });

            return {
                roomType: roomTypeId,
                roomTypeName: roomTypeName.name,
                percentage: (booking.dataValues.bookingCount / totalBookings) * 100,
            };
        }));

        return res
            .status(200)
            .json(responseHelper(200, "Thống kê phần trăm đặt phòng theo loại phòng", true, roomTypePercentage));
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json(responseHelper(500, "Lỗi khi thực hiện thống kê", false, {}));
    }
};

export const getPaymentStatistics = async (req, res) => {
    const { dimension } = req.body;

    try {
        let startDate, endDate;

        switch (dimension) {
            case "week":
                startDate = moment().startOf("isoWeek");
                endDate = moment();
                break;
            case "month":
                startDate = moment().startOf("month");
                endDate = moment();
                break;
            case "quarter":
                startDate = moment().startOf("quarter");
                endDate = moment();
                break;
            case "year":
                startDate = moment().startOf("year");
                endDate = moment();
                break;
            default:
                return res.status(400).json(responseHelper(400, "Giá trị 'dimension' không hợp lệ", false, {}));
        }

        // Thực hiện truy vấn dữ liệu để lấy tổng số tiền thanh toán của từng loại phòng trong khoảng thời gian tương ứng
        const paymentStatistics = await db.Payment.findAll({
            attributes: [
                [db.sequelize.col("Booking.Room.roomType"), "roomTypeId"],
                [db.sequelize.fn("SUM", db.sequelize.col("paymentAmount")), "totalPayment"],
            ],
            include: [
                {
                    model: db.Booking,
                    attributes: [],
                    where: {
                        checkInDate: { [Op.between]: [startDate.toDate(), endDate.toDate()] },
                    },
                    include: [
                        {
                            model: db.Room,
                            attributes: ["roomType"],
                        },
                    ],
                },
            ],
            group: [db.sequelize.col("Booking.Room.roomType")], // Gom nhóm theo trường roomType
        });

        // Tính tổng số tiền thanh toán
        const totalPayment = paymentStatistics.reduce((total, payment) => total + payment.dataValues.totalPayment, 0);

        // Tính tỷ lệ phần trăm thanh toán của từng loại phòng và lấy tên của loại phòng (roomType)
        const paymentPercentage = await Promise.all(paymentStatistics.map(async (payment) => {
            const roomTypeId = payment.dataValues.roomTypeId;
            const roomTypeName = await db.RoomType.findOne({
                where: { id: roomTypeId },
                attributes: ["name"],
            });

            return {
                roomType: roomTypeId,
                roomTypeName: roomTypeName.name,
                percentage: (payment.dataValues.totalPayment / totalPayment) * 100,
            };
        }));

        return res
            .status(200)
            .json(responseHelper(200, "Thống kê phần trăm thanh toán theo loại phòng", true, paymentPercentage));
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json(responseHelper(500, "Lỗi khi thực hiện thống kê", false, {}));
    }
};


export const getTotalPaymentByDimension = async (req, res) => {
    const { dimension } = req.body;

    try {
        let startDate, endDate;

        switch (dimension) {
            case "week":
                startDate = moment().startOf("isoWeek");
                endDate = moment();
                break;
            case "month":
                startDate = moment().startOf("month");
                endDate = moment();
                break;
            case "quarter":
                startDate = moment().startOf("quarter");
                endDate = moment();
                break;
            case "year":
                startDate = moment().startOf("year");
                endDate = moment();
                break;
            default:
                return res.status(400).json(responseHelper(400, "Giá trị 'dimension' không hợp lệ", false, {}));
        }

        // Thực hiện truy vấn dữ liệu để lấy tổng số tiền thanh toán trong khoảng thời gian tương ứng
        const totalPayment = await db.Payment.sum("paymentAmount", {
            where: {
                paymentDate: { [Op.between]: [startDate.toDate(), endDate.toDate()] },
            },
        });

        return res.status(200).json(responseHelper(200, `Tổng số tiền thanh toán trong ${dimension}`, true, { totalPayment }));
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json(responseHelper(500, "Lỗi khi thực hiện thống kê", false, {}));
    }
};

export const getTotalBookingsByDimension = async (req, res) => {
    const { dimension } = req.body;

    try {
        let startDate, endDate;

        switch (dimension) {
            case "week":
                startDate = moment().startOf("isoWeek");
                endDate = moment();
                break;
            case "month":
                startDate = moment().startOf("month");
                endDate = moment();
                break;
            case "quarter":
                startDate = moment().startOf("quarter");
                endDate = moment();
                break;
            case "year":
                startDate = moment().startOf("year");
                endDate = moment();
                break;
            default:
                return res.status(400).json(responseHelper(400, "Giá trị 'dimension' không hợp lệ", false, {}));
        }

        // Thực hiện truy vấn dữ liệu để lấy số lượng đơn đặt phòng trong khoảng thời gian tương ứng
        const totalBookings = await db.Booking.count({
            where: {
                createdAt: { [Op.between]: [startDate.toDate(), endDate.toDate()] },
            },
        });

        return res.status(200).json(responseHelper(200, `Tổng số đơn đặt phòng trong ${dimension}`, true, { totalBookings }));
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json(responseHelper(500, "Lỗi khi thực hiện thống kê", false, {}));
    }
};

export const getOrdersByDimension = async (req, res) => {
    const { dimension } = req.body;

    try {
        let startDate, endDate;

        switch (dimension) {
            case "week":
                startDate = moment().startOf("isoWeek");
                endDate = moment();
                break;
            case "month":
                startDate = moment().startOf("month");
                endDate = moment();
                break;
            case "quarter":
                startDate = moment().startOf("quarter");
                endDate = moment();
                break;
            case "year":
                startDate = moment().startOf("year");
                endDate = moment();
                break;
            default:
                return res.status(400).json(responseHelper(400, "Giá trị 'dimension' không hợp lệ", false, {}));
        }

        const ordersByDate = await db.Booking.findAll({
            attributes: [
                [db.sequelize.fn("date", db.sequelize.col("createdAt")), "date"],
                [db.sequelize.fn("count", "id"), "data"],
            ],
            where: {
                createdAt: { [db.Sequelize.Op.between]: [startDate.toDate(), endDate.toDate()] },
            },
            group: [db.sequelize.fn("date", db.sequelize.col("createdAt"))],
            order: [[db.sequelize.col("createdAt"), "ASC"]],
        });

        const result = ordersByDate.map((order) => ({
            date: order.dataValues.date,
            data: order.dataValues.data,
        }));

        return res.status(200).json(responseHelper(200, "Thống kê số lượng đơn theo ngày", true, result));
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json(responseHelper(500, "Lỗi khi thực hiện thống kê", false, {}));
    }
};