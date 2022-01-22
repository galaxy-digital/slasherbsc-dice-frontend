import React from 'react';
import {Modal, Container, Row, Col, Button} from 'react-bootstrap';
import metamaskImg from '../assets/img/metamask.png';
import walletImg from '../assets/img/wallet.png';

function ConnectModal(props) {
    const {wallet} = props;
    const handleMetamask = () =>{
        props.onHide();
        wallet.connect().then((res)=>{
        localStorage.setItem("metamask", true);
    })
    }
    const handleWallet = () =>{
        props.onHide();
        wallet.connect("walletconnect").then(()=>{
            
        })
    }
    return (
      <Modal {...props} aria-labelledby="contained-modal-title-vcenter">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Connect a wallet!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="show-grid">
          <Container>
            <Row>
              <Col xs={12} md={6}>
              <div className = "x-metamask" onClick = {handleMetamask}>
                <div><img src = {metamaskImg} alt = "metamask"/></div>
                <div className = "text-center x-font-normal-green">Metamask</div>
              </div>
              </Col>
              <Col xs={12} md={6}>
                <div className = "x-metamask" onClick = {handleWallet}>
                    <div><img src = {walletImg} alt = "wallet"/></div>
                    <div className = "text-center x-font-normal-pink">Trust Wallet</div>
                </div>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        {/* <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer> */}
      </Modal>
    );
  }
  

export default ConnectModal;