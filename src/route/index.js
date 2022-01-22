import React from 'react';
import { BrowserRouter ,HashRouter, Switch, Route } from 'react-router-dom'
import Dashboard from '../pages/dashboard';
import ClassicDice from '../pages/classic_dice';
import DiceLL from '../pages/dice_ll';
import Farming from '../pages/farming';
import Careful from '../pages/careful';
import Referral from '../pages/referral';
import Dividend from '../pages/dividend';
import ReferralDice from '../pages/referral_dice';


const routes = (props) =>{
  const {wallet} = props;
  return (
      <HashRouter>
        <Switch>
          <Route exact path="/" component={(Dashboard)} />
          <Route path="/classic-dice" component={(ClassicDice)} />
          <Route path="/dice-ii" component={(DiceLL)} />
          <Route path="/dice-ii-2" component={(Farming)} />
          <Route path="/be-careful" component={(Careful)} />
          <Route path="/referral" component={Referral} />
          <Route path="/dividend" component={(Dividend)} />
          <Route path="/dice/:id" component={(ReferralDice)} />
        </Switch>
      </HashRouter>
    )
  }

export default routes;
