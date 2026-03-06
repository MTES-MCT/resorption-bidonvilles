/* eslint-env node */
const { icons: mdiCollection } = require("@iconify-json/mdi");
const { icons: riCollection } = require("@iconify-json/ri");
const { icons: uilCollection } = require("@iconify-json/uil");
const { icons: bxsCollection } = require("@iconify-json/bxs");
const { icons: carbonCollection } = require("@iconify-json/carbon");

const riIconNames = [
    "file-word-fill",
    "file-excel-fill",
    "flag-fill",
    "focus-2-line",
    "follow-fill",
    "key-fill",
    "link-unlink",
    "plane-fill",
    "prohibited-line",
    "refresh-line",
    "sun-fill",
    "sun-line",
    "eye-line",
    "eye-off-line",
];

const mdiIconNames = [
    "account-edit",
    "home-remove-outline",
    "play",
    "delete-outline",
    "content-copy",
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
