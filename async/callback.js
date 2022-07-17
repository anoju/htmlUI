'use strict';

// JavaScript is synchronous.
// Execute the code block by orger after hoisting.
// hoisting: var, function declatation
console.log(1);
setTimeout(() => {
  console.log(2);
}, 1000)
console.log(3);

// Synchronous callback
function printImmediately(print) {
  print();
}
printImmediately(() => console.log('hello'));

// Asynchronous callback
function printWidthDelay(print, delay) {
  setTimeout(print, delay);
}
printWidthDelay(() => console.log('async callback'), 2000);


// Callback Hell example
class UserStorage {
  loginUser(id, password, onSuccess, onError) {
    setTimeout(() => {
      if (
        (id === 'qwer' && password === '1234') ||
        (id === 'tyui' && password === '5678')
      ) {
        onSuccess(id);
      } else {
        onError(new Error('not found'));
      }
    }, 2000);
  }

  getRoles(user, onSuccess, onError) {
    setTimeout(() => {
      if (user === 'qwer') {
        onSuccess({
          name: 'qwer',
          role: 'admin'
        });
      } else {
        onError(new Error('not access'));
      }
    }, 2000);
  }
}

const userStorage = new UserStorage();
const id = prompt('enter your id');
const password = prompt('enter your password');
userStorage.loginUser(id, password, user => {
  userStorage.getRoles(user, roles => {
    // console.log(roles);
    alert(`Hello ${roles.name}, your role is ${roles.role}`);
  }, error => {
    console.log(error);
  });
}, error => {
  console.log(error)
})