# @protoheadless/core

## v0.3.0-alpha.0

### Features

- Repeater support on the collection builder. ([af6a5fc](https://github.com/ProtoDigitalUK/proto_headless/commit/af6a5fc5c73f5d37f9a2d3116319cef23e6f0424))
- Added the ability to lock collections from edits and deletion. ([c46fd2c](https://github.com/ProtoDigitalUK/proto_headless/commit/c46fd2c6424bdf2234a425f6e528eb35ebba0157))
- Added a new custom field to the field builder class to reference users. ([7fe7c25](https://github.com/ProtoDigitalUK/proto_headless/commit/7fe7c25ff269a848f2342ed135944b0b06e2d75d))

### Breaking Changes

- Removed collection document author column. ([d4c9e16](https://github.com/ProtoDigitalUK/proto_headless/commit/d4c9e164f8dd822436bafab45434765b0ed47e5a))
- Upsert bricks, fields and groups removed in favour of creating new entries on each request in preparation for revision system. ([a30c3f1](https://github.com/ProtoDigitalUK/proto_headless/commit/a30c3f1bffaa5759bf62d4233bffa79db43532ad))
- Groups are no longer tied to a language meaning in the page builder when swapping between languages you will have the same amount of groups for repeaters. ([08d810e](https://github.com/ProtoDigitalUK/proto_headless/commit/08d810ef3b7692b0cf704babd94466849deab2eb))
- Collection document upsert fields are now require a nested structure instead of being flat. They are now flattened internally so that you no longer have to worry about setting temp group ref ids. ([1c2e654](https://github.com/ProtoDigitalUK/proto_headless/commit/1c2e6542978f703f9a8780dc050ee3a26d8c5fa5))
- Collection document fields response is now nested instead of flat and doesn't return group array. ([2110341](https://github.com/ProtoDigitalUK/proto_headless/commit/2110341f5401c1cb6c398d0d990be0f2b9eef482))
- Removed addPageLink custom field from field builder. ([d2dcd6b](https://github.com/ProtoDigitalUK/proto_headless/commit/d2dcd6b7af9634686b35d9bf09247a6f9873045e))

### Bug Fixes

- Fixed issue with group parent id update query not working in SQLlite. ([525d9e8](https://github.com/ProtoDigitalUK/proto_headless/commit/525d9e860fcf02d92864b94762d8e54e51de99a1))
- Added sort on field formatter groups to ensure correct group order. ([3a2c7e8](https://github.com/ProtoDigitalUK/proto_headless/commit/3a2c7e825433736fc2c61682a282aece21969a69))
- Get multiple document fields now include media and users joins. ([095fe8a](https://github.com/ProtoDigitalUK/proto_headless/commit/095fe8adb070b9494ec98fd3de4850583475c2ea))

## v0.2.0-alpha.0

### Features

- Added support to set disabled and hidden flags on specific custom fields ([693a1a0](https://github.com/ProtoDigitalUK/proto_headless/commit/693a1a0147b1dab4e6f1d17a1e2b25621ea8a2fe))
- New config option to disable serving swagger documentation site ([a4be9f4](https://github.com/ProtoDigitalUK/proto_headless/commit/a4be9f43276c9d7aed945e6f37304ec873b6de8b))

### Breaking Changes

- Collection document get multiple now uses standard format for filtering instead ([8180dc5](https://github.com/ProtoDigitalUK/proto_headless/commit/8180dc5fa2979447b9efd2a054fdaf95f47c4c52))

### Bug Fixes

- Core plugin semver check now supports version suffix (-alpha.0) etc ([7ada563](https://github.com/ProtoDigitalUK/proto_headless/commit/7ada5632ef80620533b9ded4558d56348a39ffe1))