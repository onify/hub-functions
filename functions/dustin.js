'use strict';

const Joi = require('joi');
const Moment = require('moment');
const { XMLParser, XMLValidator, XMLBuilder } = require('fast-xml-parser');
const Fs = require('fs');
const Logger = require('../lib/logger.js');

const orderBaseXMLFileName = './data/dustin/orderTemplate.xml';
const orderRowBaseXMLFileName = './data/dustin/orderRowTemplate.xml';
const orderBaseXML = Fs.readFileSync(orderBaseXMLFileName, { encoding: 'utf-8' });
const orderRowBaseXML = Fs.readFileSync(orderRowBaseXMLFileName, { encoding: 'utf-8' });

const options = {
    ignoreAttributes: false,
    format: true
};

const parser = new XMLParser(options);
const builder = new XMLBuilder(options);

const buyerPartyValidation = {
  PartyID: Joi.string().required().default('').description('Order.OrderHeader.OrderParty.BuyerParty.Party.PartyID.Identifier.Ident'),
  TaxIdentifier: Joi.string().required().default('').description('Order.OrderHeader.OrderParty.BuyerParty.PartyTaxInformation.TaxIdentifier.Identifier.Ident'),
  Name: Joi.string().required().default('').description('Order.OrderHeader.OrderParty.BuyerParty.Party.NameAddress.Name1'),
  Street: Joi.string().required().default('').description('Order.OrderHeader.OrderParty.BuyerParty.Party.NameAddress.Street'),
  PostalCode: Joi.string().required().default('').description('Order.OrderHeader.OrderParty.BuyerParty.Party.NameAddress.PostalCode'),
  City: Joi.string().required().default('').description('Order.OrderHeader.OrderParty.BuyerParty.Party.NameAddress.City'),
  Country: Joi.string().regex(/^[A-Z]{2}$/).optional().default('SE').description('Order.OrderHeader.OrderParty.BuyerParty.Party.NameAddress.Country.CountryCoded'),
  ContactName: Joi.string().required().default('').description('Order.OrderHeader.OrderParty.BuyerParty.Party.OrderContact.Contact.ContactName'),
  ContactPhone: Joi.string().optional().default('').description('Order.OrderHeader.OrderParty.BuyerParty.Party.OrderContact.Contact.ListOfContactNumber.ContactNumber[0].ContactNumberValue'), 
  ContactEmail: Joi.string().required().default('').description('Order.OrderHeader.OrderParty.BuyerParty.Party.OrderContact.Contact.ListOfContactNumber.ContactNumber[1].ContactNumberValue')
};

const shipToPartyValidation = {
  PartyID: Joi.string().optional().default('').allow(null, '').description('Order.OrderHeader.OrderParty.ShipToParty.Party.PartyID.Identifier.Ident'),
  TaxIdentifier: Joi.string().optional().default('').allow(null, '').description('Order.OrderHeader.OrderParty.ShipToParty.PartyTaxInformation.TaxIdentifier.Identifier.Ident'),
  Name: Joi.string().optional().default('').allow(null, '').description('Order.OrderHeader.OrderParty.ShipToParty.Party.NameAddress.Name1'),
  Street: Joi.string().optional().default('').allow(null, '').description('Order.OrderHeader.OrderParty.ShipToParty.Party.NameAddress.Street'),
  PostalCode: Joi.string().optional().default('').allow(null, '').description('Order.OrderHeader.OrderParty.ShipToParty.Party.NameAddress.PostalCode'),
  City: Joi.string().optional().default('').allow(null, '').description('Order.OrderHeader.OrderParty.ShipToParty.Party.NameAddress.City'),
  Country: Joi.string().regex(/^[A-Z]{2}$/).optional().default('SE').description('Order.OrderHeader.OrderParty.ShipToParty.Party.NameAddress.Country.CountryCoded'),
  ContactName: Joi.string().optional().default('').allow(null, '').description('Order.OrderHeader.OrderParty.ShipToParty.Party.OrderContact.Contact.ContactName'),
  ContactPhone: Joi.string().optional().default('').allow(null, '').description('Order.OrderHeader.OrderParty.ShipToParty.Party.OrderContact.Contact.ListOfContactNumber.ContactNumber[0].ContactNumberValue'), // Required??
  ContactEmail: Joi.string().optional().default('').allow(null, '').description('Order.OrderHeader.OrderParty.ShipToParty.Party.OrderContact.Contact.ListOfContactNumber.ContactNumber[1].ContactNumberValue') // Required??
};

const billToPartyValidation = {
  PartyID: Joi.string().optional().default('').allow(null, '').description('Order.OrderHeader.OrderParty.BillToParty.Party.PartyID.Identifier.Ident'),
  TaxIdentifier: Joi.string().optional().default('').allow(null, '').description('Order.OrderHeader.OrderParty.BillToParty.PartyTaxInformation.TaxIdentifier.Identifier.Ident'),
  Name: Joi.string().optional().default('').allow(null, '').description('Order.OrderHeader.OrderParty.BillToParty.Party.NameAddress.Name1'),
  Street: Joi.string().optional().default('').allow(null, '').description('Order.OrderHeader.OrderParty.BillToParty.Party.NameAddress.Street'),
  PostalCode: Joi.string().optional().default('').allow(null, '').description('Order.OrderHeader.OrderParty.BillToParty.Party.NameAddress.PostalCode'),
  City: Joi.string().optional().default('').allow(null, '').description('Order.OrderHeader.OrderParty.BillToParty.Party.NameAddress.City'),
  Country: Joi.string().regex(/^[A-Z]{2}$/).optional().default('SE').description('Order.OrderHeader.OrderParty.BillToParty.Party.NameAddress.Country.CountryCoded'),
  //ContactName: Joi.string().optional().default('').description('Order.OrderHeader.OrderParty.BillToParty.Party.OrderContact.ContactName'),
  //ContactPhone: Joi.string().optional().default('').description('Order.OrderHeader.OrderParty.BillToParty.Party.OrderContact.Contact.ListOfContactNumber.ContactNumber[0].ContactNumberValue'), // Required??
  //ContactEmail: Joi.string().optional().default('').description('Order.OrderHeader.OrderParty.BillToParty.Party.OrderContact.Contact.ListOfContactNumber.ContactNumber[1].ContactNumberValue') // Required??
};

const OrderValidation = {
  BuyerOrderNumber: Joi.string().optional().allow(null, '').default('').description('Order.OrderHeader.OrderNumber.BuyerOrderNumber'),
  Currency: Joi.string().regex(/^[A-Z]{3}$/).required().default('SEK').description('Order.OrderHeader.OrderCurrency.Currency.CurrencyCoded'),
  Notes: Joi.string().optional().allow(null, '').default('').description('Order.OrderHeader.OrderHeaderNote'),
  CostCenter: Joi.string().optional().allow(null, '').default('').description('Order.OrderHeader.ListOfStructuredNote.StructuredNote[0].GeneralNote'),
  GoodsMarking: Joi.string().optional().allow(null, '').default('').description('Order.OrderHeader.ListOfStructuredNote.StructuredNote[1].GeneralNote'),
  BuyerParty: buyerPartyValidation,
  ShipToParty: shipToPartyValidation,
  BillToParty: billToPartyValidation
};

const OrderRowValidation = {
  PartID: Joi.string().required().default('').description('ItemDetail.BaseItemDetail.ItemIdentifiers.PartNumbers.SellerPartNumber.PartNum.PartID'),
  CommodityCode: Joi.string().optional().default('').description('ItemDetail.BaseItemDetail.ItemIdentifiers.CommodityCode.Identifier.Ident'),
  Quantity: Joi.number().integer().min(1).required().description('ItemDetail.BaseItemDetail.TotalQuantity.Quantity.QuantityValue'),
  Price: Joi.number().required().description('ItemDetail.PricingDetail.ListOfPrice.Price.UnitPrice.UnitPriceValue'),
  Currency: Joi.string().regex(/^[A-Z]{3}$/).required().default('SEK').description('ItemDetail.PricingDetail.ListOfPrice.Price.UnitPrice.Currency.CurrencyCoded'),
  LineItemNote: Joi.string().optional().allow(null, '').default('').description('ItemDetail.LineItemNote'),
};

exports.plugin = {
  name: 'dustin',

  register: async function (server, options) {

    server.route({
      method: 'POST',
      path: '/dustin/prepare/order',
      options: {
        description: 'Prepare Dustin order',
        notes: 'Takes inputs and outputs XML order in Dustin (xcbl) format ',
        tags: ['api', 'dustin'],
        validate: {
          payload: Joi.object({
            Order: OrderValidation,
            OrderRows: Joi.array().items(Joi.object({
              ...OrderRowValidation
            })).required()
          })
        }
      },
      handler: function (request, h) {
        Logger.debug(`Request ${request.method.toUpperCase()} ${request.path}`);

        const currentDateTime = Moment(new Date()).format().replaceAll('-',''); //Format: YYYYMMDDTHH:MM:SS[[+-]HH:MM]? (the first MM is Months, the other two are minutes)

        let order;
        try {
          order = parser.parse(orderBaseXML);
        } catch (err) {
          return h.response({ error: err.message }).code(500);
        }

        try {
          order.Order.OrderHeader.OrderNumber.BuyerOrderNumber = request.payload.Order.BuyerOrderNumber; // Can be blank?
          order.Order.OrderHeader.OrderIssueDate = currentDateTime; // Current date/time?
          order.Order.OrderHeader.OrderCurrency.Currency.CurrencyCoded = request.payload.Order.Currency; // Support other currency?
          order.Order.OrderHeader.OrderHeaderNote = request.payload.Order.Notes; // Can be blank?
          order.Order.OrderHeader.ListOfStructuredNote.StructuredNote[0].GeneralNote = request.payload.Order.CostCenter; // CostCenter - can be blank, needed?
          order.Order.OrderHeader.ListOfStructuredNote.StructuredNote[1].GeneralNote = request.payload.Order.GoodsMarking; // GoodsMarking - can be blank, needed?
          
          order.Order.OrderHeader.OrderParty.BuyerParty.Party.PartyID.Identifier.Ident = request.payload.Order.BuyerParty.PartyID;
          order.Order.OrderHeader.OrderParty.BuyerParty.Party.NameAddress.Name1 = request.payload.Order.BuyerParty.Name;
          order.Order.OrderHeader.OrderParty.BuyerParty.Party.NameAddress.Street = request.payload.Order.BuyerParty.Street;
          order.Order.OrderHeader.OrderParty.BuyerParty.Party.NameAddress.PostalCode = request.payload.Order.BuyerParty.PostalCode;
          order.Order.OrderHeader.OrderParty.BuyerParty.Party.NameAddress.City = request.payload.Order.BuyerParty.City;
          order.Order.OrderHeader.OrderParty.BuyerParty.Party.NameAddress.Country.CountryCoded = request.payload.Order.BuyerParty.Country;
          order.Order.OrderHeader.OrderParty.BuyerParty.Party.OrderContact.Contact.ContactName = request.payload.Order.BuyerParty.ContactName;
          order.Order.OrderHeader.OrderParty.BuyerParty.Party.OrderContact.Contact.ListOfContactNumber.ContactNumber[0].ContactNumberValue = request.payload.Order.BuyerParty.ContactPhone; // Can be blank?
          order.Order.OrderHeader.OrderParty.BuyerParty.Party.OrderContact.Contact.ListOfContactNumber.ContactNumber[1].ContactNumberValue = request.payload.Order.BuyerParty.ContactEmail; // Can be blank?
          order.Order.OrderHeader.OrderParty.BuyerTaxInformation.PartyTaxInformation.TaxIdentifier.Identifier.Ident = request.payload.Order.BuyerParty.TaxIdentifier;
          
          order.Order.OrderHeader.OrderParty.ShipToParty.Party.PartyID.Identifier.Ident = request.payload.Order.ShipToParty?.PartyID || request.payload.Order.BuyerParty.PartyID;
          order.Order.OrderHeader.OrderParty.ShipToParty.Party.NameAddress.Name1 = request.payload.Order.ShipToParty?.Name || request.payload.Order.BuyerParty.Name;
          order.Order.OrderHeader.OrderParty.ShipToParty.Party.NameAddress.Street = request.payload.Order.ShipToParty?.Street || request.payload.Order.BuyerParty.Street;
          order.Order.OrderHeader.OrderParty.ShipToParty.Party.NameAddress.PostalCode = request.payload.Order.ShipToParty?.PostalCode || request.payload.Order.BuyerParty.PostalCode;
          order.Order.OrderHeader.OrderParty.ShipToParty.Party.NameAddress.City = request.payload.Order.ShipToParty?.City || request.payload.Order.BuyerParty.City;
          order.Order.OrderHeader.OrderParty.ShipToParty.Party.NameAddress.Country.CountryCoded = request.payload.Order.ShipToParty?.Country || request.payload.Order.BuyerParty.Country;
          order.Order.OrderHeader.OrderParty.ShipToParty.Party.OrderContact.Contact.ContactName = request.payload.Order.ShipToParty?.ContactName || request.payload.Order.BuyerParty.ContactName;
          order.Order.OrderHeader.OrderParty.ShipToParty.Party.OrderContact.Contact.ListOfContactNumber.ContactNumber[0].ContactNumberValue = request.payload.Order.ShipToParty?.ContactPhone || request.payload.Order.BuyerParty.ContactPhone; // Can be blank?
          order.Order.OrderHeader.OrderParty.ShipToParty.Party.OrderContact.Contact.ListOfContactNumber.ContactNumber[1].ContactNumberValue = request.payload.Order.ShipToParty?.ContactEmail || request.payload.Order.BuyerParty.ContactEmail; // Can be blank?
          
          order.Order.OrderHeader.OrderParty.BillToParty.Party.PartyID.Identifier.Ident = request.payload.Order.BillToParty?.PartyID || request.payload.Order.BuyerParty.PartyID;
          order.Order.OrderHeader.OrderParty.BillToParty.Party.NameAddress.Name1 = request.payload.Order.BillToParty?.Name || request.payload.Order.BuyerParty.Name;
          order.Order.OrderHeader.OrderParty.BillToParty.Party.NameAddress.Street = request.payload.Order.BillToParty?.Street || request.payload.Order.BuyerParty.Street;
          order.Order.OrderHeader.OrderParty.BillToParty.Party.NameAddress.PostalCode = request.payload.Order.BillToParty?.PostalCode || request.payload.Order.BuyerParty.PostalCode;
          order.Order.OrderHeader.OrderParty.BillToParty.Party.NameAddress.City = request.payload.Order.BillToParty?.City || request.payload.Order.BuyerParty.City;
          order.Order.OrderHeader.OrderParty.BillToParty.Party.NameAddress.Country.CountryCoded = request.payload.Order.BillToParty?.Country || request.payload.Order.BuyerParty.Country;
          //order.Order.OrderHeader.OrderParty.BillToParty.Party.OrderContact.ContactName = request.payload.Order.BillToParty?.ContactName || request.payload.Order.BuyerParty.ContactName; // Needed ?
          //order.Order.OrderHeader.OrderParty.BillToParty.Party.OrderContact.Contact.ListOfContactNumber.ContactNumber[0].ContactNumberValue = request.payload.Order.BillToParty?.ContactPhone || request.payload.Order.BuyerParty.ContactPhone; // Needed ?
          //order.Order.OrderHeader.OrderParty.BillToParty.Party.OrderContact.Contact.ListOfContactNumber.ContactNumber[1].ContactNumberValue = request.payload.Order.BillToParty?.ContactEmail || request.payload.Order.BuyerParty.ContactEmail; // Needed ?
        } catch (err) {
          return h.response({ error: err.message }).code(500);
        }

        order.Order.OrderDetail.ListOfItemDetail = {
          ItemDetail: []    
        }; 
        
        let orderRowsCount = 0;
        let totalMonetaryAmount = 0.0;
        
        request.payload.OrderRows.forEach(requestOrderRow => {
            ++orderRowsCount;
            try {
              let monetaryAmount;
              if (requestOrderRow.Price > 0) {
                monetaryAmount = (parseFloat(requestOrderRow.Price) * parseInt(requestOrderRow.Quantity)).toFixed(2);
                totalMonetaryAmount = totalMonetaryAmount + parseFloat(monetaryAmount);
              }
              let orderRow = parser.parse(orderRowBaseXML);
              orderRow.ItemDetail.BaseItemDetail.LineItemNum.BuyerLineItemNum = orderRowsCount; 
              orderRow.ItemDetail.BaseItemDetail.ItemIdentifiers.PartNumbers.SellerPartNumber.PartNum.PartID = requestOrderRow.PartID;
              orderRow.ItemDetail.BaseItemDetail.ItemIdentifiers.CommodityCode.Identifier.Ident = requestOrderRow.CommodityCode; // US-UN-SPSC - Always exists/needed?
              orderRow.ItemDetail.BaseItemDetail.TotalQuantity.Quantity.QuantityValue = requestOrderRow.Quantity;
              orderRow.ItemDetail.PricingDetail.ListOfPrice.Price.UnitPrice.UnitPriceValue = requestOrderRow.Price;
              orderRow.ItemDetail.PricingDetail.ListOfPrice.Price.UnitPrice.Currency.CurrencyCoded = requestOrderRow.Currency;
              orderRow.ItemDetail.PricingDetail.ListOfPrice.Price.PriceBasisQuantity.Quantity.QuantityValue = requestOrderRow.Quantity;
              orderRow.ItemDetail.PricingDetail.TotalValue.MonetaryValue.MonetaryAmount = monetaryAmount;
              orderRow.ItemDetail.DeliveryDetail.ListOfScheduleLine.ScheduleLine.Quantity.QuantityValue = requestOrderRow.Quantity;
              orderRow.ItemDetail.DeliveryDetail.ListOfScheduleLine.ScheduleLine.RequestedDeliveryDate = currentDateTime;
              orderRow.ItemDetail.LineItemNote = requestOrderRow.LineItemNote;
              order.Order.OrderDetail.ListOfItemDetail.ItemDetail.push(orderRow.ItemDetail);
            } catch (err) {
              return h.response({ error: err.message }).code(500);
            }              
        });
        
        try {
          order.Order.OrderSummary.NumberOfLines = order.Order.OrderDetail.ListOfItemDetail.length; 
          order.Order.OrderSummary.TotalAmount.MonetaryValue.MonetaryAmount = parseFloat(totalMonetaryAmount).toFixed(2); // Calculate
          order.Order.OrderSummary.TotalAmount.MonetaryValue.Currency.CurrencyCoded = request.payload.Order.Currency; // Correct where to get it from?
        } catch (err) {
          return h.response({ error: err.message }).code(500);
        }

        let xmlDataStr;
        try {
          xmlDataStr = builder.build(order);
        } catch (err) {
          return h.response({ error: err.message }).code(500);
        }

        return h.response(xmlDataStr).code(200);

      },
    });
  },
};
