pragma solidity 0.4.19;

import './C50.sol';
import 'zeppelin-solidity/contracts/crowdsale/validation/TimedCrowdsale.sol';
import 'zeppelin-solidity/contracts/crowdsale/validation/CappedCrowdsale.sol';
import 'zeppelin-solidity/contracts/crowdsale/emission/AllowanceCrowdsale.sol';


contract C50Crowdsale is TimedCrowdsale, CappedCrowdsale, AllowanceCrowdsale {
    function C50Crowdsale
        (
            uint256 _openingTime,
            uint256 _closingTime,
            uint256 _rate,
            address _wallet,
            uint256 _cap,
            address _tokenWallet,
            ERC20 _token
        )
        public
        Crowdsale(_rate, _wallet, _token)
        CappedCrowdsale(_cap)
        AllowanceCrowdsale(_tokenWallet)
        TimedCrowdsale(_openingTime, _closingTime) {

        }
}