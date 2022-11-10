# Onify Hub Functions
Server side functions for Onify Hub

## Version: 0.0.2

### /convert/json/xml

#### POST
##### Summary

Convert JSON content to XML

##### Description

Converts JSON content and returns XML

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| ignoreAttributes | query |  | No | boolean |
| body | body | JSON content | No | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| default | Successful | string |

### /convert/xml/json

#### POST
##### Summary

Convert XML content to JSON

##### Description

Converts XML content and returns JSON

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| ignoreAttributes | query |  | No | boolean |
| body | body | XML content | No | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| default | Successful | string |

### /hello

#### GET
##### Summary

Says hello!

##### Description

Say hello to {name}

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| name | query | What is your name? | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| default | Successful | string |

#### POST
##### Summary

Says hello!

##### Description

Say hello to {name}

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| body | body |  | No | [Model1](#model1) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| default | Successful | string |

### /hello/{name}

#### DELETE
##### Summary

Says bye bye!

##### Description

Say bye bye to {name}

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| name | path | Say bye bye to? | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| default | Successful | string |

#### GET
##### Summary

Says hello!

##### Description

Say hello to {name}

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| name | path | What is your name? | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| default | Successful | string |

#### PUT
##### Summary

Says hello!

##### Description

Say hello to {name}

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| name | path | What is your name? | Yes | string |
| body | body |  | No | [Model2](#model2) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| default | Successful | string |

### /mssql/query

#### GET
##### Summary

Microsoft SQL Server Query

##### Description

Query Microsoft SQL Server

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| server | query |  | Yes | string |
| query | query |  | Yes | string |
| port | query |  | No | number |
| encrypt | query |  | No | boolean |
| trustServerCertificate | query |  | No | boolean |
| database | query |  | Yes | string |
| username | query |  | Yes | string |
| password | query |  | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| default | Successful | string |

### /sftp/readfile

#### GET
##### Summary

Read file from STFP server

##### Description

Reads file from SFTP server and returns raw content.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| filename | query |  | Yes | string |
| host | query |  | Yes | string |
| port | query |  | No | number |
| username | query |  | Yes | string |
| password | query |  | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| default | Successful | string |

### /unspsc/names

#### POST
##### Summary

Get names by codes

##### Description

Get names by UNSPSC® codes

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| includeMeta | query | Includes Segment, Family, Class | No | boolean |
| deepSearch | query | Also search for code in Segment, Family, Class. Otherwise only Commodity. | No | boolean |
| body | body |  | No | [Model3](#model3) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| default | Successful | string |

### /unspsc/{code}

#### GET
##### Summary

Get name by code

##### Description

Get name by UNSPSC® code

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| code | path | UNSPSC® code | Yes | string |
| includeMeta | query | Includes Segment, Family, Class | No | boolean |
| deepSearch | query | Also search for code in Segment, Family, Class. Otherwise only Commodity. | No | boolean |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| default | Successful | string |

### Models

#### Model1

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name | string | What is your name? | Yes |

#### Model2

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| comment | string | Say something more? | No |

#### Model3

UNSPSC® codes

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| Model3 | array | UNSPSC® codes |  |
