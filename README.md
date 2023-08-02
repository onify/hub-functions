# Onify Hub Functions

[![Project Status: WIP – Initial development is in progress, but there has not yet been a stable, usable release suitable for the public.](https://www.repostatus.org/badges/latest/wip.svg)](https://www.repostatus.org/#wip)
![Test suite](https://github.com/onify/hub-functions/workflows/Build%20latest/badge.svg)

**Onify Hub Functions** is a set of _server side_ helper functions for Onify Hub. This container usually runs in the same context/namespace as api and worker. The functions main purpose is to add functions that is used in Onify Flow (BPMN). Functions are built in [Node.js](https://nodejs.org/).

> Functions are a complement and sometime even a replacement for Onify Agent (scripts).

## Changelog

### latest

### 1.5.0

* feature: `/excel/read` - New function: Read (and parse) uploaded excel file

### 1.4.2

* chore: bump fast-xml-parser from 4.0.11 to 4.2.4

### 1.4.1

* improve: `/ldap/search` - Convert binary attributes objectSid and objectGuid to text
* improve: `/ldap/search` - Adjusted query parameters and response handling
* fix: `/ldap/search` - Handled test script and property logic bugs

### 1.4.0

* feature: `/ldap/search` - New function: Search LDAP server

### 1.3.3

* improve: add rejectUnauthorized for /activedirectory/users

### 1.3.2

* improve: `/dustin/prepare/order` - ContactPhone is now optional for BuyerParty
* fix: `/dustin/prepare/order` - Price could not be 0
* fix: `/dustin/prepare/order` - ItemDetail is now array, not ListOfItemDetail

### 1.3.1

* fix: do not require CommodityCode for Dustin order

### 1.3.0

* feature: new function: /stfp/list - List files/folders on STFP server

### 1.2.0

* feature: new function: /dustin/prepare/order - Prepare EDI order for Dustin

### 1.1.0

* feature: new function: /activedirectory/users - Get users from Active Directory

### 1.0.0

First release...

## Deploy

Checkout how to use the `hub-functions` container together with the other services [here](https://github.com/onify/install/blob/default/containers.md).

### Docker

Here is an example how to run in Docker.

```yaml
functions:
  image: eu.gcr.io/onify-images/hub/functions:latest
  pull_policy: always
  restart: always
  ports:
    - 8282:8282
```

### Kubernetes

Here is an example how to run in Kubernetes.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: onify-functions
spec:
  selector:
    matchLabels:
      app: functions
  template:
    metadata:
      labels:
        app: functions
    spec:
      imagePullSecrets:
        - name: onify-regcred
      containers:
        - name: functions
          image: eu.gcr.io/onify-images/hub/functions:latest
          ports:
            - name: functions
              containerPort: 8282
---
apiVersion: v1
kind: Service
metadata:
  name: onify-functions
spec:
  ports:
    - protocol: TCP
      name: functions
      port: 8282
  selector:
    app: functions
```

## Run

To run it, just execute command `npm start`.

### Run in debug mode

In VSCode, there is a built-in debugging functionality. To run in debug mode, please press F5. This will execute the commands
stated in the launch.json file. You may place in break points in the line/s of code to verify a current status of variables during the process.  

In the upper right section of the code editor, you will see the debug controls for triggering when to play/pause the flow during runtime.

## Release

1. Update changelog in `README.md`
2. Update version in `package.json`
3. Commit the changes
4. Run `git tag v*.*.*` (eg. 1.1.0)
5. Run `git push --tags`

## Support

* Community/forum: https://support.onify.co/discuss
* Documentation: https://support.onify.co/docs
* Support and SLA: https://support.onify.co/docs/get-support

## Contribute

Sharing is caring! :-) Please feel free to contribute! Please read [Code of Conduct](CODE_OF_CONDUCT.md) first.
You can also create a new request (issue): https://github.com/onify/hub-functions/issues/new.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
