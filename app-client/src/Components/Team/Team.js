import React, { Component } from "react";
import { NavLink as RRNavLink } from "react-router-dom";
import { Button, Col, Container, NavLink, Row } from "reactstrap";
import { Line, LineChart } from "recharts";
import styles from "./Team.css";
import Alex from "./assets/alex.png";
import James from "./assets/james.png";
import Nate from "./assets/nate.png";

const data = [
  { value: 45 },
  { value: 45 }
];

export default class Team extends Component {
  render() {
    return (
      <React.Fragment>
        <h2 className={styles.title}>Meet the Team</h2>
        <Container>
          <Row>
            <Col xs={9} className={styles.supportText}>
              <p>
                Our team is comprised of dedicated engineers and entrepreneurs that all have unique backgrounds in finance, computer science, business, and financial technology. Get to know us below!
              </p>
            </Col>
          </Row>
          <LineChart className={styles.chart} width={75} height={75} data={data}>
            <Line type="natural" dataKey="value" stroke="#4286f4" strokeWidth={2} dot={null} animationDuration={1200}/>
          </LineChart>
          <Row className={styles.row}>
            <Col xs={2}>
              <img src={Nate} className={styles.rightTeamImage} alt="Team member Nate"/>
            </Col>
            <Col>
              <p className={styles.teamParagraph}>
                Nate is currently a student at the University of Nevada Reno finishing his degree in Computer Science and Engineering and will soon start his MBA. He has always been fascinated by business and the technology used therein and has used his background to help develop efficient solutions to varying problems while continuing to harness new skills. Nate specializes in project management, software development, information technology, and automation integration. Nate is an avid adventurer, enjoying hiking, camping, rock climbing, and riding his motorcycle. He believes that the adventure never ends when the road does.
              </p>
              <h2>Nathanael Fuller</h2>
            </Col>
          </Row>
          <LineChart className={styles.chart} width={75} height={75} data={data}>
            <Line type="natural" dataKey="value" stroke="#4286f4" strokeWidth={2} dot={null} animationDuration={1200}/>
          </LineChart>
          <Row className={styles.row}>
            <Col xs={10}>
              <p className={styles.teamParagraph}>
                James is a graduating Senior at the University of Nevada, Reno studying Computer Science and Engineering. James specializes in Data Science and Machine Learning as well as short-term investing (trading). James will be earning his Master’s degree in Computer Science in the Spring of 2020 and will then look to enter the Financial Technologies industry as either a Software Engineer or Machine Learning Engineer (Data Scientist). James recently co-founded a FinTech company, along with Alex, where he looks to put his data-minded brain to use in order to produce excess returns.
              </p>
              <h2 style={{ 'textAlign': `right` }}>James Schnebly</h2>
            </Col>
            <Col xs={2}>
              <img src={James} className={styles.rightTeamImage} alt="Team member James"></img>
            </Col>
          </Row>
          <LineChart className={styles.chart} width={75} height={75} data={data}>
            <Line type="natural" dataKey="value" stroke="#4286f4" strokeWidth={2} dot={null} animationDuration={1200}/>
          </LineChart>
          <Row className={styles.row}>
            <Col xs={2}>
              <img src={Alex} className={styles.rightTeamImage} alt="Team member Alex"></img>
            </Col>
            <Col>
              <p className={styles.teamParagraph}>
                Alex is currently a Software Engineer at a FinTech company based out of California as well as a student at the University of Nevada, Reno where he is studying Computer Science and Engineering. He has experience with a wide variety of languages and frameworks including JavaScript, TypeScript, PHP, Python, C/C++, Kotlin, Node.js, React, Express, CodeIgniter, and Flask. In his free time, Alex enjoys reading, working on personal software projects, and enjoying the great outdoors by hiking, mountain biking, camping, kayaking, stand up paddleboarding, and exploring.
              </p>
              <h2>Alex Yovev</h2>
            </Col>
          </Row>
          <Row>
            <Col className={styles.buttonContainer}>
              <Button color="primary"><NavLink to="/contactUs" tag={RRNavLink} className={styles.button}>Contact Us</NavLink></Button>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}
