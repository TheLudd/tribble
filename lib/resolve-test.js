import { describe, it, beforeEach } from 'mocha'
import { assert } from 'chai'
import { resolve } from './resolve.js'
import globalState from './global-state.js'

const { deepEqual } = assert

describe('resolve', () => {
  const defaultResolver = (specifier, context) => ({
    default: true,
    specifier,
    context,
  })

  beforeEach(() => {
    globalState.reset()
  })

  const context = { parentURL: 'file:///tmp/a-caller.js' } 

  it('passes non replaced paths to the next resolver', async () => {
    const specifier = './some-path.js'
    const result = await resolve(specifier, context, defaultResolver)
    const expected = {
      default: true,
      specifier,
      context,
    }
    deepEqual(result, expected)
  })

  it('adds a count query parameter to replaced dependencies', async () => {
    const resolvedURL = 'file:///tmp/replaced-file.js'
    globalState.replace(resolvedURL, 'whatever')
    const result = await resolve('./replaced-file.js', context, defaultResolver)
    const expected = {
      shortCircuit: true,
      url: `${resolvedURL}?__tribbleCount=1`,
      format: 'module',
    }
    deepEqual(result, expected)
  })
})