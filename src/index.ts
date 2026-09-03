import { Console, Effect, pipe } from "effect";

const fetchRequest = Effect.tryPromise(() =>
    fetch("https://pokeapi.co/api/v2/pokemon/garchomp/")
);

const jsonResponse = (response: Response) =>
    Effect.tryPromise(() => response.json());

const main = pipe(
    fetchRequest,
    Effect.flatMap(jsonResponse),
    Effect.flatMap(Console.log),
    Effect.catchTag("UnknownException", () => Effect.succeed("Something bad happened."))
)

Effect.runPromise(main);
