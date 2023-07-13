import chalk from 'chalk'
import bcrypt from 'bcryptjs'
import setupDB from './db.js'
import {ROLES} from '../constants/index.js'
import User from '../models/user.js'

const args = process.argv.slice(2);
const email = args[0];
const password = args[1];

export const seedDB = async () => {
  try {
    console.log(`${chalk.blue('✓')} ${chalk.blue('seed db started')}`);

    if (!email || !password) throw new Error('missing arguments');

    const user = new User({
      email,
      password,
      firstName: 'admin',
      lastName: 'admin',
      role: ROLES.Admin
    });

    const existingUser = await User.findOne({ email: user.email });
    console.log('existingUser', existingUser);
    if (existingUser) throw new Error('user collection is seeded!');

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;

    await user.save();

    console.log(`${chalk.green('✓')} ${chalk.green('seed db finished')}`);
  } catch (error) {
    console.log(
      `${chalk.red('x')} ${chalk.red('error while seeding database')}`
    );
    console.log(error);
    return null;
  }
};

(async () => {
  await setupDB().then(async () => {
    await seedDB();
  });
})();
