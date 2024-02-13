export const ERRORS = {
  email: 'The email address is invalid, please check it.',
  zip: 'Please enter a valid zip code.',
  phone: 'Please enter a valid phone number.',
  quantity: 'The quantity must be at least 1.',
  positiveNumber: 'The number must be positive.',
  integer: 'Must be an integer.',
  nothingToUpdate: 'Nothing to update.',
  notFoundbyId: (id: string) => `No entry found with id ${id}.`
} as const
