pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/token/ERC20/StandardToken.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract C50Test4 is StandardToken, Ownable {
    string public constant name = "C50 fourth test token";
    string public constant symbol = "C50Test4";
    uint8 public constant decimals = 18;
    uint256 public constant TOTAL_SUPPLY = 21000000 * (10 ** uint256(decimals));

    function C50Test4() public {
        totalSupply_ = TOTAL_SUPPLY;
        balances[msg.sender] = TOTAL_SUPPLY;
        Transfer(0x0, msg.sender, TOTAL_SUPPLY);
    }
}