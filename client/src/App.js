import React from 'react';
import 'App.css';
import { FormWrapper } from 'component/form.js';
import { NotFound } from 'component/notFound.js';
import {LoadList} from 'component/list';
import {FormList} from 'component/controlCentre';
import  Login from 'component/login.js';
import Profile from 'component/Profile.js';
import jwt from 'component/jwt';
import { AuthTest } from "component/authTest";
import { Layout, Menu, ConfigProvider, Radio } from 'antd';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

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
            <Menu.Item key="1"><Link to={`/`}>Home</Link></Menu.Item>
            <Menu.Item key="2"><div >
              <Radio.Group defaultValue="ltr" onChange={this.changeDirection}>
                <Radio.Button key="ltr" value="ltr">
                  LTR
            </Radio.Button>
                <Radio.Button key="rtl" value="rtl">
                  RTL
            </Radio.Button>

            <Radio.Button >
                  <Login />
            </Radio.Button>
              </Radio.Group>
            </div></Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '10vh 25vw 10vh 25vw' }}>
          <div className="site-layout-content" ><Switch>
            <Route exact path="/" >
              <p>hello :)</p>
            </Route>
            <Route path='/forms' component={LoadList}/>
            <Route path='/form/:handle' component={FormWrapper}/>
            <Route path='/login' />
            <Route path="/profile" component={Profile} />
            <Route path="/get-jwt" component={jwt} />
            <Route path="/test-auth" component={AuthTest} />
            <Route path="/controlCentre" component={FormList} />
            <Route path='*' exact={true} component={NotFound} />
          </Switch></div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>create dynamic forms</Footer>
      </Layout> </ConfigProvider>
      </Router>
    )
  }
}

export default App;