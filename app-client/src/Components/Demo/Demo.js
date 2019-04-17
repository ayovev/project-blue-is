import React, { Component } from "react";
import { Col, Container, Row } from 'reactstrap';
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import CircularProgressbar from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import styles from "../Security/Security.css";

// test data for chart
const data = [
  { ticker: 45,
    SPY: 55,
    day: `June 18`
  },
  { ticker: 55,
    SPY: 60,
    day: `July 18`
  },
  { ticker: 35,
    SPY: 55,
    day: `Aug 18`
  },
  { ticker: 45,
    SPY: 50,
    day: `Sep 18`
  },
  { ticker: 80,
    SPY: 70,
    day: `Oct 18`
  },
  { ticker: 90,
    SPY: 85,
    day: `Nov 18`
  },
  { ticker: 30,
    SPY: 40,
    day: `Dec 18`
  },
  { ticker: 90,
    SPY: 95,
    day: `Feb 19`
  },
  { ticker: 120,
    SPY: 115,
    day: `Mar 19`
  }
];

const BLUE = 0x4286f4;
const ORANGE = 0xf48942;

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
      },
      favorite: true
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

  toggleFavorite = () => {
    this.setState({ favorite: !this.state.favorite });
  }

  render() {
    const color = this.lerpColor(ORANGE, BLUE, this.state.analysis.investabilityIndex / 100);

    const starClasses = [`fa-star`, styles.favoriteIcon];
    this.state.favorite ? starClasses.push(`fas`) : starClasses.push(`far`);

    const iconTitle = this.state.favorite ? `Remove from Favorites` : `Add to Favorites`;

    return (
      <React.Fragment>
        <Container className={styles.container}>
          <Row className={styles.row}>
            <Col xs={9} className={styles.informationContainer}>
              <h1 className={styles.symbol}>{this.state.symbol}<i onClick={this.toggleFavorite} title={iconTitle} className={starClasses.join(` `)}/></h1>
              <p className={styles.companyNameAndExchange}>Intelligence Equal Equals Null Inc. | NASDAQ</p>
              <p className={styles.sectorAndIndustry}>Financial | Asset Management</p>
            </Col>
            <Col xs={12} className={styles.descriptionContainer}>
              <p>
                IEEN is a FinTech-based project that combines computer science and finance to provide users with wealth building insights that aim to strengthen an investor’s portfolio. Insights are displayed via a web application that makes use of a microservice architecture based around four main services, each of which will be isolated in containers through the use of Docker. The primary goal of this project is to build an application that investors can use to make more informed investment decisions. The broader importance of this project is its combination of advanced yet easily digestible analysis that would appeal to investors of all backgrounds and levels of experience.
              </p>
            </Col>
          </Row>
          <hr className={styles.hr}/>
          <Row className={styles.row}>
            <Col xs={6} className={styles.gaugeContainer}>
              <CircularProgressbar
                className={styles.gauge}
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
            </Col>
            <Col xs={6} className={styles.tableContainer}>
              <table className={styles.table}>
                <tbody>
                  <tr>
                    <td className={styles.td2}>
                      <p><b>{this.state.analysis.expectedReturn}%</b></p>
                      <span>Expected Return</span>
                    </td>
                    <td className={styles.td2}>
                      <p><b>{this.state.analysis.standardDeviation}%</b></p>
                      <span>Standard Deviation</span>
                    </td>
                    <td className={styles.td1}>
                      <p><b>{this.state.analysis.sharpeRatio}</b></p>
                      <span>Sharpe Ratio</span>
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.td3}>
                      <p><b>{this.state.analysis.beta}</b></p>
                      <span>Beta</span>
                    </td>
                    <td className={styles.td3}>
                      <p><b>{this.state.analysis.rSquared}</b></p>
                      <span>R Squared</span>
                    </td>
                    <td>
                      <p><b>{this.state.analysis.valueAtRisk}%</b></p>
                      <span>Value at Risk</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Col>
          </Row>
        </Container>
        <Container className={styles.containerStyling}>
          <hr className={styles.hr}/>
          <h3 className={styles.chartHeader}>Historical Performance of {this.state.symbol}</h3>
          <div className={styles.chartContainer}>
            <LineChart className={styles.chart} width={900} height={400} data={data}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="day"/>
              <YAxis/>
              <Tooltip/>
              <Legend/>
              <Line type="natural" dataKey="SPY" stroke="#4286f4" strokeWidth={2} animationDuration={1200}/>
              <Line type="natural" dataKey="ticker" stroke="#82ca9d" strokeWidth={2} animationDuration={1200}/>
            </LineChart>
          </div>
        </Container>
      </React.Fragment>
    );
  }
}
