import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router-dom";

import Header from "../components/Header";
import PokeCard from "../components/pokemon/PokeCard";
import Search from "../components/Search";
import LoadingCard from "../components/LoadingCard";
import Footer from "../components/Footer";
import api from "../services/api";
import Colors from "../styles/Colors";
import { SavePokemons, VerifyPokemons } from "../services/storage";

let pokemonsOriginal = [];
const perPage = 16;
const limit = 898;
let max = 0;

function Home() {
  const { query } = useParams();

  const [loading, setLoading] = useState(true);
  const [pokemons, setPokemons] = useState([]);

  function HandlerResult(maximum, pokemons) {
    max = maximum;
    setPokemons(pokemons);
  }

  useEffect(() => {
    setLoading(true);
    if (query === undefined) {
      HandlerResult(pokemonsOriginal.length, pokemonsOriginal.slice(0, perPage));
      setLoading(false);
      return;
    }

    const filtered = pokemonsOriginal.filter((item) => {
      return item.name.includes(query.toLowerCase()) || item.number.includes(query);
    });

    HandlerResult(filtered.length, filtered.slice(0, perPage));
    setLoading(false);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    const listLocal = VerifyPokemons();
    if (listLocal == null) {
      LoadPokemons();
      return;
    }

    pokemonsOriginal = listLocal;
    if (query !== undefined) {
      const filtered = listLocal.filter(
        (i) => i.name.includes(query.toLowerCase()) || i.number.includes(query)
      );
      HandlerResult(filtered.length, filtered.slice(0, perPage));
    } else {
      HandlerResult(listLocal.length, listLocal.slice(0, perPage));
    }
    setLoading(false);
  }, [query]);

  async function LoadPokemons() {
    let pokeList = await api.get(`/pokemon?limit=${limit}`);
    const all = [];
    for (let i = 0; i < pokeList.data.results.length; i++) {
      let pokeDetails = await api.get(`/pokemon/${pokeList.data.results[i].name}`);
      const obj = {
        name: pokeDetails.data.name,
        id: pokeDetails.data.id,
        types: pokeDetails.data.types,
        number: pokeDetails.data.id.toString().padStart(3, "0"),
        image:
          pokeDetails.data.sprites.versions["generation-v"]["black-white"].animated.front_default,
      };
      all.push(obj);
    }

    SavePokemons(all);
    pokemonsOriginal = all;
    HandlerResult(all.length, all.slice(0, perPage));
    setLoading(false);
  }

  function LoadMore() {
    const limitCount = pokemons.length + perPage;
    if (query === undefined) {
      setPokemons(pokemonsOriginal.slice(0, limitCount));
    } else {
      const filtered = pokemonsOriginal.filter((item) => {
        return item.name.includes(query.toLowerCase()) || item.number.includes(query);
      });
      setPokemons(filtered.slice(0, limitCount));
    }
  }

  return (
    <div>
      <Header />
      <Container fluid>
        <Search query={query} />
        {loading ? (
          <LoadingCard qty={12} />
        ) : pokemons.length === 0 ? (
          <div className="text-center text-light my-5">
            <h4>No results found for "{query}"</h4>
            <p>Try a different name or number.</p>
          </div>
        ) : (
          <InfiniteScroll
            style={{ overflow: "none" }}
            dataLength={pokemons.length}
            next={LoadMore}
            hasMore={pokemons.length < max}
            loader={
              <div className="mb-4 d-flex justify-content-center align-item-center">
                <Spinner
                  style={{ color: Colors.card_gray }}
                  animation="border"
                  role="status"
                >
                  <span className="sr-only">Loading...</span>
                </Spinner>
              </div>
            }
            endMessage={
              <p className="text-light" style={{ textAlign: "center" }}>
                <b>Yay! You have seen it all</b>
              </p>
            }
          >
            <Row>
              {pokemons.map((item) => (
                <Col key={item.id} xs={12} sm={6} lg={3}>
                  <PokeCard name={item.name} id={item.id} types={item.types} click={true} />
                </Col>
              ))}

              {/* Empty cols to keep layout aligned if pokemons % 4 !== 0 */}
              {Array.from({ length: (4 - (pokemons.length % 4)) % 4 }).map((_, i) => (
                <Col key={`empty-${i}`} xs={12} sm={6} lg={3} className="invisible" />
              ))}
            </Row>
          </InfiniteScroll>
        )}
      </Container>
      <Footer />
    </div>
  );
}

export default Home;
