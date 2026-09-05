import { Effect, Config } from "effect";
import { FetchError, JsonError } from "./errors";
import { decodePokemon } from "./schema";

const config = Config.string("BASE_URL");

const fetchRequest = (baseUrl: string) => Effect.tryPromise({
    try: () => fetch(new URL(`/api/v2/pokemon/garchomp`, baseUrl)),
    catch: () => new FetchError(),
});

const jsonResponse = (response: Response) =>
    Effect.tryPromise({
        try: () => response.json(),
        catch: () => new JsonError(),
    });

const program = Effect.gen(function* () {
    const baseUrl = yield* config;
    const response = yield* fetchRequest(baseUrl);
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
