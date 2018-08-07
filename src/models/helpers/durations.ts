export const toDate = (duration: string) => {
  let from
  const to = new Date()

  switch (duration) {
    case 'ALL':
      from = new Date(1900) // Far away date
      break
    case 'YEAR':
      from = new Date(to.getFullYear(), 0, 1)
      break
    case 'MONTH':
      from = new Date(to.getFullYear(), to.getMonth())
      break
    case 'DAY':
      from = new Date()
      break
  }

  return {
    from,
    to
  }
}
