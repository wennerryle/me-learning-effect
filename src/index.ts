import { Console, Effect } from "effect";

const fetchRequest = Effect.promise(() =>
    fetch("https://pokeapi.co/api/v2/pokemon/garchomp/")
);

const jsonResponse = (response: Response) =>
    Effect.promise(() => response.json());

const pokemonStats = Effect.flatMap(
    fetchRequest,
    jsonResponse,
)

const main = Effect.flatMap(
    pokemonStats,
    Console.log
)

Effect.runPromise(main);
