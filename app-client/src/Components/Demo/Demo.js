import React, { Component } from "react";
import { Container, Row } from 'reactstrap';
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
      analysis: {
        beta: 1.95,
        expectedReturn: 18.54,
        investabilityIndex: 80,
        rSquared: 0.65,
        sharpeRatio: 1.11,
        standardDeviation: 16.67,
        valueAtRisk: 11.34
      }
    };
  }

  lerpColor = (minimumColor, maximumColor, amount) => {
    /* eslint-disable */
    const micR = minimumColor >> 16;
    const micG = minimumColor >> 8 & 0xff;
    const micB = minimumColor & 0xff;

    const macR = maximumColor >> 16;
    const macG = maximumColor >> 8 & 0xff;
    const macB = maximumColor & 0xff;

    const resultR = micR + amount * (macR - micR);
    const resultG = micG + amount * (macG - micG);
    const resultB = micB + amount * (macB - micB);

    return ((resultR << 16) + (resultG << 8) + (resultB | 0)).toString(16);
    /* eslint-enable */
  }

  render() {
    const color = this.lerpColor(0xf48942, 0x4286f4, this.state.analysis.investabilityIndex / 100);

    return (
      <React.Fragment>
        <Container className={styles.containerStyling}>
          <Row>
            <h3>Security Results</h3>
          </Row>
          <Row>
            <hr className={styles.hr1}/>
          </Row>
          <Row>
            <h1>{this.state.symbol}</h1>
          </Row>
          <Row>
              Intelligence Equals Equals Null Inc.
            <hr className={styles.hr2}/>
          </Row>
          <Row>
            <CircularProgressbar className="radialAnimation"
              percentage={this.state.analysis.investabilityIndex}
              text={`${this.state.analysis.investabilityIndex}`}
              initialAnimation={true}
              strokeWidth={4}
              styles={{
                path: {
                  stroke: color,
                  strokeLinecap: `butt`,
                  transition: `stroke-dashoffset 0.5s ease 0s`
                },
                trail: {
                  stroke: `#d6d6d6`
                },
                text: {
                  fill: color,
                  fontSize: `30px`
                }
              }}
            />
          </Row>
          <Row>
            <h2>Investability Index</h2>
          </Row>
          <Row>
            <table>
              <tbody>
                <tr>
                  <td className={styles.td2}>
                    <b>{this.state.analysis.expectedReturn}%</b>
                    <br/><br/>
                    Expected Return
                  </td>
                  <td className={styles.td2}>
                    <b>{this.state.analysis.valueAtRisk}%</b>
                    <br/><br/>
                    Value at Risk
                  </td>
                  <td className={styles.td1}>
                    <b>{this.state.analysis.beta}</b>
                    <br/><br/>
                    Beta
                  </td>
                </tr>
                <tr>
                  <td className={styles.td3}>
                    <b>{this.state.analysis.rSquared}</b>
                    <br/><br/>
                    R Squared
                  </td>
                  <td className={styles.td3}>
                    <b>{this.state.analysis.sharpeRatio}</b>
                    <br/><br/>
                    Sharpe Ratio
                  </td>
                  <td>
                    <b>{this.state.analysis.standardDeviation}%</b>
                    <br/><br/>
                    Standard Deviation
                  </td>
                </tr>
              </tbody>
            </table>
          </Row>
        </Container>
        <Container className={styles.containerStyling}>
          <Row>
            <hr className={styles.hr2}/>
          </Row>
          <Row>
            <h3>Historical Performance of {this.state.symbol}</h3>
          </Row>
          <Row>
            <LineChart className={styles.chart} width={900} height={400} data={data}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="day"/>
              <YAxis/>
              <Tooltip/>
              <Legend/>
              <Line type="natural" dataKey="SP500" stroke="#4286f4" strokeWidth={2} animationDuration={1200}/>
              <Line type="natural" dataKey="ticker" stroke="#82ca9d" strokeWidth={2} animationDuration={1200}/>
            </LineChart>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}
