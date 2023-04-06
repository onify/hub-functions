# Onify Hub Functions

[![Project Status: WIP – Initial development is in progress, but there has not yet been a stable, usable release suitable for the public.](https://www.repostatus.org/badges/latest/wip.svg)](https://www.repostatus.org/#wip)
![Test suite](https://github.com/onify/hub-functions/workflows/Test%20suite/badge.svg)

**Onify Hub Functions** is a set of _server side_ helper functions for Onify Hub. This container usually runs in the same context/namespace as api and worker. The functions main purpose is to add functions that is used in Onify Flow (BPMN). Functions are built in [Node.js](https://nodejs.org/).

> Functions are a complement and sometime even a replacement for Onify Agent (scripts).

## Changelog

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
