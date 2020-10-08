import React from 'react';
import 'App.css';
import { FormWrapper } from 'component/form.js';
import { NotFound } from 'component/notFound.js';
import { LoadList } from 'component/list';
import { FormList } from 'component/controlCentre';
import { SummaryTable } from 'component/summaryTable';
import Descript from 'component/descript';
import { MainPage } from "component/mainPage";
import Login from 'component/login.js';
import jwt from 'component/jwt';
import { AuthTest } from "component/authTest";
import { ErrorBoundary } from "component/errorHandler";
import { Layout, Menu, ConfigProvider, Radio, Dropdown, Button, Tag } from 'antd';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { CloseOutlined } from '@ant-design/icons';
const { CheckableTag } = Tag;

const { Header, Content, Footer } = Layout;

class App extends React.Component {
  state = {
    direction: 'ltr',
    popupPlacement: 'bottomLeft',
    current: 'home',
  };

  handleClick = e => {
    console.log('click ', e);
    this.setState({ current: e.key });
  };
  changeDirection = e => {
    const toggle = { 'rtl': 'ltr', 'ltr': 'rtl' }
    this.setState({ direction: toggle[this.state.direction] });
    console.debug(this.state.direction)
    if (this.state.direction === 'rtl') {
      this.setState({ popupPlacement: 'bottomRight' });
    } else {
      this.setState({ popupPlacement: 'bottomLeft' });
    }
  };
  render() {
    const { current } = this.state;
    const { direction, popupPlacement } = this.state;
    const directionDropDown = <Menu>
      <Menu.Item key="rtl" value="rtl" >
        RTL
      </Menu.Item>
      <Menu.Item key="ltr" value="ltr" >
        LTR
      </Menu.Item>
    </Menu>
    return (
      <Router>
        <ConfigProvider direction={direction} popupPlacement={popupPlacement}>
          <Layout className="layout">
            <Header>
              <div className="logo" />
              <Menu theme="dark" mode="horizontal" onClick={this.handleClick} selectedKeys={[current]} >
                <Menu.Item key="home" style={{ backgroundColor: '#111d2c' }}>
                  <Link to={`/`}>
                    Home
              </Link>
                </Menu.Item>
                <Login />
                <Button onClick={this.changeDirection}>
                  {this.state.direction.toUpperCase()}
                </Button>
              </Menu>
            </Header>
            <Content style={{ padding: '10vh 25vw 10vh 25vw' }}>
              <div className="site-layout-content" >
                <ErrorBoundary>
                  <Switch>

                    <Route exact path="/" component={MainPage} />
                    <Route path='/forms' component={LoadList} />
                    <Route path='/form/:handle' component={FormWrapper} />
                    <Route path='/summary/form/:handle' component={SummaryTable} />
                    <Route path='/login' component={Descript} />
                    <Route path="/get-jwt" component={jwt} />
                    <Route path="/test-auth" component={AuthTest} />
                    <Route path="/controlCentre" component={FormList} />
                    <Route path='*' exact={true} component={NotFound} />

                  </Switch>
                </ErrorBoundary></div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>create dynamic forms</Footer>
          </Layout>
        </ConfigProvider>
      </Router>
    )
  }
}

export default App;