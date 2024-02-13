import app from '../../app'
import request from 'supertest'
import { JSON_HEADER } from '../../../test/config'
import { type NewWarehouse } from '../../../db/schema'
import { faker } from '@faker-js/faker'

describe('GET /warehouses', () => {
  it('should return 200 OK and a Dataobject, Header should be json', async () => {
    const response = await request(app).get('/warehouses').set(JSON_HEADER)
    expect(response.header['content-type']).toContain('application/json')
    expect(response.status).toBe(200)

    expect(response.body).toMatchObject({
      data: expect.arrayContaining([
        {
          id: expect.any(Number),
          occupancy: expect.any(Number),
          capacity: expect.any(Number),
          location: expect.any(String),
          dunsNumber: expect.any(String)
        }
      ])
    })
  })
})

describe('POST /warehouses', () => {
  const dummyWarehouse: NewWarehouse = {
    capacity: faker.number.int({ min: 100, max: 1000 }),
    dunsNumber: faker.string.uuid(),
    location: faker.location.city()
  }

  it('should return 201 Created', async () => {
    const response = await request(app)
      .post('/warehouses')
      .set(JSON_HEADER)
      .send(dummyWarehouse)
    expect(response.header['content-type']).toContain('application/json')
    expect(response.status).toBe(201)
    expect(response.body.data).toMatchObject({
      id: expect.any(Number),
      occupancy: expect.any(Number),
      capacity: expect.any(Number),
      location: expect.any(String),
      dunsNumber: expect.any(String)
    })
  })

  it('should return 400 Bad Request and corripsonding zod errors', async () => {
    const response = await request(app)
      .post('/warehouses')
      .set(JSON_HEADER)
      .send({ ...dummyWarehouse, capacity: '100' })
    expect(response.header['content-type']).toContain('application/json')
    expect(response.status).toBe(400) // BAD REQUEST
    expect(response.body.error).toMatchObject({
      issues: [
        {
          code: 'invalid_type',
          expected: 'number',
          received: 'string',
          path: ['capacity'],
          message: 'Expected number, received string'
        }
      ]
    })
  })
})
