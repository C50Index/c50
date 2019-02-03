pragma solidity ^0.5.0;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

/**
 * @title Administrable
 */
contract Administrable is Ownable {
  mapping (address => bool) public administrators;
  event AddAdministrator(address administrator);
  event RemoveAdministrator(address administrator);

  /**
   * @dev Throws if an account that is not an admin
   */
  modifier onlyAdministrator() {
    require(msg.sender == owner() || isAdministrator(msg.sender));
    _;
  }

  function isAdministrator(address _address) public view returns (bool) {
    return administrators[_address];
  }

  function addAdministrator(address _address) onlyAdministrator public {
    emit AddAdministrator(_address);
    administrators[_address] = true;
  }

  function removeAdministrator(address _address) onlyAdministrator public {
    emit RemoveAdministrator(_address);
    administrators[_address] = false;
  }

}
