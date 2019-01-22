'use strict';
module.exports = function(app) {
    var products = require('../controllers/productsController');


    // products Routes
    app.route('/tasks')
        .get(products.list_all_tasks)
        .post(products.create_a_task);


    app.route('/tasks/:taskId')
        .get(products.read_a_task)
        .put(products.update_a_task)
        .delete(products.delete_a_task);
};