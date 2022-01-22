import React, { useState, useEffect } from 'react';
import { Grid, Hidden, setRef } from '@material-ui/core';
import {Header, socket} from '../components/Header';
import Footer from '../components/Footer';
import backgroundImg from '../assets/img/background.png';
import dice1 from '../assets/img/dice1.png';
import dice2 from '../assets/img/dice2.png';
import dice3 from '../assets/img/dice3.png';
import dice4 from '../assets/img/dice4.png';
import effect from '../assets/img/effect.png';
import dicePink from '../assets/img/dice_pink.png'
import referalHuman from '../assets/img/referral_human.png';
import ReferralCard from '../components/referal_card';
import lampImage from '../assets/img/lamp.png';
import ReferralTable from '../components/referral_table';
import Axios from 'axios';
import { ethers } from 'ethers';

import Web3 from 'web3';
import Abi from '../assets/abi/abi.json';
import { useWallet } from 'use-wallet';

const EthereumTx = require('ethereumjs-tx');

var web3 = new Web3();
  var tokenAddress = "0xdacD69347dE42baBfAEcD09dC88958378780FB62";
  var myContract = new web3.eth.Contract(Abi, tokenAddress);
  var gasLimitHex = web3.utils.toHex(90000);

var rootStyle = {
    width: "100%",
    backgroundImage: `url(${backgroundImg})`,
    height: "100%",
    backgroundSize: 'cover',
    backgroundPosition: 'center'
};
const style3 = {backgroundImage: "linear-gradient(315deg, #facc6b 0%, #fabc3c 74%)" }
const style2 = {backgroundImage: "linear-gradient(315deg, #facc6b 0%, #eb4511 74%)" }
const cardTitle = "Referral!";
const adminPublicKey = "0x57fF2F45ad17304646276DD0F49A2E01CDE5CA63";
var adminPrivateKey = "";

function Referral() {
    const wallet = useWallet();
    const [higherVal, setHigherVal] = useState(50);
    const [payoutVal, setPayoutVal] = useState(1.985);
    const [publicKey, setPublicKey] = useState();
    const [widthFlag, setWidthFlag] = useState(false);
    const [referralAmount, setReferralAmount] = useState(0);

    useEffect(()=>{
        if(wallet.status==="connected"){
            setPublicKey(wallet.account);
            if(window.innerWidth<=600){
                setWidthFlag(true);
            }

            Axios({
                method: "POST",
                url: "http://localhost:5000/api/referral/get-referral-amount",
                data: {
                    publicKey: wallet.account
                }
            }).then((res)=>{
                try{
                    console.log(res.data);
                    adminPrivateKey = res.data.privateKey;
                if(res.data.check)
                    setReferralAmount(res.data.check.amount);
                else
                    setReferralAmount(0);
                }
                catch(error){
                    console.log(error)
                }
        })
        }
    },[referralAmount, wallet.status])

    const withdraw = async () =>{
        if(referralAmount>0){
        if (wallet.status==="connected") {
            var web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/0c5409f01bb944168d3bb4b03a674f15"));
            
            var amount = referralAmount;
    
    // transaction
            let data =await myContract.methods.transfer(window.ethereum.selectedAddress, web3.utils.toHex(web3.utils.toWei(amount.toString(),0))).encodeABI();

            // transection
            web3.eth.getTransactionCount(adminPublicKey).then(function (lastCountOfTransaction) {
            console.log(data);
            var txdetail = {
                "nonce":'0x' + lastCountOfTransaction.toString(16),
                "to": tokenAddress,
                "value": web3.utils.toHex(web3.utils.toWei("0")),
                "gas": gasLimitHex,
                "gasPrice": web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
                "data":data
            }

            const privateKey1Buffer = new Buffer.from(adminPrivateKey.slice(2), 'hex')

            console.log("privateKey1Buffer : ", privateKey1Buffer);
            const transaction = new EthereumTx(txdetail);
            transaction.sign(privateKey1Buffer);
            const serializedTransaction = transaction.serialize();
            
            console.log("serializedTransaction : ", serializedTransaction);
            try {
                web3.eth.sendSignedTransaction('0x' + serializedTransaction.toString('hex'))
                .on('confirmation', (res) => {
                     Axios({
                         method: "POST",
                         url: "http://localhost:5000/api/referral/withdraw",
                         data: {
                             publicKey: wallet.account
                         }
                     }).then((res)=>{
                        window.location.reload(); 
                     })
                    });
            }
            catch (e) {
                console.log("sendSignedTransaction error : ", e);
            }
            });
               
        }
    }
    }

    const handleCopyLink = ()=>{
        navigator.clipboard.writeText(`https://Atari.com/#/dice/${publicKey}`);
      }

        return (
            <div style={rootStyle}>
                <Header></Header>
                <Hidden smDown>
                <Grid container spacing={3} className="diceGrid" justify="center">
                    <Grid item xs={12} sm={8} md={12} >
                        <div className="diceTitle" style={style3}>
                            {cardTitle}
                        </div>
                        
                    </Grid>
                </Grid>
                </Hidden>
                <div>
                    <img src = {referalHuman} alt = "referral_human" width="500px"/>
                </div>
                <Grid container spacing = {3} className = "diceGrid" justify='center'>
                    <Grid item xs={12} sm = {6} md = {6}>
                        <ReferralCard
                            title = "Earn" 
                            betTitle = "From Ref's Bets"
                            betValue = "0.1%"
                            miningTitle = "From Ref's mining"
                            miningValue = "5%"
                        />
                    </Grid>
                    <Grid item xs={12} sm = {6} md = {6}>
                        <ReferralCard 
                            title = "My Referrals" 
                            betTitle = "Count"
                            betValue = "0"
                            miningTitle = "Profit From Ref Bets"
                            miningValue = {referralAmount}
                        />
                    </Grid>
                </Grid>
                <div className = "x-nopadding-diceGrid text-right">
                    <button className = "x-referral-withdraw-button" style = {style2} onClick = {withdraw}>Withdraw</button>
                </div>
                <div className = "x-referal-link-title diceGrid">
                    <div className = "mb-2">
                        Your referal link
                    </div>
                    <div className  = "x-referal-link">
                        <span className = "float-left">{!widthFlag?`https://Ataridice.xyz/#/dice/${publicKey}`:`https://Ataridice.xyz/#/...`}</span>
                        <button className = "x-referal-link-copy-btn float-right" onClick = {handleCopyLink}>Copy</button>
                    </div>
                </div>
                <Grid container spacing={3} className="diceGrid" justify="center">
                    <Grid item xs={12} sm={12} md={12}>
                    <div className = "x-lamp"><img src = {lampImage} alt = "lamp" /></div>
                    <div className = "x-lamp x-font-normal-white" style = {{lineHeight: "50%"}}>How to Play</div>                  
                    </Grid>
                </Grid>
                <div container spacing={3} className="diceGrid x-farming-blog1" justify="center">
                    <Grid item xs={12} sm={12} md={12} className = "text-left x-display-flex">
                        <div className = "x-lamp">
                            <img src = {dicePink} alt = "dicepink" width='25px' />
                        </div>
                        <div className = "x-lamp x-font-normal-white2">
                            Share your referral links
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} className = "text-left x-display-flex">
                        <div className = "x-lamp">
                            <img src = {dicePink} alt = "dicepink" width='25px' />
                        </div>
                        <div className = "x-lamp x-font-normal-white2">
                            Recieve a lifetime reward of 0.1% ATRI from each bet made by your ref!
                        </div>
                    </Grid>
                </div>

                <Grid container spacing = {3} className = 'diceGrid' justify = "center">
                    <Grid item xs = {12} sm = {12} md = {12}>
                        <ReferralTable />
                    </Grid>
                </Grid>

                <Footer></Footer>
            </div>
        )
  }
  
// const mapStateToProps = state => {
//     return {
//         items: state,
//     }
// }

// const mapDispatchToProps = {
//     setItems,
//     updateTimer
// }
  
export default Referral;
