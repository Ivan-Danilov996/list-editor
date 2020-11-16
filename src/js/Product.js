export default class Product {
  constructor(name, price, id = Date.now()) {
    this.name = name;
    this.price = price;
    this.id = id;
  }
}
