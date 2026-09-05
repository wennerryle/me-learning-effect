import { Effect, Layer } from "effect";
import { PokeApi } from "./PokeApi";

const program = Effect.gen(function* () {
  const pokeApi = yield* PokeApi;

  return yield* pokeApi.getPokemon;
})

const runnable = program.pipe(Effect.provide(PokeApi.Mock));

const main = runnable.pipe(
  Effect.catchTags({
    FetchError: () => Effect.succeed("Fetch error"),
    JsonError: () => Effect.succeed("Json error"),
    ParseError: () => Effect.succeed("Parse error"),
  }),
);

Effect.runPromise(main).then((it) => {
  if (typeof it === "string") {
    console.log(it);
  } else {
    console.log(it);
    console.log(`pokemon height is: ${it.formatHeight}`);
  }
});
