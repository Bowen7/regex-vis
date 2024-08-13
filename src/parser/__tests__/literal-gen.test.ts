import { expect, it } from 'vitest'
import gen from '../gen'

it('gen with literal = true', () => {
  expect(
    gen({
      id: '',
      type: 'regex',
      body: [
        {
          id: '',
          type: 'character',
          kind: 'string',
          value: 'a',
          quantifier: null,
        },
      ],
      flags: ['g'],
      literal: true,
      escapeBackslash: false,
    }),
  ).toBe('/a/g')

  expect(
    gen(
      {
        id: '',
        type: 'regex',
        body: [
          {
            id: '',
            type: 'character',
            kind: 'string',
            value: 'a',
            quantifier: null,
          },
        ],
        flags: ['g'],
        literal: false,
        escapeBackslash: false,
      },
      { literal: true },
    ),
  ).toBe('/a/g')

  expect(
    gen({
      id: '',
      type: 'regex',
      body: [
        {
          id: '',
          type: 'character',
          kind: 'string',
          value: '/',
          quantifier: null,
        },
      ],
      flags: [],
      literal: true,
      escapeBackslash: false,
    }),
  ).toBe('/\\//')
})

it('gen with literal = false', () => {
  expect(
    gen({
      id: '',
      type: 'regex',
      body: [
        {
          id: '',
          type: 'character',
          kind: 'string',
          value: 'a',
          quantifier: null,
        },
      ],
      flags: ['g'],
      literal: false,
      escapeBackslash: false,
    }),
  ).toBe('a')

  expect(
    gen({
      id: '',
      type: 'regex',
      body: [
        {
          id: '',
          type: 'character',
          kind: 'string',
          value: '/',
          quantifier: null,
        },
      ],
      flags: [],
      literal: false,
      escapeBackslash: false,
    }),
  ).toBe('/')

  expect(
    gen({
      id: '',
      type: 'regex',
      body: [
        {
          id: '',
          type: 'backReference',
          ref: 'name',
          quantifier: {
            kind: '?',
            min: 0,
            max: 1,
            greedy: true,
          },
        },
      ],
      flags: [],
      literal: false,
      escapeBackslash: true,
    }),
  ).toBe('\\k<name>?')
})

it('gen with escapeBackslash = false', () => {
  expect(
    gen({
      id: '',
      type: 'regex',
      body: [
        {
          id: '',
          type: 'character',
          kind: 'class',
          value: '\\d',
          quantifier: null,
        },
      ],
      flags: [],
      literal: false,
      escapeBackslash: false,
    }),
  ).toBe('\\d')

  expect(
    gen({
      id: '',
      type: 'regex',
      body: [
        {
          id: '',
          type: 'backReference',
          ref: '123',
          quantifier: null,
        },
      ],
      flags: [],
      literal: false,
      escapeBackslash: false,
    }),
  ).toBe('\\123')

  expect(
    gen({
      id: '',
      type: 'regex',
      body: [
        {
          id: '',
          type: 'backReference',
          ref: 'name',
          quantifier: null,
        },
      ],
      flags: [],
      literal: false,
      escapeBackslash: false,
    }),
  ).toBe('\\k<name>')
})

it('gen with escapeBackslash = true', () => {
  expect(
    gen({
      id: '',
      type: 'regex',
      body: [
        {
          id: '',
          type: 'character',
          kind: 'class',
          value: '\\d',
          quantifier: null,
        },
      ],
      flags: [],
      literal: false,
      escapeBackslash: true,
    }),
  ).toBe('\\\\d')

  expect(
    gen({
      id: '',
      type: 'regex',
      body: [
        {
          id: '',
          type: 'character',
          kind: 'class',
          value: '.',
          quantifier: null,
        },
      ],
      flags: [],
      literal: false,
      escapeBackslash: true,
    }),
  ).toBe('.')

  expect(
    gen({
      id: '',
      type: 'regex',
      body: [
        {
          id: '',
          type: 'backReference',
          ref: '123',
          quantifier: null,
        },
      ],
      flags: [],
      literal: false,
      escapeBackslash: true,
    }),
  ).toBe('\\\\123')

  expect(
    gen({
      id: '',
      type: 'regex',
      body: [
        {
          id: '',
          type: 'backReference',
          ref: 'name',
          quantifier: null,
        },
      ],
      flags: [],
      literal: false,
      escapeBackslash: true,
    }),
  ).toBe('\\\\k<name>')
})
