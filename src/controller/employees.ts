import { db } from '../../db/client'
import { employees, type Employee, type NewEmployee } from '../../db/schema'
import { eq } from 'drizzle-orm'

export async function getEmployees(): Promise<Employee[]> {
  const employeesResult: Awaited<Employee[]> =
    await db.query.employees.findMany()
  return employeesResult
}

export async function getEmployee(id: number): Promise<Employee> {
  const [employee]: Awaited<Employee[]> = await db.query.employees.findMany({
    where: eq(employees.id, id)
  })
  return employee
}

export async function insertEmployee(employee: NewEmployee): Promise<Employee> {
  const [inserted]: Awaited<Employee[]> = await db
    .insert(employees)
    .values(employee)
    .returning()
  return inserted
}

export async function updateEmployee(
  id: number,
  employee: Partial<Employee>
): Promise<Employee> {
  const [updated]: Awaited<Employee[]> = await db
    .update(employees)
    .set({ ...employee, updatedAt: new Date() })
    .where(eq(employees.id, id))
    .returning()
  return updated
}

export async function deleteEmployee(id: number): Promise<Employee> {
  const [deleted]: Awaited<Employee[]> = await db
    .delete(employees)
    .where(eq(employees.id, id))
    .returning()
  return deleted
}
