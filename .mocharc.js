module.exports = {
    reporter: 'spec',
    extension: ['ts'],
    spec: 'test/**/*.spec.ts',
    timeout: 100000,
    require: ['ts-node/register', 'src/mocha-hooks.ts'],
};
