import * as moduleAlias from 'module-alias';

moduleAlias.addAliases({
    '#server': `${__dirname}/server`,
    '#db': `${__dirname}/db`,
    '#fixtures': `${__dirname}/test/fixtures`,
    '#test': `${__dirname}/test`,
    '#root': __dirname,
});
