/* eslint-disable @typescript-eslint/no-misused-promises */
// employees
import { Router } from 'express'
import { type Employee, insertEmployeeSchema } from '../../db/schema'
import {
  deleteEmployee,
  getEmployee,
  getEmployees,
  insertEmployee,
  updateEmployee
} from '../controller/'
import { ERRORS } from '../strings'
import { numeric } from '../util/type-conversions'
import { handleZodError } from '../util/zod-errorhandler'

export const employeeRouter = Router()

employeeRouter.post('/', async (req, res) => {
  try {
    const newEmployee = insertEmployeeSchema.parse(req.body)
    const createdEmployee: Employee = await insertEmployee(newEmployee)
    res.status(201).json({ data: createdEmployee })
  } catch (error: unknown) {
    handleZodError(error, res)
  }
})

employeeRouter.get('/', async (req, res) => {
  try {
    const employees: Employee[] = await getEmployees()
    res.status(200).json({ data: employees })
  } catch (error: unknown) {
    handleZodError(error, res)
  }
})

employeeRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const employee: Employee = await getEmployee(numeric.parse(id))
    if (employee === undefined) {
      res.status(404).json({ error: { message: ERRORS.notFoundbyId(id) } })
      return
    }
    res.status(200).json({ data: employee })
  } catch (error: unknown) {
    handleZodError(error, res)
  }
})

employeeRouter.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const employee: Partial<Employee> = insertEmployeeSchema
      .partial()
      .parse(req.body)

    if (Object.keys(employee).length === 0) {
      res.status(400).json({ error: { message: ERRORS.nothingToUpdate } })
      return
    }

    const updatedEmployee: Employee = await updateEmployee(
      numeric.parse(id),
      employee
    )
    res.status(200).json({ data: updatedEmployee })
  } catch (error: unknown) {
    handleZodError(error, res)
  }
})

employeeRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const employee: Employee = await deleteEmployee(numeric.parse(id))
    res.status(200).json({ data: employee })
  } catch (error: unknown) {
    handleZodError(error, res)
  }
})
