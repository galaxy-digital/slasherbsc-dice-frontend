import React, { useState, useEffect } from 'react';
import logo from '../assets/img/logo.png';
import { Navbar, NavDropdown, Nav, Form, Button } from 'react-bootstrap';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import socketIOClient from "socket.io-client";
import { useWallet } from 'use-wallet';
import ConnectModal from './connectModal';


const socket = socketIOClient('http://localhost:5000/');

function Header() {
  const wallet = useWallet();
  const [flag, setFlag] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [publicKey, setPublicKey] = useState('connect');
  const [clickConnectButton, setClickConnectButton] = useState(false);


const connectMetamask = ()=>{
  if(wallet.status!=="connected"){
  setClickConnectButton(true);
    setModalShow(true)
    }
  }

useEffect(()=>{
    if(wallet.status==="connected"){
        var key_short;
        var key_short = wallet.account.slice(0, 6);
        setPublicKey(key_short+'...');
    }
    else if(localStorage.getItem("metamask")&&wallet.status==="disconnected"){
      wallet.connect();
    }
}, [wallet.status])

    return(
      <div className="header">
        <ConnectModal show = {modalShow} onHide = {()=>setModalShow(false)} wallet = {wallet}/>
        <Navbar expand="lg">
            <Navbar.Brand href="/"><img src={logo} alt="logo" width="150px"/></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                <Nav.Link href="/">Home</Nav.Link>
                {/* <Nav.Link href="/investment">Investment</Nav.Link>
                <Nav.Link href="/dividend">Dividend</Nav.Link> */}
                <Nav.Link href="/#/referral">Referral</Nav.Link>
                <NavDropdown title="Games" id="basic-nav-dropdown" className = "x-nav-dropdown">
                    <NavDropdown.Item href="/#/classic-dice">Dice I</NavDropdown.Item>
                    <NavDropdown.Item href="/#/dice-ii">Dice II</NavDropdown.Item>
                    {/* <NavDropdown.Item href="/#/be-careful">Careful</NavDropdown.Item>
                    <NavDropdown.Item href="/#/dice-ii-2">Farming</NavDropdown.Item> */}
                </NavDropdown>
                </Nav>
                <Form inline>
                    <Button className="loginBtn" onClick = {connectMetamask}><LockOpenIcon />{publicKey}</Button>
                </Form>
            </Navbar.Collapse>
        </Navbar>
      </div>
    );
}

export {Header, socket};

