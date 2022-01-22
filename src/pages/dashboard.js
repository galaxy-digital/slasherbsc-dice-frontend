import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import Card from '../components/Card';
import LiveTable from '../components/LiveTable';
import {Header, socket} from '../components/Header';
import Footer from '../components/Footer';
import backgroundImg from '../assets/img/background.png';
import title from '../assets/img/title.png';
import diceBlue from '../assets/img/dice_blue.png'
import dicePink from '../assets/img/dice_pink.png'
import dice1 from '../assets/img/dice1.png';
import dice2 from '../assets/img/dice2.png';
import dice3 from '../assets/img/dice3.png';
import dice4 from '../assets/img/dice4.png';
import effect from '../assets/img/effect.png';
import {useWallet} from 'use-wallet';

var rootStyle = {
    width: "100%",
    backgroundImage: `url(${backgroundImg})`,
    height: "100%",
    backgroundSize: 'cover',
    backgroundPosition: 'center'
};

function createData(player, bet, profit, payout, guess, roll) {
    return {player, bet, profit, payout, guess, roll };
  }

const rows = [
    
  ];

  const myRows = [
    // createData(1, 'Yark G', 50, "+79.13%", 37.41, "eg.text", "eg.text"),
    // createData(2, 'Action', 52, "+79.13%", 37.41, "eg.text", "eg.text")
  ];

  const style1 = {background: "radial-gradient(ellipse farthest-corner at right bottom, #FEDB37 0%, #FDB931 8%, #9f7928 30%, #8A6E2F 40%, transparent 80%)" }
  const style2 = {background: "radial-gradient(ellipse farthest-corner at right bottom, #FEDB37 0%, #FDB931 8%, #9f7928 30%, #8A6E2F 40%, transparent 80%)" }
  const style3 = {backgroundImage: "linear-gradient( to right,#f2882b 0%,#fb6a49 100% )" }
  const style4 = {backgroundImage: "linear-gradient( to right,#33bae4 0%,#d929fb 100% )" }

function Dashboard (){

    const wallet = useWallet();
    const [totalData, setTotalData] = useState([]);
    const [stateData, setStateData] = useState([]);
    const [stateMyData, setStateMyData] = useState([]);
    const [tableViewFlag, setTableViewFlag] = useState(false);

    useEffect(()=> {
        console.log(totalData);
        if (wallet.status === "connected") {
            if(Object.keys(totalData).length!==0){
                console.log(wallet.account.toUpperCase())
                rows.push(createData(totalData.publicKey, totalData.amount, totalData.profit, totalData.payoutVal, totalData.higherVal, totalData.roll))
                console.log(rows)
                if(totalData.publicKey.toUpperCase() === wallet.account.toUpperCase()){
                    myRows.push(totalData);
                }
                setStateData(rows);
                setStateMyData(myRows);
            }
            }
        },[totalData, wallet.status])

    socket.on("users_count", (data) => {
        console.log(data);
        if (data) {
            if(wallet.status==="connected"){
                setTotalData(data);
            }
        }
    })

      const handleAllPlayer = () =>{
        setTableViewFlag(false);
      }
    
      const handleMyBets = () =>{
        setTableViewFlag(true);
      }

        return (
            <div>
            <div className = "dashboard" style={rootStyle}>
                <Header></Header>
                <Grid container spacing={3} className="dashboardGrid" justify="center">
                    <Grid item xs={12} sm={12} md={8} className = "x-fonts-1">
                        Enjoy your lucky day
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                        <Card 
                            cardTitle="Dice I" 
                            bodyTitle="10,000 Side Dice (0 - 9,999)"
                            bodyComment="with a very large winning ratio (up to 49.625x) Play, invest in the bankroll, win the Jackpot, repeat!"
                            btnTitle='Play "Dice I"'
                            cHeaderStyle={style1}
                            diceImg={diceBlue}
                            gameParams = 'classic-dice'
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                        <Card 
                            cardTitle="Dice II" 
                            bodyTitle="100 Side Dice (0 - 99)"
                            bodyComment="with a very large winning ratio (up to 49.625x) Play, invest in the bankroll, win the Jackpot, repeat!"
                            btnTitle='Play "Dice II"'
                            cHeaderStyle={style2}
                            diceImg={dicePink}
                            gameParams = 'dice-ii'
                        />
                    </Grid>
                    {/* <Grid item xs={12} sm={12} md={6}>
                        <Card 
                            cardTitle="Careful" 
                            bodyTitle=" "
                            bodyComment="a ZERO SUM and a very HIGH RISK gamewith a potential earningof 400% join the game, buy the ticket, earn CARE Token"
                            btnTitle='Play "Be Careful"'
                            cHeaderStyle={style3}
                            diceImg={diceYellow}
                            gameParams = 'be-careful'
                            onSubmit={this.submitCard}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                        <Card 
                            cardTitle="Farming!" 
                            bodyTitle=" "
                            bodyComment="We Seriously jump into Farming, resting from dice with the soothing breeze from the greens get POWER, earns RISK!"
                            btnTitle='Play "Dice II"'
                            cHeaderStyle={style4} 
                            diceImg={dicePurple}
                            gameParams = 'dice-ii-2'
                            onSubmit={this.submitCard}
                        />
                    </Grid> */}
                    
                </Grid>
            </div>
            <div className = "bet-card">
                <Grid container spacing={3} className="diceGridTable" justify="center">
                    <Grid item xs={12} sm={12} md={12} className="tableButtons">
                        <p>Live Player Bets</p>
                        <div className="tableBtns">
                            <button className="allPlayers" onClick = {handleAllPlayer}>All Players</button>
                            <button className="allPlayers" onClick = {handleMyBets}>My bets</button>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                        <LiveTable rows = {!tableViewFlag?stateData:stateMyData} />
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
  
export default Dashboard;
