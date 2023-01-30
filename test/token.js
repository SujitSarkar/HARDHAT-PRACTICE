const { inputToConfig } = require("@ethereum-waffle/compiler");
const {expect} = require("chai");

describe("Token Contract",function(){
    let Token;
    let hardhatToken;
    let owner;
    let address1;
    let address2;
    let address3;

    beforeEach(async function(){
        Token = await ethers.getContractFactory("Token");
        [owner, address1, address2, ...address3] = await ethers.getSigners();
        hardhatToken = await Token.deploy();
    });

    describe("Deployment", function(){
        it("Should set the right owner", async function(){
            expect(await hardhatToken.owner()).to.equal(owner.address);
        });

        it("Should assign the total supply of tokens to the owner", async function(){
            const ownerBalance = await hardhatToken.balanceOf(owner.address);
            expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
        });
    });

    describe("Transactions", function(){
        it("Should transfer token between accounts", async function(){
            //Owner account to address1.address
            await hardhatToken.transfer(address1.address, 10);
            const address1Balance = await hardhatToken.balanceOf(address1.address);
            expect(address1Balance).to.equal(10);

            //address1.address to address2.address
            await hardhatToken.connect(address1).transfer(address2.address, 10);
            const address2Balance = await hardhatToken.balanceOf(address2.address);
            expect(address2Balance).to.equal(10);
        });

        it("Should fail if sender doesn't have enough tokens", async function(){
            const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);
            await expect(hardhatToken.connect(address1).transfer(owner.address,1)).to.be.revertedWith("Not enough tokens");
            expect(await hardhatToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);
        });

        it("Should update balance after transfer", async function(){
            const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);
            await hardhatToken.transfer(address1.address, 5);
            await hardhatToken.transfer(address2.address, 10);

            const finalOwnerBalnace = await hardhatToken.balanceOf(owner.address);
            expect(finalOwnerBalnace).to.equal(initialOwnerBalance-15);

            const address1Balance = await hardhatToken.balanceOf(address1.address);
            expect(address1Balance).to.equal(5);

            const address2Balance = await hardhatToken.balanceOf(address2.address);
            expect(address2Balance).to.equal(10);
        });
    });
});

// describe("Token contract", function(){
//     it("Deployment should assign the total supply of tokens to the owner", async function(){
//         const [owner] = await ethers.getSigners();
//         console.log("Signers object: ",owner);

//         const Token = await ethers.getContractFactory("Token");
//         const hardhatToken = await Token.deploy();

//         const ownerBalance = await hardhatToken.balanceOf(owner.address);
//         console.log("Owner Address: ", owner.address);

//         expect(await hardhatToken.totalSupply()).to.equal(10000);
//     });


//     it("Should transfer token between accounts", async function(){
//         const [owner, address1, address2] = await ethers.getSigners();

//         const Token = await ethers.getContractFactory("Token");
//         const hardhatToken = await Token.deploy();

//         //Transfer 10 token from owner to address1
//         await hardhatToken.transfer(address1.address, 10);
//         expect(await hardhatToken.balanceOf(address1.address)).to.equal(10);

//         //Transfer 10 token from address1 to address2
//         await hardhatToken.connect(address1).transfer(address2.address,5);
//         expect(await hardhatToken.balanceOf(address2.address)).to.equal(5);
//     });
// });