// @ts-check
const { icons: mdiCollection } = require('@iconify-json/mdi');
const { icons: riCollection } = require('@iconify-json/ri');
const { icons: uilCollection } = require('@iconify-json/uil');

const riIconNames = [
  'file-excel-fill',
]

const mdiIconNames = [
  'account-heart',
  'account-key',
]

const uilIconNames =[
    'temperature-plus',
]

module.exports.collectionsToFilter = [
  [riCollection, riIconNames],
  [mdiCollection, mdiIconNames],
  [uilCollection, uilIconNames],
]

