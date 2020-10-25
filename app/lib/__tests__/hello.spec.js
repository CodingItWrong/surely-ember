import hello from '../hello';

describe('hello', () => {
  it('says hello', () => {
    expect(hello()).toEqual('hello');
  });
});
