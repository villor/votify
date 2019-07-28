import { msToMMSS } from './time'

describe('msToMMSS', () => {
  it('returns the correct hours, minutes, and seconds', () => {
    expect(msToMMSS(0)).toEqual('00:00')
    expect(msToMMSS(1000)).toEqual('00:01')
    expect(msToMMSS(59999)).toEqual('01:00')

  })

  it('rounds to nearest second', () => {
    expect(msToMMSS(499)).toEqual('00:00')
    expect(msToMMSS(500)).toEqual('00:01')
    expect(msToMMSS(59499)).toEqual('00:59')
    expect(msToMMSS(59500)).toEqual('01:00')
    expect(msToMMSS(59999)).toEqual('01:00')
    expect(msToMMSS(60000)).toEqual('01:00')
  });
});