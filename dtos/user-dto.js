module.exports = class UserDto {
  email;
  username;
  id;
  isActivated;

  constructor(user) {
    this.email = user.email;
    this.username = user.username;
    this.id = user.id;
    this.isActivated = user.isactivated;
  }
}