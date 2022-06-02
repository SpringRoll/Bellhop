# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.3.0] - 2021-06-02

## Fixed

- Fixed bug that prevented changing the data returned when passing a function to the `respond()` function

## [3.2.3] - 2022-05-05

## Changed

- Bump minimist from 1.2.5 to 1.2.6

## [3.2.2] - 2021-03-09

## Fixed

- Add check to ensure target is not null before sending message in connectionRecieved method
- fixed error in debug logging always setting `recieved` to `false`

## Changed

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
