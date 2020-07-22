import React from 'react';
import Image from 'images/flood.png';
import Icon1 from 'images/list.png';
import Icon2 from "images/increase.png";
import Icon3 from "images/yes.png";
import Icon4 from "images/location.png";
import Icon5 from "images/help.png";
import Icon6 from "images/human-resources.png";
import 'antd/dist/antd.css';
import { Typography,Steps, Divider } from 'antd';

const { Title,Text } = Typography;
const { Step } = Steps;

export class MainPage extends React.Component {
    render() {
        return (<div><Title >Disaster Aid</Title>
        <img src={Image} width="100%" height="100%"alt="flood"/>
        <br></br>
        <Title level={3}>What we do</Title>
        <Text strong>Society is challenged by various natural phenomena,
            as sad and inevitable this circumstances are there is organizations and 
            poeple ready to help.
            And we offering our help by gathering and management of information in the fastest time,
            which help us understand, who need help, where and what kind of help.
             </Text>
             <Divider />
    <Steps progressDot current={30} direction="vertical">
      <Step title="Information" description="We store information." />
      <img src={Icon1} width="30%" height="30%"alt="flood"/>
      <br></br>
      <Step title="Process" description="We process information." />
      <img src={Icon2} width="30%" height="30%"alt="flood"/>
      <br></br>
      <Step title="Resource" description="We found out what is needed." />
      <img src={Icon3} width="30%" height="30%"alt="flood"/>
      <br></br>
      <Step title="Location" description="We found out where is needed." />
      <img src={Icon4} width="30%" height="30%"alt="flood"/>
      <br></br>
      <Step title="Help" description="We help." />
      <img src={Icon5} width="30%" height="30%"alt="flood"/>
      <br></br>
      <Step title="Progress" description="And we do it even better if there is a next time." />
      <img src={Icon6} width="30%" height="30%"alt="flood"/>
    </Steps>
        </div>);
    }
}