exports.dbName = "clicon"
exports.ALLOWED_SORT_FIELDS = [
    "createdAt",
    "updatedAt",
    "price",
    "sold",
    "quantity",
    "name",
    "rating"
]
exports.DEFAULT = {
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    order: "desc",
    maxSearchLength: 100,
    maxLimit: 30
}