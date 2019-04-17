import { Component } from "react";
import { withRouter } from "react-router-dom";

class ScrollRestoration extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      window.document.body.scrollTo(0, 0);
    }
  }

  render() {
    return this.props.children;
  }
}

export default withRouter(ScrollRestoration);
