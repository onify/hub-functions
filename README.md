# Onify Hub Functions

[![Project Status: WIP – Initial development is in progress, but there has not yet been a stable, usable release suitable for the public.](https://www.repostatus.org/badges/latest/wip.svg)](https://www.repostatus.org/#wip)

**Onify Hub Functions** is a set of _server side_ helper functions for Onify Hub. This container usually runs in the same context/namespace as api and worker. The functions main purpose is to add functions that is used in Onify Flow (BPMN). Functions are built in [Node.js](https://nodejs.org/).

> Functions are a complement and sometime even a replacement for Onify Agent (scripts).

## Functions

* [hello](/functions/hello.js) - Example function script 
* [parser](/functions/hello.js) - Parser functions (eg. XML)
* [sftp](/functions/hello.js) - SFTP functions (WIP)
* [mssql](/functions/hello.js) - MSSQL functions (WIP)

### Building functions

Please check out pre-built functions in `./functions` for some examples.

## Data

Please store data-files in the `./data` folder.

## Support

* Community/forum: https://support.onify.co/discuss
* Documentation: https://support.onify.co/docs
* Support and SLA: https://support.onify.co/docs/get-support

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.