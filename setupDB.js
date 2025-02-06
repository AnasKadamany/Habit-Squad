import { pool } from "./db.js";

const createTables = async () => {
  try {
    const queryText = `
      -- Users Table
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Habits Table
      CREATE TABLE IF NOT EXISTS habits (
          id SERIAL PRIMARY KEY,
          user_id INT REFERENCES users(id) ON DELETE CASCADE,
          name VARCHAR(255) NOT NULL,
          difficulty VARCHAR(50) CHECK (difficulty IN ('easy', 'medium', 'hard')),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Squads Table
      CREATE TABLE IF NOT EXISTS squads (
          id SERIAL PRIMARY KEY,
          habit_name VARCHAR(255) NOT NULL,
          difficulty VARCHAR(50) CHECK (difficulty IN ('easy', 'medium', 'hard')),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Squad Members Table
      CREATE TABLE IF NOT EXISTS squad_members (
          id SERIAL PRIMARY KEY,
          squad_id INT REFERENCES squads(id) ON DELETE CASCADE,
          user_id INT REFERENCES users(id) ON DELETE CASCADE,
          joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Streaks Table
      CREATE TABLE IF NOT EXISTS streaks (
          id SERIAL PRIMARY KEY,
          user_id INT REFERENCES users(id) ON DELETE CASCADE,
          habit_id INT REFERENCES habits(id) ON DELETE CASCADE,
          squad_id INT REFERENCES squads(id) ON DELETE CASCADE,
          current_streak INT DEFAULT 0,
          best_streak INT DEFAULT 0,
          last_checked DATE DEFAULT CURRENT_DATE
      );

      -- Check-Ins Table
      CREATE TABLE IF NOT EXISTS check_ins (
          id SERIAL PRIMARY KEY,
          user_id INT REFERENCES users(id) ON DELETE CASCADE,
          habit_id INT REFERENCES habits(id) ON DELETE CASCADE,
          squad_id INT REFERENCES squads(id) ON DELETE CASCADE,
          checked_at DATE DEFAULT CURRENT_DATE
      );
    `;

    await pool.query(queryText);
    console.log("✅ Tables created successfully!");
    process.exit();
  } catch (error) {
    console.error("Error creating tables:", error);
    process.exit(1);
  }
};

// Run the function to create tables
createTables();
