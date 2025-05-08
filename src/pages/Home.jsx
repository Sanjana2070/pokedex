import React, { useEffect, useRef, useState, useCallback } from "react";
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

const perPage = 16;
const limit = 898;

function Home() {
  const { query } = useParams();

  const [loading, setLoading] = useState(true);
  const [pokemons, setPokemons] = useState([]);
  const [max, setMax] = useState(0);

  const pokemonsOriginal = useRef([]);

  const applyQueryFilter = useCallback((sourceList) => {
    if (query === undefined) {
      setMax(sourceList.length);
      setPokemons(sourceList.slice(0, perPage));
    } else {
      const filtered = sourceList.filter(
        (item) =>
          item.name.includes(query.toLowerCase()) || item.number.includes(query)
      );
      setMax(filtered.length);
      setPokemons(filtered.slice(0, perPage));
    }
  }, [query]);

  const loadPokemonsFromAPI = useCallback(async () => {
    try {
      const pokeList = await api.get(`/pokemon?limit=${limit}`);
      const all = await Promise.all(
        pokeList.data.results.map(async (poke) => {
          const pokeDetails = await api.get(`/pokemon/${poke.name}`);
          return {
            name: pokeDetails.data.name,
            id: pokeDetails.data.id,
            types: pokeDetails.data.types,
            number: pokeDetails.data.id.toString().padStart(3, "0"),
            image:
              pokeDetails.data.sprites.versions["generation-v"]["black-white"].animated.front_default,
          };
        })
      );

      SavePokemons(all);
      pokemonsOriginal.current = all;
      applyQueryFilter(all);
    } catch (error) {
      console.error("Failed to fetch pokemons from API:", error);
    }
  }, [applyQueryFilter]);

  useEffect(() => {
    async function initialize() {
      setLoading(true);

      try {
        const listLocal = VerifyPokemons();

        if (listLocal == null) {
          await loadPokemonsFromAPI();
        } else {
          pokemonsOriginal.current = listLocal;
          applyQueryFilter(listLocal);
        }
      } catch (err) {
        console.error("Error loading Pokémon data:", err);
      }

      setLoading(false);
    }

    initialize();
  }, [query, applyQueryFilter, loadPokemonsFromAPI]);

  function LoadMore() {
    const limitCount = pokemons.length + perPage;
    const source = pokemonsOriginal.current;

    if (query === undefined) {
      setPokemons(source.slice(0, limitCount));
    } else {
      const filtered = source.filter(
        (item) =>
          item.name.includes(query.toLowerCase()) || item.number.includes(query)
      );
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
