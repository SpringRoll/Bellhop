# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.6.0] - Unreleased

### Changed

- Updated node version to 20.18.0 [ticket](https://pbskids.atlassian.net/browse/SR-6)

## [3.5.0] - 2024-01-16

### Changed

- Updated package-lock to include more recent versions of dependencies flagged by dependabot [ticket](https://www.pivotaltracker.com/story/show/186244911)
- Update to Readme based on Github Issue [link](https://github.com/SpringRoll/Bellhop/issues/91)


## [3.4.0] - 2023-04-19

### Changed

- Added .nvmrc file and set target node version to 18.15.0
- Updated Rollup to 3.20.2
- Updated the following Rollup dependencies:
  - @babel/cli to 7.21.0
  - @babel/plugin-transform-runtime to 7.21.4
  - @rollup/plugin-babel to 6.0.3
  - @rollup/plugin-commonjs to 24.0.1
  - @rollup/plugin-node-resolve to 15.0.2
  - @rollup/plugin-terser to 0.4.0
  - @rollup/plugin-eslint to 9.0.3
- Dependabot updates:
  - minimatch from 3.0.4 to 3.1.2
  - mocha from 8.4.0 to 10.2.0
  - nanoid from 3.1.20 to 3.3.3
  - webpack from 5.75.0 to 5.76.0

## [3.3.1] - 2023-03-07

### Changed

- Update NPM Deploy Github Action trigger to released to avoid pre-releases being deployed to NPM
- Small dependency updates

## [3.3.0] - 2021-06-02

### Fixed

- Fixed bug that prevented changing the data returned when passing a function to the `respond()` function

## [3.2.3] - 2022-05-05

### Changed

- Bump minimist from 1.2.5 to 1.2.6

## [3.2.2] - 2021-03-09

### Fixed

- Add check to ensure target is not null before sending message in connectionRecieved method
- fixed error in debug logging always setting `recieved` to `false`

### Changed

- Changed console.error to console.warn when trying to parse JSON in postMessages to better reflect the behaviour

## [3.2.1] - 2021-10-07

### Added

- This CHANGELOG
- added markdown linter

### Changed

- nodejs workflow updated to drop 8.x support and add 14.x
- add Codeowners file
- corrected README typos and missing information
- updated packages to remove security vulnerabilities
