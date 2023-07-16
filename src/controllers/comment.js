import db from "../models"
import { responseHelper } from "../helpers/response"

export const createReview = async (req, res) => {
    let { customer, rating, comment } = req.body;

    // Check for empty fields
    if (!customer || !rating || !comment) {
        return res.status(400).json(responseHelper(400, "Dữ liệu nhập vào bị thiếu", false, {}));
    }

    try {
        const existingCustomer = await db.Customer.findOne({ where: { id: customer } });

        if (!existingCustomer) {
            return res.status(400).json(responseHelper(400, "Khách hàng không tồn tại", false, {}));
        }

        const review = await db.Review.create({
            customer,
            rating,
            comment
        });

        return res.status(201).json(responseHelper(201, "Thêm đánh giá thành công", true, review));
    } catch (error) {
        return res.status(500).json(responseHelper(500, "Thêm đánh giá không thành công", false, {}));
    }
};


export const deleteReview = async (req, res) => {
    const { id } = req.params;

    try {
        const review = await db.Review.findOne({ where: { id } });

        if (!review) {
            return res.status(404).json(responseHelper(404, "Không tìm thấy đánh giá", false, {}));
        }

        await db.Review.destroy({ where: { id } });

        return res.status(200).json(responseHelper(200, "Xóa đánh giá thành công", true, {}));
    } catch (error) {
        return res.status(500).json(responseHelper(500, "Xóa đánh giá không thành công", false, {}));
    }
};


export const updateReview = async (req, res) => {
    const { id } = req.params;
    const { customer, rating, comment } = req.body;

    try {
        const review = await db.Review.findOne({ where: { id } });

        if (!review) {
            return res.status(404).json(responseHelper(404, "Không tìm thấy đánh giá", false, {}));
        }

        await db.Review.update(
            { customer, rating, comment },
            { where: { id } }
        );

        return res.status(200).json(responseHelper(200, "Cập nhật đánh giá thành công", true, {}));
    } catch (error) {
        return res.status(500).json(responseHelper(500, "Cập nhật đánh giá không thành công", false, {}));
    }
};


export const getAllReviews = async (req, res) => {
    try {
        const reviews = await db.Review.findAll();

        return res.status(200).json(responseHelper(200, "Lấy danh sách đánh giá thành công", true, reviews));
    } catch (error) {
        return res.status(500).json(responseHelper(500, "Lỗi khi lấy danh sách đánh giá", false, {}));
    }
};

export const calculateAverageRating = async (req, res) => {
    try {
        const ratings = await db.Review.findAll({
            attributes: [[db.sequelize.fn('AVG', db.sequelize.col('rating')), 'averageRating']],
        });

        if (!ratings || ratings.length === 0 || !ratings[0].dataValues.averageRating) {
            return res.status(200).json(responseHelper(200, "Không có đánh giá để tính toán", true, 10));
        }

        var averageRating = ratings[0].dataValues.averageRating * 2;

        if(averageRating==0)
        {
            averageRating = 10
        }
        return res.status(200).json(responseHelper(200, "Tính toán trung bình đánh giá thành công", true, averageRating));
    } catch (error) {
        return res.status(500).json(responseHelper(500, "Lỗi khi tính toán trung bình đánh giá", false, {}));
    }
};