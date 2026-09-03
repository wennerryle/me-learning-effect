import { Console, Effect, pipe } from "effect";
import { FetchError, JsonError } from "./errors";

const fetchRequest = Effect.tryPromise({
    try: () => fetch("https://pokeapi.co/api/v2/pokemon/garchomp124/"),
    catch: () => new FetchError(),
}).pipe(Effect.filterOrFail((resp) => resp.ok, () => new FetchError()));

const jsonResponse = (response: Response) =>
    Effect.tryPromise({
        try: () => response.json(),
        catch: () => new JsonError(),
    });

const main = pipe(
    fetchRequest,
    Effect.flatMap(jsonResponse),
    Effect.catchTags({
        FetchError: () =>
            Effect.succeed(
                "Cannot check the API. Please check internet connection",
            ),
        JsonError: () =>
            Effect.succeed(
                "Cannot parse Garchomp data. Maybe API is outdated.",
            ),
    }),
    Effect.flatMap(Console.log),
);

Effect.runPromise(main);
