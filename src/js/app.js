import Product from './Product';
import image from '../image/Edit_icon_(the_Noun_Project_30184).svg.png';

const addButton = document.querySelector('.header__add a');
const modalForm = document.querySelector('.modal-form');
const buttonCancel = document.querySelector('.button-cancel');
const productsNode = document.querySelector('.products');

const formName = document.querySelector('#form__name');
const formPrice = document.querySelector('#form__price');

const inputs = [];

inputs.push(formName, formPrice);

const error = document.createElement('div');
error.className = 'form-error';

inputs.forEach((input) => {
  input.addEventListener('input', () => {
    error.remove();
  });
});

let products = [];

let productId;

function openEditModal(event) {
  event.preventDefault();
  modalForm.classList.toggle('active');
  formName.value = event.target.closest('.row').querySelector('.row__name').textContent;
  formPrice.value = event.target.closest('.row').querySelector('.row__price').textContent;
  productId = parseInt(event.target.closest('.row').dataset.id, 10);
}

function showProducts() {
  productsNode.innerHTML = '';
  products.forEach((product) => {
    productsNode.innerHTML += `
      <div class="row" data-id="${product.id}">
          <div class="row__column row__name">${product.name}</div>
          <div class="row__column row__price">${product.price}</div>
          <div class="row__column row__act">
              <a href="#" class="edit"><img src="${image}" alt=""></a>
              <a href="#" class="delete">x</a>
          </div>
      </div>
    `;
  });
  Array.from(document.querySelectorAll('.edit')).forEach((btn) => {
    btn.addEventListener('click', openEditModal);
  });
  Array.from(document.querySelectorAll('.delete')).forEach((btn) => {
    btn.addEventListener('click', (event) => {
      productId = parseInt(event.target.closest('.row').dataset.id, 10);
      products = products.filter((product) => product.id !== productId);
      showProducts();
      event.preventDefault();
      productId = undefined;
    });
  });
}

function openModal(event) {
  event.preventDefault();
  modalForm.classList.toggle('active');
}

function closeModal() {
  modalForm.classList.toggle('active');
}

function chekValidityPrice(price) {
  const value = parseInt(price.value, 10);
  if (value && value > 0) {
    return true;
  }
  return false;
}

function addProduct(newName, newPrice) {
  if (productId) {
    products.forEach((product, index) => {
      if (product.id === productId) {
        const prod = new Product(newName, newPrice, productId);
        products[index] = { ...prod };
        productId = undefined;
      }
    });
  } else {
    const product = new Product(newName, newPrice);
    console.log(product);
    products.push(product);
    console.log(products);
  }
}

function saveProduct(event) {
  event.preventDefault();

  const isValid = event.currentTarget.checkValidity();
  if (!isValid) {
    const first = [...modalForm.elements].find((o) => !o.validity.valid);
    first.focus();
    error.textContent = 'Ведите значение';
    first.closest('.form__row').appendChild(error);
    error.style.top = `${first.offsetTop + first.offsetHeight / 2 - error.offsetHeight / 2}px`;
    error.style.left = `${first.offsetLeft + first.offsetWidth}px`;
  } else if (!chekValidityPrice(formPrice)) {
    formPrice.focus();
    error.textContent = 'Допускаются только цифры';
    formPrice.closest('.form__row').appendChild(error);
    error.style.top = `${formPrice.offsetTop + formPrice.offsetHeight / 2 - error.offsetHeight / 2}px`;
    error.style.left = `${formPrice.offsetLeft + formPrice.offsetWidth}px`;
  } else {
    addProduct(formName.value, parseInt(formPrice.value, 10));
    modalForm.classList.toggle('active');
    showProducts();
    formName.value = '';
    formPrice.value = '';
  }
}

addButton.addEventListener('click', openModal);

buttonCancel.addEventListener('click', closeModal);

modalForm.addEventListener('submit', saveProduct);
