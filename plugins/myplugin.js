'use strict';

exports.plugin = {
    //pkg: require('./package.json'),
    name: 'myplugin',
    register: async function (server, options) {

        // Create a route for example

        server.route({
            method: 'GET',
            path: '/api/v1/test',
            handler: function (request, h) {

                //const name = options.name;
                return `Test`;
            },
            options: {
                description: 'Get todo',
                notes: 'Returns a todo item by the id passed in the path',
                tags: ['api'], 
            }
        });

        // etc...
        console.log('Registered myplugin');
        //await someAsyncMethods();
    }
};

/*

    server.route({
        method: 'POST',
        path: '/post',
        handler: function (request, h) {
    
            return 'Blog post added';
        },
        options: {
            validate: {
                payload: Joi.object({
                    post: Joi.string().min(1).max(140),
                    date: Joi.date().required()
                })
            }
        }
    });    


{
    method: 'GET',
    path: '/todo/{id}/',
    options: {
        handler: handlers.getToDo,
        description: 'Get todo',
        notes: 'Returns a todo item by the id passed in the path',
        tags: ['api'], // ADD THIS TAG
        validate: {
            params: Joi.object({
                id : Joi.number()
                        .required()
                        .description('the id for the todo item'),
            })
        }
    },
}
*/