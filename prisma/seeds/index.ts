import AccountsSeed from './accounts.seed'

// Lista de seeds
const seeds = [new AccountsSeed()]

async function applySeeds() {
  for await (const seed of seeds) {
    console.log(`Running seed: ${seed.constructor.name}`)
    await seed.seed()
  }
}

// Execução principal
applySeeds()
  .then(() => {
    console.log('All seeds executed successfully')
    process.exit(0)
  })
  .catch((err) => {
    console.error('Error executing seeds:', err)
    process.exit(1)
  })
