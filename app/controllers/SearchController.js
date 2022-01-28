const BaseController = require('./BaseController');
const SearchService = require('../services/SearchService');

module.exports = class SearchController extends BaseController {

    /**
     * @param {Express} server
     * @param {SearchService} SearchService 
     */
    constructor(server, searchService) {
        super(server);
        this.SearchService = searchService || new SearchService();
    }
    

    /**
     * Register Controller
     */
    init() {
        this.server.get('/api/v1/search', (req, res, next) => this.searchAction(req, res, next));
    }
    
    /**
     * @api {get} /api/v1/search Search for books
     * @apiVersion 1.0.0
     * @apiName Search V1
     * @apiGroup Search
     * @ApiDescription V1 Search for books in goodreads API
     * @apiUse Response100
     */
    /**
     * Search Action
     * @param {Object} req 
     * @param {Object} res 
     * @param {function} next 
     */
    async searchAction(req, res, next) {
        try {
            let result = await  this.SearchService.search(req.query['q']);

            // Sort data based on query string
            let sorted_result = this.sort_by(result[0].results[0].work, req.query['sort_by'], req.query['order']);
            result[0].results[0].work = sorted_result;
            res.status(200).json(super.sendResponse('SUCCESS', result));
        } catch (e) {
            res.status(500).json(super.sendResponse('BACKEND_ERROR', e.message));
        }
    }

    /**
     * Sort By
     * @param {Array} data
     * @param {String} key title | average_rating | original_publication_year
     * @param {String} order desc | asc
     */
    sort_by(data, key, order) {
        key = key || "id"
        order = order || "asc"

        if (!key) { return data }

       const sort_order = order === "desc"? -1 : 1

        if (key === "id") {
            return data.sort((a, b) => (b.id._ < a.id._) * sort_order)
        } else if (key === "title") {
            return data.sort((a, b) => (b.best_book[0].title[0] < a.best_book[0].title[0]) * sort_order)
        } else if (key === "average_rating") {
            return data.sort((a, b) => (b.average_rating[0] < a.average_rating[0]) * sort_order)
        } else if (key === "original_publication_year") {
            return data.sort((a, b) => (parseInt(b.original_publication_year[0]._) < parseInt(a.original_publication_year[0]._)) * sort_order)
        } else {
            return data
        }
    }

}