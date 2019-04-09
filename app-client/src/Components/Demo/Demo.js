import React, { Component } from "react";
import { Container, Row } from 'reactstrap';
import axios from "axios";
import styles from "../Security/Security.css";

export default class Security extends Component {
  constructor(props) {
    super(props);

    this.state = {
      symbol: `IEEN`,
      beta: undefined,
      expectedReturn: undefined,
      investabilityIndex: undefined,
      rSquared: undefined,
      sharpeRatio: undefined,
      standardDeviation: undefined,
      valueAtRisk: undefined
    };
  }

  async componentDidMount() {
    const analysisData = await this.getAnalysisData();

    const { beta, expectedReturn, investabilityIndex, rSquared, sharpeRatio, standardDeviation, valueAtRisk } = analysisData;

    this.setState({
      beta,
      expectedReturn,
      investabilityIndex,
      rSquared,
      sharpeRatio,
      standardDeviation,
      valueAtRisk
    });
  }

  getAnalysisData = async () => {
    const options = {
      method: `GET`,
      url: `/api/securities/MU`,
      resolveWithFullResponse: true,
      headers: { "X-Demo": true }
    };

    const response = await axios(options);
    return response.data;
  }

  render() {
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
              Intelligence Equals Equals Null Inc.
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
