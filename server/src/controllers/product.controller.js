const customError = require('../utils/customError');
const ProductSchema = require('../models/product.model');
const asyncHandler = require('../helpers/asyncHandler');
const { success } = require('../utils/apiResponse');
const { productValidation, updateValidation } = require('../validators/product.validator');
const { uploadImage } = require('../helpers/claudinary');

exports.createProduct = asyncHandler(async (req, res) => {
    const value = await productValidation(req);
    const images = [];
    if(value.images && value.images.length >0){
        for(const image of value.images){
            const imageURL = uploadImage(image.path);
            images.push({
                url : imageURL.secure_url,
                public_id : imageURL.public_id
            })
        }
    }
    const thumbnailUrl = uploadImage(value.thumbnail.path);
    const product = await ProductSchema.create({
        ...value,
        images,
        thumbnail: {
            url: thumbnailUrl.secure_url,
            public_id: thumbnailUrl.public_id
        }
    });
    if (!product) throw new customError('Product creation failed', 400);
    // now add the prodect _id to the category , subCategory , brand collection
    success(res, 'Product created successfully', product, 201);
})