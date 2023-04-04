'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { XMLParser } = require('fast-xml-parser');

const { afterEach, beforeEach, describe, it } = (exports.lab = Lab.script());
const Helpers = require('../testHelpers');

const FUNCTION_ENDPOINT = '/dustin';

describe('dustin:', () => {
  let server;

  beforeEach(async () => {
    server = await Helpers.getServer();
  });

  afterEach(async () => {
    await server.stop();
  });

  it(`POST ${FUNCTION_ENDPOINT}/prepare/order - NOK - "Order.BuyerParty.PartyID" is not allowed to be empty - returns 400`, async () => {
    const payload = `
      {
        "Order": {
          "BuyerOrderNumber": "",
          "Currency": "SEK",
          "Notes": "",
          "CostCenter": "",
          "GoodsMarking": "",
          "BuyerParty": {
            "PartyID": "",
            "TaxIdentifier": "",
            "Name": "",
            "Street": "",
            "PostalCode": "",
            "City": "",
            "Country": "SE",
            "ContactName": "",
            "ContactPhone": "",
            "ContactEmail": ""
          }

        }
      }
    `;
    const res = await server.inject({
      method: 'POST',
      url: `${FUNCTION_ENDPOINT}/prepare/order`,
      payload: payload
    });
    expect(res.statusCode).to.equal(400);
    expect(res.result.message).to.equal("\"Order.BuyerParty.PartyID\" is not allowed to be empty");
  });

  it(`POST ${FUNCTION_ENDPOINT}/prepare/order - NOK - "OrderRows" is required - returns 400`, async () => {
    const payload = `
    {
      "Order": {
        "Currency": "SEK",
        "BuyerParty": {
          "PartyID": "1234567",
          "TaxIdentifier": "SE1234567",
          "Name": "Company AB",
          "Street": "Street 1",
          "PostalCode": "12345",
          "City": "City",
          "Country": "SE",
          "ContactName": "John Doe",
          "ContactPhone": "555-123456",
          "ContactEmail": "john.doe@company.com"
        }

      }
    }
    `;
    const res = await server.inject({
      method: 'POST',
      url: `${FUNCTION_ENDPOINT}/prepare/order`,
      payload: payload
    });
    expect(res.statusCode).to.equal(400);
    expect(res.result.message).to.equal("\"OrderRows\" is required");
  });

  it(`POST ${FUNCTION_ENDPOINT}/prepare/order - OK - BuyerParty and OrderRows - returns 200`, async () => {
    const payload = `
    {
      "Order": {
          "Currency": "SEK",
          "BuyerParty": {
              "PartyID": "1234567",
              "TaxIdentifier": "SE1234567",
              "Name": "Company AB",
              "Street": "Street 1",
              "PostalCode": "12345",
              "City": "City",
              "Country": "SE",
              "ContactName": "John Doe",
              "ContactPhone": "555-123456",
              "ContactEmail": "john.doe@company.com"
          }
      },
      "OrderRows": [
          {
              "PartID": "55555",
              "CommodityCode": "12345",
              "Quantity": 1,
              "Price": 100.5,
              "Currency": "SEK"
          }
      ]
    }
    `;
    const res = await server.inject({
      method: 'POST',
      url: `${FUNCTION_ENDPOINT}/prepare/order`,
      payload: payload
    });

    const converter = new XMLParser({ ignoreAttributes: true });
    let jsonObj = converter.parse(res.result);

    expect(res.statusCode).to.equal(200);
    expect(jsonObj.Order.OrderHeader.OrderParty.BuyerParty.Party.NameAddress.Name1).to.equal("Company AB");
    expect(jsonObj.Order.OrderSummary.TotalAmount.MonetaryValue.MonetaryAmount).to.equal(100.5);
  });


});
