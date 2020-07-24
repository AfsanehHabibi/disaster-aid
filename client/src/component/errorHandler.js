import React  from 'react';
import { Spin, Alert, message } from 'antd';

export class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false,error: '',
      errorInfo: '', };
    }
  
    static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true, error};
    }
  
    componentDidCatch(error, errorInfo) {
      // You can also log the error to an error reporting service
      console.log({ error, errorInfo });
    this.setState({ errorInfo });
    }
  
    render() {
      if (this.state.hasError) {
        return (<Alert
          message="Error"
          description="Something went wrong"
          type="error"
          showIcon
        />)
      }
  
      return this.props.children; 
    }
  }