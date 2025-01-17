import { db, queryClient } from '../client'
import { type NewAddress, addresses } from '../schema/addresses'
import { type NewCustomer, customers } from '../schema/customers'
import { type NewEmployee, employees } from '../schema/employees'
import { type NewOrder, orders } from '../schema/orders'
import {
  type NewOrderPosition,
  orderPositions
} from '../schema/order-positions'
import { type NewProduct, products } from '../schema/products'
import { type NewWarehouse, warehouses } from '../schema/warehouses'

// dummy data generation witrh faker
import { faker } from '@faker-js/faker'
import { invoices, type NewInvoice } from '../schema/invoices'

const addressData: NewAddress[] = []
const warehouseData: NewWarehouse[] = []
const employeeData: NewEmployee[] = []
const productData: NewProduct[] = []
const orderData: NewOrder[] = []
const orderPositionData: NewOrderPosition[] = []
const customerData: NewCustomer[] = []
const invoiceData: NewInvoice[] = []

const addressCount = 300
const warehouseCount = 10
const employeeCount = 20
const productCount = 800
const orderCount = 0
const orderPositionCount = 0
const customerCount = 200
const invoiceCount = 0
// For Testing lower numbers
// const addressCount = 5
// const warehouseCount = 2
// const employeeCount = 5
// const productCount = 8
// const orderCount = 10
// const orderPositionCount = 30
// const customerCount = 2

const categories = ['phone', 'laptop', 'tablet', 'plant', 'shoe', 'camera']

const THUMBNAIL_BASE_URL = 'https://picsum.photos/380/380.jpg/?'
const IMAGES_BASE_URL = 'https://picsum.photos/1080/1080.jpg/?'

// generate  addresses
for (let i = 0; i < addressCount; i++) {
  addressData.push({
    street: faker.location.street(),
    city: faker.location.city(),
    zip: faker.location.zipCode()
  })
}

// generate  warehouses
for (let i = 0; i < warehouseCount; i++) {
  warehouseData.push({
    capacity: faker.number.int({ min: 1000, max: 5000 }),
    dunsNumber: faker.string.uuid(),
    location: faker.location.city()
  })
}

// generate employees
for (let i = 0; i < employeeCount; i++) {
  employeeData.push({
    name: faker.person.firstName(),
    lastName: faker.person.lastName(),
    phone: faker.phone.number(),
    hireDate: faker.date.past(),
    position: faker.person.jobTitle(),
    salary: faker.number.int({ min: 2000, max: 10000 }),
    email: faker.internet.email(),
    addressId: faker.number.int({ min: 1, max: addressCount }),
    warehouseId: faker.number.int({ min: 1, max: warehouseCount })
  })
}

// generate products
for (let i = 0; i < productCount; i++) {
  const cat = categories[Math.floor(Math.random() * categories.length)]
  productData.push({
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.number.int({ min: 1, max: 1000 }),
    stockQuantity: faker.number.int({ min: 1, max: 1000 }),
    warehouseId: faker.number.int({ min: 1, max: warehouseCount }),
    brand: faker.company.name(),
    category: cat,
    thumbnail: `${THUMBNAIL_BASE_URL}${cat}&${i}`,
    images: [
      `${IMAGES_BASE_URL}${cat}&${i}`,
      `${IMAGES_BASE_URL}${cat}&${i + 1}`,
      `${IMAGES_BASE_URL}${cat}&${i + 2}`,
      `${IMAGES_BASE_URL}${cat}&${i + 3}`,
      `${IMAGES_BASE_URL}${cat}&${i + 4}`
    ]
  })
}

// generate orders
for (let i = 0; i < orderCount; i++) {
  orderData.push({
    status: faker.word.verb(),
    totalAmount: faker.number.int({ min: 1, max: 1000 }),
    customerId: faker.number.int({ min: 1, max: customerCount })
  })
}

// generate order positions
for (let i = 0; i < orderPositionCount; i++) {
  orderPositionData.push({
    quantity: faker.number.int({ min: 1, max: 10 }),
    totalAmount: faker.number.int({ min: 1, max: 1000 }),
    orderId: faker.number.int({ min: 1, max: orderCount }),
    productId: faker.number.int({ min: 1, max: productCount })
  })
}

// generate customers
for (let i = 0; i < customerCount; i++) {
  customerData.push({
    name: faker.person.fullName(),
    lastName: faker.person.lastName(),
    phone: faker.phone.number(),
    email: faker.internet.email(),
    addressId: faker.number.int({ min: 1, max: addressCount }),
    lifetimeValue: faker.number.int({ min: 0, max: 1000 })
  })
}

// generate invoices
for (let i = 0; i < invoiceCount; i++) {
  invoiceData.push({
    dueDate: faker.date.future(),
    status: faker.word.verb(),
    orderId: faker.number.int({ min: 1, max: orderCount })
  })
}

console.table(addressData)
console.table(warehouseData)
console.table(employeeData)
console.table(customerData)
console.table(productData)
console.table(orderData)
console.table(orderPositionData)

// inserts
async function insert(): Promise<void> {
  if (addressCount > 0)
    await db.insert(addresses).values(addressData).onConflictDoNothing()
  if (warehouseCount > 0)
    await db.insert(warehouses).values(warehouseData).onConflictDoNothing()
  if (customerCount > 0)
    await db.insert(customers).values(customerData).onConflictDoNothing()
  if (employeeCount > 0)
    await db.insert(employees).values(employeeData).onConflictDoNothing()
  if (productCount > 0)
    await db.insert(products).values(productData).onConflictDoNothing()
  if (orderCount > 0)
    await db.insert(orders).values(orderData).onConflictDoNothing()
  if (orderPositionCount > 0)
    await db
      .insert(orderPositions)
      .values(orderPositionData)
      .onConflictDoNothing()
  if (invoiceCount > 0)
    await db.insert(invoices).values(invoiceData).onConflictDoNothing()
  await queryClient.end()
}

// async function insert(): Promise<void> {
//   // insert dummy data
// }

void insert()
