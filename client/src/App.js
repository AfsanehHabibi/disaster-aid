import React from 'react';
import 'App.css';
import { FormWrapper } from 'component/form.js';
import { NotFound } from 'component/notFound.js';
import {LoadList} from 'component/list';
import {FormList} from 'component/controlCentre';
import { SummaryTable } from 'component/summaryTable';
import Descript from 'component/descript';
import { MainPage } from "component/mainPage";
import  Login from 'component/login.js';
import jwt from 'component/jwt';
import { AuthTest } from "component/authTest";
import { ErrorBoundary } from "component/errorHandler";
import { Layout, Menu, ConfigProvider, Radio  } from 'antd';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { CloseOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;

class App extends React.Component {
  state = {
    direction: 'ltr',
    popupPlacement: 'bottomLeft',
  };

  changeDirection = e => {
    const directionValue = e.target.value;
    this.setState({ direction: directionValue });
    if (directionValue === 'rtl') {
      this.setState({ popupPlacement: 'bottomRight' });
    } else {
      this.setState({ popupPlacement: 'bottomLeft' });
    }
  };
  render() {


    const { direction, popupPlacement } = this.state;
    return (
      <Router><ConfigProvider direction={direction} popupPlacement={popupPlacement}><Layout className="layout">
        <Header>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
            <Menu.Item key="1" style={{backgroundColor:'blue' }}><Link to={`/`}>Home</Link></Menu.Item>
            <Menu.Item key="2">
              <Radio.Group defaultValue="ltr" onChange={this.changeDirection}>
                <Radio.Button key="ltr" value="ltr">
                  LTR
                </Radio.Button>
                <Radio.Button key="rtl" value="rtl">
                  RTL
                </Radio.Button>
              </Radio.Group>
            </Menu.Item>
            <Menu.Item key="3" >
            <Radio.Group >
              <Radio.Button >
                  <Login />
              </Radio.Button>
              </Radio.Group>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '10vh 25vw 10vh 25vw' }}>
          <div className="site-layout-content" ><ErrorBoundary><Switch>
            
            <Route exact path="/" component={MainPage}/>
            <Route path='/forms' component={LoadList}/>
            <Route path='/form/:handle' component={FormWrapper}/>
            <Route path='/summary/form/:handle' component={SummaryTable}/>
            <Route path='/login' component={Descript}/>
            <Route path="/get-jwt" component={jwt} />
            <Route path="/test-auth" component={AuthTest} />
            <Route path="/controlCentre" component={FormList} />
            <Route path='*' exact={true} component={NotFound} />
            
          </Switch></ErrorBoundary></div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>create dynamic forms</Footer>
      </Layout> </ConfigProvider>
      </Router>
    )
  }
}

export default App;