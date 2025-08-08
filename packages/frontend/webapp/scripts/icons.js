// @ts-check
const { icons: mdiCollection } = require('@iconify-json/mdi');
const { icons: riCollection } = require('@iconify-json/ri');
const { icons: uilCollection } = require('@iconify-json/uil');
const { icons: bxsCollection } = require('@iconify-json/bxs');

const riIconNames = [
  'file-excel-fill',
]

const mdiIconNames = [
  'account-edit',
  'home-remove-outline',
  'play',
  'delete-outline',
]

const uilIconNames = [
    'temperature-plus',
]

const bxsIconNames = [
    'file-pdf',
]

module.exports.collectionsToFilter = [
  [riCollection, riIconNames],
  [mdiCollection, mdiIconNames],
  [uilCollection, uilIconNames],
  [bxsCollection, bxsIconNames],
]

