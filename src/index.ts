import { Console, Effect } from "effect";

const fetchRequest = Effect.promise(() =>
    fetch("https://pokeapi.co/api/v2/pokemon/garchomp/")
);

const jsonResponse = (response: Response) =>
    Effect.promise(() => response.json());

const pokemonStats = Effect.flatMap(
    fetchRequest,
    response => jsonResponse(response)
);

const main = Effect.flatMap(
    pokemonStats,
    it => Console.log(it)
)

Effect.runPromise(main);
