const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://mongo1:17017');

const userExistsErrorCode = 51003;

async function run() {
  try {
    await client.connect();
    const admin = client.db('admin');

    try {
      await admin.addUser(
        'root',
        'root',
        {
          roles: [
            {
              role: 'root',
              db: 'admin'
            }
          ]
        }
      );
    } catch (e) {
      if (e.code !== userExistsErrorCode) {
        throw e;
      }
    }

    const postsDb = client.db('posts');
    await postsDb.collection('_info').insertOne({ created_at: new Date() });
    try {
      await postsDb.addUser(
        'sn',
        'password',
        {
          roles: [
            {
              role: 'readWrite',
              db: 'admin',
            },
          ],
        },
      );
    } catch (e) {
      if (e.code !== userExistsErrorCode) {
        throw e;
      }
    }
  } finally {
    await client.close();
  }
}

run()
  .then(() => console.log('user crated'))
  .catch(console.dir);