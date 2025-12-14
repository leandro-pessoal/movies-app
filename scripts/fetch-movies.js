import * as api from '../src/utils/network-data.js';

function printHelp() {
  console.log('Usage: node scripts/fetch-movies.js <functionName> [args...]');
  console.log('Available functions:');
  Object.keys(api)
    .filter((k) => typeof api[k] === 'function')
    .forEach((name) => console.log(`  - ${name}`));
}

async function run() {
  const [, , fn, ...args] = process.argv;
  if (!fn) {
    printHelp();
    process.exit(1);
  }

  const func = api[fn];
  if (!func || typeof func !== 'function') {
    console.error(`Function "${fn}" not found in API module.`);
    printHelp();
    process.exit(1);
  }

  try {
    console.log(`Calling ${fn} with args:`, args);
    // Parse arguments conservatively: convert numbers and booleans
    const parsedArgs = args.map((a) => {
      if (a === 'true') return true;
      if (a === 'false') return false;
      if (a === 'null') return null;
      if (a === 'undefined') return undefined;
      if (a && !Number.isNaN(Number(a))) return Number(a);
      return a;
    });
    const result = await func(...parsedArgs);
    console.log('--- Response (raw) ---');
    console.dir(result, { depth: null, colors: true });
  } catch (err) {
    console.error('Error calling API:', err);
    process.exit(1);
  }
}

run();
