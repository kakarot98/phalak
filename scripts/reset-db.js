const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔄 Resetting database with new Card schema...\n');

// Step 1: Delete old database files
const dbPath = path.join(__dirname, '..', 'prisma', 'dev.db');
const journalPath = path.join(__dirname, '..', 'prisma', 'dev.db-journal');

try {
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('✅ Deleted old database file');
  }
  if (fs.existsSync(journalPath)) {
    fs.unlinkSync(journalPath);
    console.log('✅ Deleted journal file');
  }
} catch (error) {
  console.error('❌ Error deleting database files:', error.message);
  console.log('Please close any applications using the database and try again.');
  process.exit(1);
}

// Step 2: Run prisma db push to create new schema
try {
  console.log('\n📊 Creating new database with Card schema...');
  execSync('npx prisma db push --skip-generate', {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  console.log('✅ Database schema created');
} catch (error) {
  console.error('❌ Error creating schema:', error.message);
  process.exit(1);
}

// Step 3: Generate Prisma Client
try {
  console.log('\n🔨 Generating Prisma Client...');
  execSync('npx prisma generate', {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  console.log('✅ Prisma Client generated');
} catch (error) {
  console.error('❌ Error generating client:', error.message);
  process.exit(1);
}

console.log('\n✨ Database reset complete!');
console.log('Next step: Update seed script and run `npx prisma db seed`\n');
