/* eslint-env node */
const { icons: mdiCollection } = require("@iconify-json/mdi");
const { icons: riCollection } = require("@iconify-json/ri");
const { icons: uilCollection } = require("@iconify-json/uil");
const { icons: bxsCollection } = require("@iconify-json/bxs");
const { icons: carbonCollection } = require("@iconify-json/carbon");

const riIconNames = ["file-excel-fill", "flag-fill", "sun-fill", "sun-line"];

const mdiIconNames = [
    "account-edit",
    "home-remove-outline",
    "play",
    "delete-outline",
];

const uilIconNames = ["temperature-plus"];

const bxsIconNames = ["file-pdf"];

const carbonIconNames = ["temperature-hot"];

module.exports.collectionsToFilter = [
    [riCollection, riIconNames],
    [mdiCollection, mdiIconNames],
    [uilCollection, uilIconNames],
    [bxsCollection, bxsIconNames],
    [carbonCollection, carbonIconNames],
];
