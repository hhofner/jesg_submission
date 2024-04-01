import { open } from 'sqlite'
import sqlite3 from 'sqlite3'

const db = await open({
  filename: './app/data/db.sqlite',
  driver: sqlite3.Database,
})

await db.exec('CREATE TABLE submissions ( id INTEGER PRIMARY KEY AUTOINCREMENT, time_inputted DATETIME DEFAULT CURRENT_TIMESTAMP, verifier TEXT, verifier_name TEXT, verification_standard TEXT, other_standard_text TEXT, assurance_level TEXT, scope_verification TEXT, disclosure_info_file TEXT, disclosure_info_url TEXT, scoring TEXT )')

// const stmt = await db.prepare('INSERT INTO posts (id, title) VALUES (?, ?)')
//
// stmt.run(1, 'First')
// stmt.run(2, 'Second')
// stmt.run(3, 'Third')
// stmt.run(4, 'Fourth')
// stmt.run(5, 'Fifth')
//
// await stmt.finalize()
await db.close()

