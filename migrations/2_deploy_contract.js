/* eslint-disable no-undef */
const Greeter = artifacts.require("Greeter");

module.exports = function (deployer) {
  deployer.deploy(Greeter, "Hello world!");
};
