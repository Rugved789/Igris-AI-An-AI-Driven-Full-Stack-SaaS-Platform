import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

app.get('/', async (req, res) => {
  try {
    const [result] = await sql`SELECT version()`;
    const version = result?.version || 'No version found';
    res.json({ version });
  } catch (error) {
    console.error('Database query failed:', error);
    res.status(500).json({ error: 'Failed to connect to the database.' });
  }
});

export default sql;