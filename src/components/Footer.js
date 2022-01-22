import React from 'react';
import '../App.css';
import { Grid } from '@material-ui/core';
import twitter from '../assets/img/twitter.png';
import protocol from '../assets/img/protocol.png';
import medium from '../assets/img/medium.png';
import telegram from '../assets/img/telegram.png';

class Footer extends React.Component {

  render() {

    return(
      <div className="footer">
        <Grid container className="footerContainer">
          <Grid item lg={8} md={8} sm={12} xs={12} className="footerMenu">
            <p className = "x-font-3">QUICK LINK</p>
            <ul className="footer-menu-ul">
                <li><a href="/">Home</a></li>
                {/* <li><a href="/#/investment">Investment</a></li>
                <li><a href="/#/divident">Dividend</a></li> */}
                <li><a href="/#/referral">Referral</a></li>
                <li><a href="/#/classic-dice">Games</a></li>
            </ul>
          </Grid>
          <Grid item lg={4} md={4} sm={12} xs={12} className="footerSocial">
            <div  className="footerIcons">
              <p className = "x-font-3">FOLLOW US</p>
              <div className="socialIcons">
                <a href="#" className="socialActive"><img src={protocol} alt="facebook" width = "20px"/></a>
                <a href="#"><img src={twitter} alt="youtube"/></a>
                <a href="#"><img src={medium} alt="linkedin"  width = "23px"/></a>
                <a href="#"><img src={telegram}alt="twitter"  width = "20px"/></a>
                <a href="#"><img src={telegram} alt="instagram"  width = "20px"/></a>
              </div>
            </div>
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12} className="footerCopyright">
            <p> © 2021 atari.Ltd</p>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Footer;