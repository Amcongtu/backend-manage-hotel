import db from "../models";
import { Op } from "sequelize";
import { responseHelper } from "../helpers/response";
import moment from "moment"
// export const filterRooms = async (req, res) => {
//     let { startDate, endDate, adult, child } = req.query;

//     // Kiểm tra và gán giá trị mặc định cho startDate và endDate nếu không được truyền vào
//     if (!startDate) {
//         startDate = new Date();
//     }
//     if (!endDate) {
//         const nextDay = new Date(startDate);
//         nextDay.smoment
//         endDate = nextDay;
//     }

//     if (!adult) {
//         adult = 1
//     }

//     if (!child) {
//         adult = 1
//     }

//     try {
//         let totalAdults = adult;

//         if (Array.isArray(child)) {
//             child.forEach((childObj) => {
//                 if (childObj.old >= 12) {
//                     totalAdults += childObj.number;
//                 }
//             });
//         }

//         const bookings = await db.Booking.findAll({
//             where: {
//                 [Op.or]: [
//                     {
//                         checkInDate: {
//                             [Op.between]: [startDate, endDate]
//                         }
//                     },
//                     {
//                         checkOutDate: {
//                             [Op.between]: [startDate, endDate]
//                         }
//                     },
//                     {
//                         checkInDate: {
//                             [Op.lte]: startDate
//                         },
//                         checkOutDate: {
//                             [Op.gte]: endDate
//                         }
//                     }
//                 ]
//             },
//             attributes: ['room']
//         });

//         const bookedRoomIds = bookings.map((booking) => booking.room);

//         const availableRooms = await db.Room.findAll({
//             where: {
//                 id: { [Op.notIn]: bookedRoomIds },
//                 status: 'available',
//                 capacity: { [Op.gte]: totalAdults }
//             }
//         });

//         return res.status(200).json(responseHelper(200, "Danh sách phòng đã được lọc thành công", true, availableRooms));
//     } catch (error) {
//         return res.status(500).json(responseHelper(500, "Lỗi khi lọc danh sách phòng", false, {}));
//     }
// };
export const filterRooms = async (req, res) => {
    let { startDate, endDate, adult, child } = req.query;

    // Kiểm tra và gán giá trị mặc định cho startDate và endDate nếu không được truyền vào
    if (!startDate) {
        startDate = new Date();
    }
    if (!endDate) {
        const nextDay = new Date(startDate);
        nextDay.setDate(nextDay.getDate() + 1);
        endDate = nextDay;
    }

    try {
        let totalAdults = adult;

        if (Array.isArray(child)) {
            child.forEach((childObj) => {
                if (childObj.old >= 12) {
                    totalAdults += 1;
                }
            });
        }

        const bookings = await db.Booking.findAll({
            where: {
                [Op.or]: [
                    {
                        checkInDate: {
                            [Op.between]: [startDate, endDate],
                        },
                    },
                    {
                        checkOutDate: {
                            [Op.between]: [startDate, endDate],
                        },
                    },
                    {
                        checkInDate: {
                            [Op.lte]: startDate,
                        },
                        checkOutDate: {
                            [Op.gte]: endDate,
                        },
                    },
                ],
            },
            attributes: ['room'],
        });

        const bookedRoomIds = bookings.map((booking) => booking.room);

        if (!totalAdults) {
            totalAdults = 1;
        }

        const rooms = await db.Room.findAll({
            where: {
                id: { [Op.notIn]: bookedRoomIds },
                status: 'published',
                capacity: { [Op.gte]: totalAdults },
            },
            include: [
                {
                    model: db.ImageRoom,
                    attributes: ['value'],
                },
            ],
        });

        const roomTypeMap = new Map();

        for (const room of rooms) {
            const { roomType, ...roomData } = room.dataValues;
            const roomTypeData = await db.RoomType.findOne({
                where: { id: roomType },
                attributes: ['code', 'name', 'description', 'capacity', 'area', 'status', 'employee', 'priceBegin'],
                include: [
                    {
                        model: db.ImageRoomType,
                        attributes: ['value'],
                    },
                ],
            });

            if (!roomTypeMap.has(roomType)) {
                roomTypeMap.set(roomType, {
                    ...roomTypeData.dataValues,
                    rooms: [roomData],
                });
            } else {
                roomTypeMap.get(roomType).rooms.push(roomData);
            }
        }

        const result = [...roomTypeMap.values()];

        return res.status(200).json(responseHelper(200, 'Danh sách phòng đã được lọc thành công', true, result));
    } catch (error) {
        console.log(error);
        return res.status(500).json(responseHelper(500, 'Lỗi khi lọc danh sách phòng', false, {}));
    }
}

export const checkAvailability = async (req, res) => {
    const { startDate, endDate, id } = req.query;

    // Kiểm tra giá trị bắt buộc
    if (!startDate || !endDate || !id) {
        return res.status(400).json(responseHelper(400, 'Ngày bắt đầu, ngày kết thúc và ID phòng là bắt buộc', false, {}));
    }

    // Kiểm tra định dạng ngày
    const isValidStartDate = moment(startDate, 'YYYY-MM-DD', true).isValid();
    const isValidEndDate = moment(endDate, 'YYYY-MM-DD', true).isValid();

    if (!isValidStartDate || !isValidEndDate) {
        return res.status(400).json(responseHelper(400, 'Ngày bắt đầu hoặc ngày kết thúc không hợp lệ', false, {}));
    }

    try {
        const room = await db.Room.findOne({
            where: { id: id },
            include: [{
                model: db.Booking,
                where: {
                    [Op.or]: [
                        {
                            checkInDate: {
                                [Op.between]: [startDate, endDate]
                            }
                        },
                        {
                            checkOutDate: {
                                [Op.between]: [startDate, endDate]
                            }
                        },
                        {
                            checkInDate: {
                                [Op.lte]: startDate
                            },
                            checkOutDate: {
                                [Op.gte]: endDate
                            }
                        }
                    ]
                },
                attributes: []
            }]
        });

        if (!room) {
            return res.status(200).json(responseHelper(200, 'Phòng có sẵn', false, true));
        }

        return res.status(200).json(responseHelper(200, 'Phòng không có sẵn', true, false));
    } catch (error) {
        console.log(error);
        return res.status(500).json(responseHelper(500, 'Lỗi khi kiểm tra tình trạng phòng', false, {}));
    }
};
