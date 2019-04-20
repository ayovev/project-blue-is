import React, { Component } from "react";
import { Col, Container, Media, Row } from "reactstrap";
import axios from "axios";
import { GridLoader } from "react-spinners";
import FavoritesCard from "../FavoritesCard/FavoritesCard";
import styles from "../UserFavorites/UserFavorites.css";

export default class UserFavorites extends Component {
  constructor(props) {
    super(props);

    this.state = {
      favorites: undefined
    };
  }

  async componentDidMount() {
    const favorites = await this.getFavorites();

    this.setState({ favorites });
  }

  deleteFavorite = async (symbol) => {
    const options = {
      method: `DELETE`,
      url: `/api/users/favorites/${symbol}`,
      resolveWithFullResponse: true
    };

    return await axios(options);
  }

  getFavorites = async () => {
    const options = {
      method: `GET`,
      url: `/api/users/favorites`,
      resolveWithFullResponse: true
    };

    const response = await axios(options);
    return response.data;
  }

  removeFavorite = async (symbol) => {
    const favorites = this.state.favorites.filter((item) => {
      return item !== symbol;
    });

    await this.deleteFavorite(symbol);

    this.setState({ favorites });
  }

  render() {
    if (this.state.favorites === undefined) {
      return <GridLoader color="#4286f4" css={{ margin: `40vh auto auto auto` }}/>;
    }

    return (
      <React.Fragment>
        <Container>
          <Row>
            <Col>
              <Media middle className={styles.preText}>Favorites</Media>
            </Col>
          </Row>
          <Row>
            {this.state.favorites.map((symbol, key) => {
              return (
                <Col sm="3" key={key}>
                  <FavoritesCard symbol={symbol} onClick={(event) => {
                    event.preventDefault();
                    this.removeFavorite(symbol);
                  }}/>
                </Col>
              )
              ;
            })}
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

