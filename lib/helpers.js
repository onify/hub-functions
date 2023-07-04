'use strict';

const Handlebars = require("handlebars");

Handlebars.registerHelper('ENV', (value) => {
    return new Handlebars.SafeString(value);
});

exports.setQueryParameterTemplateValues = (query, context) => {
    for (const key of Object.keys(query)) {
        const template = Handlebars.compile(query[key]);
        query[key] = template(context);
    }
}