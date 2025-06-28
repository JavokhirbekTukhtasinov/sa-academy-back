const fs = require('fs');
const fetch = require('node-fetch');

const GRAPHQL_ENDPOINT = 'http://localhost:8080/graphql';
const OUTPUT_PATH = 'src/schema.gql';

async function fetchSchema() {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `{
          _service { sdl }
        }`
      })
    });
    const result = await response.json();
    if (result.data && result.data._service && result.data._service.sdl) {
      fs.writeFileSync(OUTPUT_PATH, result.data._service.sdl, 'utf8');
      console.log('Schema saved to', OUTPUT_PATH);
    } else {
      throw new Error('Could not fetch schema SDL. Response: ' + JSON.stringify(result));
    }
  } catch (err) {
    console.error('Failed to fetch schema:', err.message);
    process.exit(1);
  }
}

fetchSchema(); 