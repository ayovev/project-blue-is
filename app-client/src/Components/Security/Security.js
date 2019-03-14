import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Container, Row } from 'reactstrap';
import axios from "axios";
import styles from './Security.css';

export default class Security extends Component {
  constructor(props) {
    super(props);

    this.state = {
      symbol: props.match.params.symbol,
      beta: ``,
      expectedReturn: ``,
      investabilityIndex: ``,
      rSquared: ``,
      sharpeRatio: ``,
      standardDeviation: ``,
      valueAtRisk: ``
    };
  }

  async componentDidMount() {
    const symbols = await this.getListOfSecurities();

    if (!symbols.includes(this.state.symbol)) {
      this.setState({ redirect: true });
    }

    await this.getAnalysisData();
  }

  getAnalysisData = async () => {
    const options = {
      method: `GET`,
      url: `/api/security/${this.state.symbol}`,
      resolveWithFullResponse: true
    };

    const response = await axios(options);
    const analysisData = response.data;

    const { symbol, beta, expectedReturn, investabilityIndex, rSquared, sharpeRatio, standardDeviation, valueAtRisk } = analysisData;

    this.setState({
      symbol,
      beta,
      expectedReturn,
      investabilityIndex,
      rSquared,
      sharpeRatio,
      standardDeviation,
      valueAtRisk
    });
  }

  getListOfSecurities = async () => {
    const options = {
      method: `GET`,
      url: `/api/security/`,
      resolveWithFullResponse: true
    };

    const response = await axios(options);

    return response.data.map((item) => {
      return item.symbol;
    });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to="/404" />;
    }

    return (
      <React.Fragment>
        <Container>
          <Row className="Row">
            <h3>Security Results</h3>
          </Row>
          <Row className="Row">
            <hr className={styles.hr1}/>
          </Row>
          <Row className="Row">
            <h1>{this.state.symbol}</h1>
          </Row>
          <Row className="Row">
              companyName
            <hr className={styles.hr2}/>
          </Row>
          <Row className="Row">
            <p id="graphic">[Insert investabilityIndex graphic here]</p>
          </Row>
          <Row className="Row">
            <table>
              <tbody>
                <tr>
                  <td className={styles.td2}>
                    <b>{this.state.expectedReturn}%</b>
                    <br/><br/>
                    Expected Return
                  </td>
                  <td className={styles.td2}>
                    <b>{this.state.valueAtRisk}%</b>
                    <br/><br/>
                    Value at Risk
                  </td>
                  <td className={styles.td1}>
                    <b>{this.state.beta}</b>
                    <br/><br/>
                    Beta
                  </td>
                </tr>
                <tr>
                  <td className={styles.td3}>
                    <b>{this.state.rSquared}</b>
                    <br/><br/>
                    R Squared
                  </td>
                  <td className={styles.td3}>
                    <b>{this.state.sharpeRatio}</b>
                    <br/><br/>
                    Sharpe Ratio
                  </td>
                  <td>
                    <b>{this.state.standardDeviation}%</b>
                    <br/><br/>
                    Standard Deviation
                  </td>
                </tr>
              </tbody>
            </table>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}
