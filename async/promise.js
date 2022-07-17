'use strict';

// promise is a JavaScript object for asynchronous operation.
// State: pending -> fulfilled or rejected
// Producer vs Consumer

// 1.Producer
// when new Promise is created, the executor runs automatically.
const $promise = new Promise((resolve, reject) => {
  // doing some heavy work (network, read files)
  // resolve(value)
  // reject(error)
  console.log('doing something...')
  setTimeout(() => {
    resolve('anoju')
    reject(new Error('no network'))
  }, 2000);
});

// 2. Comsumers: then, catch, finally
$promise
  .then(value => {
    // 성공
    console.log(value)
  })
  .catch(error => {
    // 실패
    console.log(error)
  })
  .finally(() => {
    // 성공이든 실패든 다 수행 후
    console.log('finally')
  })

// 3. Promise chaing
const $fetchNumber = new Promise((resolve, reject) => {
  setTimeout(() => resolve(1), 1000);
});

$fetchNumber
  .then(num => num * 2)
  .then(num => num * 3)
  .then(num => {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(num - 1), 1000);
    });
  })
  .then(num => console.log(num));

// 4. Error Handling
const getHen = () => new Promise((resolve, reject) => {
  setTimeout(() => resolve('닭'), 1000);
});
const getEgg = hen => new Promise((resolve, reject) => {
  // setTimeout(() => resolve(`${hen} => 알`), 1000);
  setTimeout(() => reject(new Error(`error! ${hen} => 알`)), 1000);
});
const cook = egg => new Promise((resolve, reject) => {
  setTimeout(() => resolve(`${egg} => 계란후라이`), 1000);
});

// getHen()
//   .then(hen => getEgg(hen))
//   .then(egg => cook(egg))
//   .then(meal => console.log(meal));

getHen()
  .then(getEgg)
  .catch(error => {
    return '빵'
  })
  .then(cook)
  .then(console.log)
  .catch(console.log);

// callback to promise
class UserStorage {
  loginUser(id, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (
          (id === 'qwer' && password === '1234') ||
          (id === 'tyui' && password === '5678')
        ) {
          resolve(id);
        } else {
          reject(new Error('not found'));
        }
      }, 2000);
    })

  }

  getRoles(user) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (user === 'qwer') {
          resolve({
            name: 'qwer',
            role: 'admin'
          });
        } else {
          reject(new Error('not access'));
        }
      }, 2000);
    });
  }
}

const userStorage = new UserStorage();
const id = prompt('enter your id');
const password = prompt('enter your password');
userStorage.loginUser(id, password)
  .then(user => userStorage.getRoles(user))
  .then(user => alert(`Hello ${user.name}, your role is ${user.role}`))
  .catch(console.log)