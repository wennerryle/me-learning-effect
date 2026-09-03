import { Effect } from "effect";
import { FetchError, JsonError } from "./errors";
import { decodePokemon, Pokemon } from "./schema";

const fetchRequest = Effect.tryPromise({
    try: () => fetch("https://pokeapi.co/api/v2/pokemon/garchomp"),
    catch: () => new FetchError(),
});

const jsonResponse = (response: Response) =>
    Effect.tryPromise({
        try: () => response.json(),
        catch: () => new JsonError(),
    });

const program = Effect.gen(function* () {
    const response = yield* fetchRequest;
    if (!response.ok) {
        return yield* new FetchError();
    }

    const unknownJson = yield* jsonResponse(response);
    return yield* decodePokemon(unknownJson);
});

const main = program.pipe(
    Effect.catchTags({
        FetchError: () => Effect.succeed("Fetch error"),
        JsonError: () => Effect.succeed("Json error"),
        ParseError: () => Effect.succeed("Parse error")
    })
)

Effect.runPromise(main).then((it) => {
    if (typeof it === "string") {
        console.log(it);
    } else {
        console.log(it);
        console.log(`pokemon height is: ${it.formatHeight}`)
    }
})
