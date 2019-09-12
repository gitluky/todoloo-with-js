function createUser() {
  let userId = 0;
  return class {
    constructor(args) {
      for (let i = 0; i < keys(args).length; i++) {
        this[keys(args)[i]] = values(args)[i];
      }
    }
  }
}
