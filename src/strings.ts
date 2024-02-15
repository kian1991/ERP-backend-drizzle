export const ERRORS = {
  invalidPage: 'The page number is invalid.',
  email: 'The email address is invalid, please check it.',
  emailNotInDb: 'No Account found with this credentials.',
  zip: 'Please enter a valid zip code.',
  phone: 'Please enter a valid phone number.',
  quantity: 'The quantity must be at least 1.',
  positiveNumber: 'The number must be positive.',
  integer: 'Must be an integer.',
  nothingToUpdate: 'Nothing to update.',
  notFoundbyId: (id: string) => `No entry found with id ${id}.`
} as const
