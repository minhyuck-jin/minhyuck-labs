import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  ApiRequestError,
  fetchGetApi,
  fetchPostApi,
  fetchRawJson,
} from '@/app/shared/api/apiClient'

describe('apiClient', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('fetchRawJson returns parsed body on success', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: 'UP' }),
        }),
      ),
    )

    await expect(
      fetchRawJson<{ status: string }>('/labs-api/actuator/health'),
    ).resolves.toEqual({
      status: 'UP',
    })
  })

  it('fetchGetApi returns data on success envelope', async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            data: { id: '1' },
            error: null,
          }),
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      fetchGetApi<{ id: string }>('/labs-api/items/1'),
    ).resolves.toEqual({ id: '1' })

    expect(fetchMock).toHaveBeenCalledWith('/labs-api/items/1', {
      method: 'GET',
    })
  })

  it('fetchPostApi sends POST JSON body and returns data', async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            data: { id: '1' },
            error: null,
          }),
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      fetchPostApi<{ id: string }>('/labs-api/orders/search', {
        keyword: 'abc',
      }),
    ).resolves.toEqual({ id: '1' })

    expect(fetchMock).toHaveBeenCalledWith('/labs-api/orders/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyword: 'abc' }),
    })
  })

  it('fetchPostApi throws ApiRequestError on envelope error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 400,
          json: () =>
            Promise.resolve({
              data: null,
              error: { code: 'BAD_REQUEST', message: 'invalid' },
            }),
        }),
      ),
    )

    await expect(
      fetchPostApi('/labs-api/orders/search', {}),
    ).rejects.toMatchObject({
      name: 'ApiRequestError',
      code: 'BAD_REQUEST',
      message: 'invalid',
      httpStatus: 400,
    })

    await expect(
      fetchPostApi('/labs-api/orders/search', {}),
    ).rejects.toBeInstanceOf(ApiRequestError)
  })
})
