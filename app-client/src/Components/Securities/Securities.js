import React, { Component } from "react";
import axios from "axios";
import styles from './Securities.css';
import { Container, Row, Col } from 'reactstrap';

export default class Securities extends Component {
  constructor(props) {
    super(props);

    this.state = {
      symbol: ``,
      beta: ``,
      rSquared: ``,
      sharpeRatio: ``,
      standardDeviation: ``,
      expectedReturn: ``,
      valueAtRisk: ``,
      investabilityIndex: ``
    };
  }

  async componentDidMount() {
    await this.getAnalysisData();
  }

  getAnalysisData = async () => {
    const options = {
      method: `GET`,
      url: `/api/security/MU`,
      resolveWithFullResponse: true
    };

    const response = await axios(options);
    const analysisData = response.data;

    const {beta, rSquared, sharpeRatio, standardDeviation, expectedReturn, valueAtRisk, symbol, investabilityIndex} = analysisData;

    this.setState({
      beta,
      rSquared,
      sharpeRatio,
      standardDeviation,
      expectedReturn,
      valueAtRisk,
      symbol,
      investabilityIndex
    });
  }


  render() {
    return (
      <React.Fragment>
        <Container>
          <Row className="Row">
              <h3>Security Results</h3>
          </Row>
          <Row className="Row">
          <hr id = "hr1"/>
          </Row>
          <Row className="Row">
              <h1>{this.state.symbol}</h1>
          </Row>
          <Row className="Row">
              Micron
          <hr/>
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
