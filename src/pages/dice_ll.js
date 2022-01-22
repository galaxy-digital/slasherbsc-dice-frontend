import React, { useState,useEffect, createRef } from 'react';
// import '../App.css';
import { Grid } from '@material-ui/core';
import LiveTable from '../components/LiveTable';
import { Header, socket } from '../components/Header';
import Footer from '../components/Footer';
import backgroundImg from '../assets/img/background.png';
import dice1 from '../assets/img/dice1.png';
import dice2 from '../assets/img/dice2.png';
import dice3 from '../assets/img/dice3.png';
import dice4 from '../assets/img/dice4.png';
import effect from '../assets/img/effect.png';
import diceBlue from '../assets/img/dice_blue.png'
import { withStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import Abi from '../assets/abi/abi.json';
import { ethers } from 'ethers';
import { useWallet } from 'use-wallet'

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const style1 = { backgroundImage: "linear-gradient(315deg, #c1bfbf 0%, #af8231 74%)" }
const style2 = { backgroundImage: "linear-gradient(315deg, #772f1a 0%, #f2a65a 74%)" }
const style3 = { backgroundImage: "linear-gradient( to right,#f2882b 0%,#fb6a49 100% )" }
const style4 = { backgroundImage: "linear-gradient( to right,#33bae4 0%,#d929fb 100% )" }
const cardTitle = "Dice II";

var rootStyle = {
    width: "100%",
    backgroundImage: `url(${backgroundImg})`,
    height: "100%",
    backgroundSize: 'cover',
    backgroundPosition: 'center'
};

const HigherSlide = withStyles({
    root: {
        color: '#7fc03e',
        height: 20,
    },
    thumb: {
        display: "none"
    },
    active: {},
    valueLabel: {
        left: 'calc(-50% + 4px)',
    },
    track: {
        color: "#ee2748",
        height: 20,
        borderRadius: 10,
    },
    rail: {
        color: '#7fc03e',
        height: 20,
        borderRadius: 10,
        opacity: 1
    },
})(Slider);

const PayoutSlide = withStyles({
    root: {
        color: '#7fc03e',
        height: 10,
    },
    thumb: {
        display: "none"
    },
    active: {},
    valueLabel: {
        left: 'calc(-50% + 4px)',
    },
    track: {
        color: "#c30a96",
        height: 10,
    },
    rail: {
        backgroundImage: "linear-gradient( to right,#316fdc 0%,#3c1c65 100% )",
        height: 5,
        opacity: 1,
        marginTop: 2.5
    },
})(Slider);

function timeout(delay: number) {
    return new Promise(res => setTimeout(res, delay));
}

function createData(player, bet, profit, payout, guess, roll) {
    return {player, bet, profit, payout, guess, roll };
}

const rows = [
    // createData(1, 'Yark G', 50, "+79.13%", 37.41, "eg.text", "eg.text"),
    // createData(2, 'Action', 52, "+79.13%", 37.41, "eg.text", "eg.text")
];

const myRows = [
    // createData(1, 'Yark G', 50, "+79.13%", 37.41, "eg.text", "eg.text"),
    // createData(2, 'Action', 52, "+79.13%", 37.41, "eg.text", "eg.text")
];

var tokenAddress = "0xdacD69347dE42baBfAEcD09dC88958378780FB62";
const testnet = `https://mainnet.infura.io/v3/0c5409f01bb944168d3bb4b03a674f15`;
const provider = new ethers.providers.JsonRpcProvider(testnet);
var myContract = new ethers.Contract(tokenAddress, Abi, provider);
var i;

function DiceII(){
    const wallet = useWallet();
    const publicKey = createRef();
    const [signer, setSigner] = useState();
    const [flag, setFlag] = useState(true);
    const [amount, setAmount] = useState(1);
    const [higherVal, setHigherVal] = useState(50);
    const [winChance, setWinChance] = useState(50);
    const [payoutVal, setPayoutVal] = useState(98 / 50);
    const [profit, setProfit] = useState(98 / 50);
    const [result, setResult] = useState(0);
    const [totalData, setTotalData] = useState([]);
    const [stateData, setStateData] = useState([]);
    const [stopOnLoss, setStopOnLoss] = useState(10);
    const [stopOnProfit, setStopOnProfit] = useState(10);
    const [autoFlag, setAutoFlag] = useState(false);
    const [totalProfit, setTotalProfit] = useState(0);
    const [stateMyData, setStateMyData] = useState([]);
    const [tableViewFlag, setTableViewFlag] = useState(false);
    const [autobetting,setAutobetting] = useState("0");

    useEffect(()=> {
        console.log(totalData);
        if (wallet.status === "connected") {
            const provider = new ethers.providers.Web3Provider(wallet.ethereum)
            const signer = provider.getSigner();
            setSigner(signer);
            console.log(totalData.length)
            if(Object.keys(totalData).length!==0){
                console.log(wallet.account.toUpperCase())
                rows.push(createData(totalData.publicKey, totalData.amount, totalData.profit, totalData.payoutVal, totalData.higherVal, totalData.roll))
                if(totalData.publicKey.toUpperCase() === wallet.account.toUpperCase()){
                    myRows.push(totalData);
                }
            }
                setStateData(rows);
                setStateMyData(myRows);
                // this.setState({stateData:rows});
                // this.setState({stateMyData:myRows});
            }
        },[totalData, wallet.status])

    socket.on("users_count", (data) => {
        if (data) {
            if(wallet.status==="connected"){
                setTotalData(data);
            }
        }
    })


    const handleHigherVal = (event) => {
        setWinChance(event.target.value);
        setHigherVal(100-event.target.value);
        setPayoutVal(98 / event.target.value);
        setProfit((98 / event.target.value) * amount);
    }

    const handleHigher = (event, value) => {
        setHigherVal(value);
        setWinChance(100-value);
        setPayoutVal(98 / value);
        setProfit(amount * (98 / value))
    }

    const handlePayoutVal = (event) => {

    }

    const handleAmount = (event) => {
        setAmount(event.target.value);
        setProfit((98 / (100 - higherVal)) * event.target.value)
    }

    const amountDivision = (event) => {
        var tempAmount = amount / 2;
        setAmount(amount/2);
        setProfit(payoutVal* tempAmount);
    }
    const amountDouble = (event) => {
        var tempAmount = amount * 2;
        setAmount(amount*2);
        setProfit(payoutVal* tempAmount);
    }
    const minHigher = () => {
        setWinChance(1);
        setHigherVal(98);
        setPayoutVal(98);
        setProfit(amount*98);
    }
    const maxHigher = () => {
        setWinChance(98);
        setHigherVal(1);
        setPayoutVal(1);
        setProfit(amount*1);
    }

    const handleOnLoss = (e) => {
        setStopOnLoss(e.target.value);
        if(autobetting=="1"){
            betOff();
        }
        setTotalProfit(0);
    }

    const SetStopOnLoss= (val) => {
        setStopOnLoss(val);
        if(autobetting=="1"){
            betOff();
        }
        setTotalProfit(0);
    }


    const handleOnProfit = (e) => {
        setStopOnProfit(e.target.value);
        if(autobetting=="1"){
            betOff();
        }
        setTotalProfit(0);
    }

    const SetStopOnProfit= (val) => {
        setStopOnProfit(val);
        if(autobetting=="1"){
            betOff();
        }
        setTotalProfit(0);
    }

    const onBet = async () => {
        if (wallet.status === "connected") {
            var MyContract = myContract.connect(signer);
            console.log(signer)

            let tx = await MyContract.transfer("0x57fF2F45ad17304646276DD0F49A2E01CDE5CA63", ethers.utils.parseUnits(amount.toString(), 0))
                .catch((err) => {
                    console.log(err)
                })

            console.log(tx);
            if(tx!=undefined){
            i++;
            let randomNumber
            for (var j = 0; j <= 15; j++) {
                await timeout(100);
                randomNumber = Math.floor(Math.random() * 100);
                setResult(randomNumber);
            }
            if (randomNumber >= higherVal) {
                var winnerData = {
                    "publicKey": wallet.account,
                    "amount": amount,
                    "profit": profit,
                    "payoutVal": payoutVal,
                    "higherVal": higherVal,
                    "roll": randomNumber
                }
                console.log("set winnde")
                socket.emit("set winner", winnerData)

            }
            else {

                var loserData = {
                    "publicKey": wallet.account,
                    "amount": amount,
                    "profit": 0,
                    "payoutVal": payoutVal,
                    "higherVal": higherVal,
                    "roll": randomNumber
                }

                socket.emit("set loser", loserData)
            }
            // if (tx != null) {
            //     const provider = new ethers.providers.Web3Provider(this.props.wallet.ethereum);
            //     await provider.waitForTransaction(tx.hash)
            //         .catch((err) => {

            //         });
            // }
        }
    }
    }

    
    function betOff(){
        var autoData = {
            "publicKey": wallet.account,
            "amount": stopOnLoss,
            "profit": totalProfit,
            "payoutVal": payoutVal,
            "higherVal": higherVal,
            "roll": "autoBet"
        }
        console.log("wowow", totalProfit)
        //finish auto betting
        setAutobetting("0");
        setAutoFlag(false);
        socket.emit("set autoBet", autoData);
    }

    const handleAutoBet = async () => {
        if(!autoFlag)
         {
            // setAutobetting("1");
            // setAutoFlag(true);
            if (wallet.status === "connected") {
                var MyContract = myContract.connect(signer);
                let tx = await MyContract.transfer("0x57fF2F45ad17304646276DD0F49A2E01CDE5CA63", ethers.utils.parseUnits(stopOnLoss.toString(), 0))
                    .catch((err) => {
                        console.log(err)
                    })
                if(tx != null) {
                    //start bet
                    setTotalProfit(0);
                    setAutobetting("1");
                    setAutoFlag(true);
                }
            }
         }
         else {
            setAutobetting("0");
            betOff();
            console.log(autobetting,"autobetting")
         }
    }


    useEffect(()=>{
        async function betting(){
            if(totalProfit >= -1 * stopOnLoss + amount && totalProfit <= stopOnProfit - profit ){
                let randomNumber;
                randomNumber = Math.floor(Math.random() * 10000);
                console.log(randomNumber,higherVal,totalProfit)
                await delay(100);
                if (randomNumber >= higherVal) {
                    // this.state.totalProfit+=this.state.profit-this.state.amount;
                    setTotalProfit(totalProfit+profit-amount);
                }
                else {
                    // this.state.totalProfit-=this.state.amount;
                    setTotalProfit(totalProfit-amount);
                }
            }
            else 
                setAutobetting("2");
        }

        //continue bet
        if(autobetting=="1"){
            betting();
        }

        //finish betting
        if(autobetting=="2"){
            betOff();
            setAutoFlag(false);
        }
        console.log("autobetting",autobetting)
    },[autobetting,totalProfit])



    const handleAllPlayer = () => {
        setTableViewFlag(false);
    }

    const handleMyBets = () => {
        setTableViewFlag(true);
    }
        return (
            <div>
                <div className="dashboard" style={rootStyle}>
                    <Header ref={publicKey} />
                    <Grid container spacing={3} className="diceGrid" justify="center">
                        <Grid item xs={12} sm={12} md={12} >
                            <div className="diceTitle" style={style2}>
                                {cardTitle}
                            </div>

                        </Grid>
                    </Grid>

                    <Grid container spacing={3} className="diceGrid" justify="center">
                        <Grid item xs={12} sm={6} md={3} className="diceInfo">
                            <p>Bet Amount</p>
                            <input type="text" className="infoCard" value={amount} onChange={handleAmount} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3} className="diceInfo">
                            <p>Win Chance (%)</p>
                            <input className="infoCard" value={winChance} onChange={handleHigherVal} min="1" max="100" />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3} className="diceInfo">
                            <p>Payout (x)</p>
                            <input className="infoCard" value={payoutVal.toFixed(3)} onChange={handlePayoutVal} maxLength = "4"/>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3} className="diceInfo">
                            <p>Profit (ATRI)</p>
                            <input className="infoCard" value={profit.toFixed(3)} onChange={() => console.log("good")} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3} className="diceBtn1">
                            <button onClick={amountDivision}>1/2</button>
                            <button onClick={amountDouble}>2x</button>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3} className="diceBtn1">
                            <button onClick={minHigher}>Min</button>
                            <button onClick={maxHigher}>Max</button>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} className="diceBtn3">
                            <button onClick={onBet}>BET</button>
                        </Grid>
                    </Grid>

                    <Grid container spacing={3} className="diceGrid levelGrid" justify="center">
                        <Grid container>
                            <Grid item md={3} sm={3} xs={3} className="lower">
                                LOWER
                            </Grid>
                            <Grid item md={9} xs={9} sm={9} className="higher">
                                HIGHER
                            </Grid>
                            <Grid item md={12} xs={12} sm={12} >
                                <PayoutSlide valueLabelDisplay="auto" aria-label="pretto slider" value={higherVal} onChange={handleHigher} min={0} max={100} step={1} />
                            </Grid>
                        </Grid>
                        <HigherSlide valueLabelDisplay="auto" aria-label="pretto slider" value={result} min={0} max={100} />
                        <p className="progressTitle">{`Result : ${result} >= ${higherVal}`}</p>
                    </Grid>

                    <Grid container spacing={3} className="autoGrid" justify="center">
                        <Grid item xs={12} sm={12} md={12}>
                            <button type="button" className="playBtn autoBtn" style={style2}>Go to Automatic Bets</button>
                        </Grid>
                    </Grid>

                    <Grid container spacing={3} className="diceGrid-table-top resultGrid" justify="center">
                        <Grid item md={9} sm={12} xs={12} >
                            <Grid container>
                                <Grid item md={6} sm={12} xs={12} className="winorlose">
                                    <p>Stop On Loss (unlimited)</p>
                                    <input type="text" className="unlimitedText" value={stopOnLoss} onChange={handleOnLoss} />
                                    <p>On Win</p>
                                    <div className="winloseBtn">
                                        <button className="groupBtn reset1" onClick={() => SetStopOnLoss(10)}>Reset</button>
                                        <button className="groupBtn increase1" onClick={() => SetStopOnLoss(Number(stopOnLoss) + 1)}>Increase</button>
                                    </div>
                                </Grid>
                                <Grid item md={6} sm={12} xs={12} className="winorlose">
                                    <p>Stop On Profit (unlimited)</p>
                                    <input type="text" className="unlimitedText" value={stopOnProfit} onChange={handleOnProfit} />
                                    <p>On Lose</p>
                                    <div className="winloseBtn">
                                        <button className="groupBtn reset2" onClick={() => SetStopOnProfit(10)}>Reset</button>
                                        <button className="groupBtn increase2" onClick={() => SetStopOnProfit(Number(stopOnProfit) + 1)}>Increase</button>
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                            <Grid container>
                                <Grid item md={12} sm={12} xs={12}>
                                    <button type="button" className="startBtn" style={style2} onClick={handleAutoBet}>{autoFlag ? "stop" : "start"}</button>
                                </Grid>
                                <Grid item md={12} sm={12} xs={12}>
                                    <div className="x-classic-betting-state">
                                        {(Number(stopOnLoss) + Number(totalProfit)).toString().slice(0, 5)}
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
                <div className="bet-card">
                    <Grid container spacing={3} className="diceGridTable" justify="center">
                        <Grid item xs={12} sm={12} md={12} className="tableButtons">
                            <p>Live Player Bets</p>
                            <div className="tableBtns">
                                <button className="allPlayers" onClick={handleAllPlayer}>All Players</button>
                                <button className="allPlayers" onClick={handleMyBets}>My bets</button>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                            <LiveTable rows={!tableViewFlag ? stateData : stateMyData} />
                        </Grid>
                    </Grid>
                </div>
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

export default DiceII;
