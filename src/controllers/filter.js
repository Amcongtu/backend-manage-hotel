import db from "../models";
import { Op } from "sequelize";
import { responseHelper } from "../helpers/response";

// export const filterRooms = async (req, res) => {
//     let { startDate, endDate, adult, child } = req.query;

//     // Kiểm tra và gán giá trị mặc định cho startDate và endDate nếu không được truyền vào
//     if (!startDate) {
//         startDate = new Date();
//     }
//     if (!endDate) {
//         const nextDay = new Date(startDate);
//         nextDay.setDate(nextDay.getDate() + 1);
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
            attributes: ['room']
        });

        const bookedRoomIds = bookings.map((booking) => booking.room);

        if (!totalAdults) {
            totalAdults = 1;
        }

        const rooms = await db.Room.findAll({
            where: {
                id: { [Op.notIn]: bookedRoomIds },
                status: 'published',
                capacity: { [Op.gte]: totalAdults }
            },
            include: [
                {
                    model: db.ImageRoom,
                    attributes: ['value']
                }
            ]
        });

        const result = [];

        for (const room of rooms) {
            const { roomType, ...roomData } = room.dataValues;
            const roomTypeData = await db.RoomType.findOne(
                { 
                    where: { id: roomType }, 
                    attributes: ['code', 'name', 'description', 'capacity', 'area', 'status', 'employee', 'priceBegin'] ,
                    include: [
                        {
                            model: db.ImageRoomType,
                            attributes: ['value']
                        }
                    ]
                });

            result.push({
                ...roomTypeData.dataValues,
                rooms: [roomData]
            });
        }

        return res.status(200).json(responseHelper(200, 'Danh sách phòng đã được lọc thành công', true, result));
    } catch (error) {
        console.log(error);
        return res.status(500).json(responseHelper(500, 'Lỗi khi lọc danh sách phòng', false, {}));
    }
};
