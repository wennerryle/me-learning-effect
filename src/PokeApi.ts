import { Config, Context, Effect, ParseResult, Schema } from "effect";
import { ConfigError } from "effect/ConfigError";
import { Pokemon } from "./schemas";
import { FetchError, JsonError } from "./errors";

export interface PokeApiImpl {
  readonly getPokemon: Effect.Effect<
    Pokemon,
    FetchError | JsonError | ParseResult.ParseError | ConfigError
  >;
}

export class PokeApi extends Context.Tag("PokeApi")<PokeApi, PokeApiImpl>() {
  static readonly Live = PokeApi.of({
    getPokemon: Effect.gen(function* () {
      const baseUrl = yield* Config.string("BASE_URL");
      const response = yield* Effect.tryPromise({
        try: () => fetch(new URL("/api/v2/pokemon/garchomp", baseUrl)),
        catch: () => new FetchError(),
      })

      if (!response.ok) {
        return yield* new FetchError();
      }

      const json = yield* Effect.tryPromise({
        try: () => response.json(),
        catch: () => new JsonError(),
      })

      return yield* Schema.decodeUnknown(Pokemon)(json);
    })
  })
}
