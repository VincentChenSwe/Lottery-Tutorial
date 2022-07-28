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