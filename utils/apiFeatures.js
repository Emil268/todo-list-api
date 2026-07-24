/**
 * Reusable helper class to apply filtering, searching, sorting, and
 * pagination on top of a Mongoose Query object, based on Express
 * request query parameters.
 *
 * Usage:
 *   const features = new ApiFeatures(Todo.find(baseFilter), req.query)
 *     .search(['title', 'description'])
 *     .filter(['status', 'category'])
 *     .sort()
 *     .paginate();
 *
 *   const results = await features.query;
 *   const meta = await features.getMeta();
 */
class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
    this.model = query.model;
    this.baseFilter = {};
  }

  /**
   * Text search across the given fields using case-insensitive regex.
   * Triggered by `?search=keyword`
   */
  search(fields = []) {
    if (this.queryString.search && fields.length > 0) {
      const regex = new RegExp(this.queryString.search, 'i');
      const searchFilter = { $or: fields.map((field) => ({ [field]: regex })) };
      this.baseFilter = { ...this.baseFilter, ...searchFilter };
      this.query = this.query.find(searchFilter);
    }
    return this;
  }

  /**
   * Whitelisted equality filtering, e.g. ?status=completed&category=<id>
   */
  filter(allowedFields = []) {
    const filterObj = {};
    allowedFields.forEach((field) => {
      if (
        this.queryString[field] !== undefined &&
        this.queryString[field] !== '' &&
        this.queryString[field] !== null
      ) {
        filterObj[field] = this.queryString[field];
      }
    });

    if (Object.keys(filterObj).length > 0) {
      this.baseFilter = { ...this.baseFilter, ...filterObj };
      this.query = this.query.find(filterObj);
    }
    return this;
  }

  /**
   * Sorting via ?field=createdAt&order=desc (or asc)
   * Falls back to `-createdAt` (newest first) by default.
   */
  sort() {
    const { field, order } = this.queryString;
    if (field) {
      const direction = order && order.toLowerCase() === 'asc' ? '' : '-';
      this.query = this.query.sort(`${direction}${field}`);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  /**
   * Pagination via ?page=1&limit=10
   */
  paginate() {
    const page = Math.max(parseInt(this.queryString.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(this.queryString.limit, 10) || 10, 1), 100);
    const skip = (page - 1) * limit;

    this.page = page;
    this.limit = limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  /**
   * Computes pagination metadata (total count, total pages, etc.)
   * Must be called after filter()/search() have been chained so that
   * the same base filter is reused for the count.
   */
  async getMeta() {
    const total = await this.model.countDocuments(this.baseFilter);
    const page = this.page || 1;
    const limit = this.limit || 10;

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    };
  }
}

module.exports = ApiFeatures;
