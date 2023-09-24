// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract ExchangeRateBetting {
    AggregatorV3Interface internal priceFeed;

    struct Bet {
        uint256 amount;
        uint256 betRate;
        bool above;
        bool settled;
        bool won;
    }

    mapping(address => Bet) public bets;

    constructor() {
        priceFeed = AggregatorV3Interface(0x91FAB41F5f3bE955963a986366edAcff1aaeaa83);
    }

    function placeBet(uint256 betRate, bool above) public payable {
        require(msg.value > 0, "Bet amount must be greater than 0");
        require(bets[msg.sender].amount == 0, "Unsettled bet exists");

        bets[msg.sender] = Bet({
            amount: msg.value,
            betRate: betRate,
            above: above,
            settled: false,
            won: false
        });
    }

    function settleBet() public {
        Bet storage bet = bets[msg.sender];
        require(bet.amount > 0, "No bet placed");
        require(!bet.settled, "Bet already settled");

        (,int price,,,) = priceFeed.latestRoundData();
        bet.settled = true;
        if ((bet.above && price > int(bet.betRate)) || (!bet.above && price < int(bet.betRate))) {
            bet.won = true;
            payable(msg.sender).transfer(bet.amount * 2);
        }
    }
}
