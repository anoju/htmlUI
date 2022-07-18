'use strict';

// async & await
//  cleart style of using promise

// 1. async
async function fetchUser() {
  return 'anoju';

  // promise
  // return new Promise((resolve, reject) => {
  //   resolve('anoju')
  // })
}

const user = fetchUser();

// console.log(user);

// promise, async
user.then(console.log);

// 2. await
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getApple() {
  await delay(1000);
  // throw 'error';
  return '사과';
}

async function getBanana() {
  await delay(1000);
  return '바나나';
}

// function pickFruits() {
//   return getApple().then(apple => {
//     return getBanana().then(banana => {
//       return `${apple} + ${banana}`
//     })
//   })
// }

async function pickFruits() {
  // const apple = await getApple();
  // const banana = await getBanana();

  const applePromise = getApple();
  const bannaPromise = getBanana();
  const apple = await applePromise;
  const banana = await bannaPromise;

  return `${apple} + ${banana}`;
}

pickFruits().then(console.log);


// 3. useful APIs
function pickAllFuruits() {
  return Promise.all([getApple(), getBanana()]).then(fruits => fruits.join(' + '));
}

pickAllFuruits().then(console.log);


function pickOnlyOne() {
  return Promise.race([getApple(), getBanana()])
}

pickOnlyOne().then(console.log);



// promise to async
class UserStorage {
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async loginUser(id, password) {
    await this.delay(2000);
    if (
      (id === 'qwer' && password === '1234') ||
      (id === 'tyui' && password === '5678')
    ) {
      return id;
    } else {
      throw 'not found';
    }
  }

  async getRoles(user) {
    await this.delay(2000);
    if (user === 'qwer') {
      return {
        name: 'qwer',
        role: 'admin'
      };
    } else {
      throw 'not access';
    }
  }
}


async function findUserRole() {
  const userStorage = new UserStorage();
  const id = prompt('enter your id');
  const password = prompt('enter your password');
  const user = await userStorage.loginUser(id, password);
  const roles = await userStorage.getRoles(user);
  return roles;
}

findUserRole()
  .then(roles => alert(`Hello ${roles.name}, your role is ${roles.role}`))
  .catch(console.log)