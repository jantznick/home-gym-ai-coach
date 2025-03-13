import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const getAll = async (table) => {
  try {
    return await prisma[table].findMany()
  } catch (error) {
    console.error(`Error fetching all ${table}:`, error)
    return []
  }
}

const create = async (table, data) => {
  try {
    return await prisma[table].create({
      data,
    })
  } catch (error) {
    console.error(`Error creating ${table}:`, error)
    return null
  }
}

const updateByQuery = async (table, where, update) => {
  try {
    return await prisma[table].update({
      where,
      data: update,
    })
  } catch (error) {
    console.error(`Error updating ${table}:`, error)
    return null
  }
}

const findByQuery = async (table, where, select) => {
  try {
    return await prisma[table].findMany({
      where,
      select,
    })
  } catch (error) {
    console.error(`Error finding ${table}:`, error)
    return []
  }
}

// Specific Functions
export const getAllExercises = async () => await getAll('exercise')
export const getAllUsers = async () => await getAll('user')

export const createExercise = async (exercise) =>
  await create('exercise', exercise)
export const createUser = async (user) => await create('user', user)

export const updateUserByQuery = async (query, update) =>
  await updateByQuery('user', query, update)

export const updateExercise = async ({ id, update }) =>
  await updateByQuery('exercise', { id }, update)

export const getUserByQuery = async (query, projection) =>
  await findByQuery('user', query, projection)

export const getExercisesByQuery = async (query) =>
  await findByQuery('exercise', query)

export const getExercisesByAggregation = async (query) => {
  console.warn('Aggregation is not natively supported in Prisma. Use raw SQL or refactor logic.')
  return []
}