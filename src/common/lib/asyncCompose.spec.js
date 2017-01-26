import expect from 'expect';

import asyncCompose from './asyncCompose';

describe('asyncCompose', () => {
    it('should return a single function applying all function in given array', async () => {
        const add5 = x => Promise.resolve(x + 5);
        const concatWithHello = text => Promise.resolve(`${text}_hello`);
        const funcs = [
            add5,
            concatWithHello,
        ];

        const composedFunc = asyncCompose(funcs);

        expect(await composedFunc(2)).toBe('7_hello');
        expect(await composedFunc(7)).toBe('12_hello');
    });
});