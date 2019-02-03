pragma solidity ^0.5.0;

import "./Administrable.sol";

/**
 * @title WhiteList
 * @dev The WhiteList shows who can buy a token
 */
contract WhiteList is Administrable {
    mapping (address => bool) public whitelist;
    event AddToWhiteList(address investor);
  	event RemoveFromWhiteList(address investor);

	  function addToWhiteList(address _address) onlyAdministrator public {
	    emit AddToWhiteList(_address);
	    whitelist[_address] = true;
	  }

	  function removeFromWhiteList(address _address) onlyAdministrator public {
	    emit RemoveFromWhiteList(_address);
	    whitelist[_address] = false;
	  }

	  function onWhitelist(address _address) public view returns (bool) {
	    return whitelist[_address];
	  }
}