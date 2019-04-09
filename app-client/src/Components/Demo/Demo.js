import React, { Component } from "react";
import { Container, Row } from 'reactstrap';
import axios from "axios";
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import CircularProgressbar from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import styles from "../Security/Security.css";

// test data for chart
const data = [
  { ticker: 45,
    SP500: 55,
    day: `June 18`
  },
  { ticker: 55,
    SP500: 60,
    day: `July 18`
  },
  { ticker: 35,
    SP500: 55,
    day: `Aug 18`
  },
  { ticker: 45,
    SP500: 50,
    day: `Sep 18`
  },
  { ticker: 80,
    SP500: 70,
    day: `Oct 18`
  },
  { ticker: 90,
    SP500: 85,
    day: `Nov 18`
  },
  { ticker: 30,
    SP500: 40,
    day: `Dec 18`
  },
  { ticker: 90,
    SP500: 95,
    day: `Feb 19`
  },
  { ticker: 120,
    SP500: 115,
    day: `Mar 19`
  }
];

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
        <Container className={styles.containerStyling}>
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
            <CircularProgressbar className="radialAnimation"
              percentage={this.state.investabilityIndex}
              text={`${this.state.investabilityIndex}`}
            />
          </Row>
          <Row className="Row">
            <h2>Investability Index</h2>
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
        <Container className={styles.containerStyling}>
          <Row className="Row">
            <hr className={styles.hr2}/>
          </Row>
          <Row className="Row">
            <h3>Historical Performance of {this.state.symbol} </h3>
          </Row>
          <Row className="Row">
            <LineChart className={styles.chart} width={900} height={400} data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="natural" dataKey="SP500" stroke="#4286f4" strokeWidth={2} animationDuration={1200}/>
              <Line type="natural" dataKey="ticker" stroke="#82ca9d" strokeWidth={2} animationDuration={1200}/>
            </LineChart>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}
