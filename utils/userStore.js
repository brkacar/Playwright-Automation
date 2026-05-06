// utils/userStore.js
import fs from 'node:fs/promises';
import path from 'node:path';

const filePath = path.join(process.cwd(), 'test-data', 'created-users.json');

export async function saveCreatedUser(user) {
  let users = [];

  try {
    const file = await fs.readFile(filePath, 'utf-8');
    users = JSON.parse(file);
  } catch (error) {
    users = [];
  }

  users.push(user);

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(users, null, 2), 'utf-8');
}