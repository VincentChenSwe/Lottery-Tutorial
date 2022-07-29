# Tutorial

1. Forking
   1. dotenv
   2. make an infura account
   3. add forking to the hardhat.config
   4. set chainId to 4
2. import to contract
   1. npm i @api3/airnode-protocol
   2. import rrp
   3. set contract interface
   4. rewrite constructor
3. Rewrite tests
   1. get chainId
   2. get contract address and pass it into deploy function
4. Add airnode varibables to contract
   1. airnode address
   2. empty sponsor address
   3. endpointID
5. Set sponsor
   1. Make contract ownable
      1. Import Ownable
   2. make function that sets the sponsor
   3. make function ownable
   4. test
6. Rewrite tests
   1. Install and import @api3/airnode-admin
   2. write set sponsorwallet test
   3. derive sponsor wallet using airnode admin
   4. pass into set sponsor function
7. Write get winning number functions
   1. require lottery ended
   2. require sponsor wallet top up
   3. make request full request and store request id
   4. pay sponsor wallet
8. rewrite closeweek function
   1. handle requestIds
   2. decode random number
   3. add onlyAirnodeRrp
9. Rewrite tests
   1.  user enters 1-65535
10. nvm should be scripts
11. nvm should be hardhat-deploy
    1.  install hardhat-deploy
        1.  add require('hardhat-deploy'); to config
    2.  make deploy folder
    3.  make file 1_deploy.js
    4.  make 2_set_sponsorwallet.js
    5.  start hardhat node
    6.  deploy
12. Make enter script
    1.  




Dont repeat comments
