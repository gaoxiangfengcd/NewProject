
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Photo
 * 
 */
export type Photo = $Result.DefaultSelection<Prisma.$PhotoPayload>
/**
 * Model FaceAnalysis
 * 
 */
export type FaceAnalysis = $Result.DefaultSelection<Prisma.$FaceAnalysisPayload>
/**
 * Model Generation
 * 
 */
export type Generation = $Result.DefaultSelection<Prisma.$GenerationPayload>
/**
 * Model Subscription
 * 
 */
export type Subscription = $Result.DefaultSelection<Prisma.$SubscriptionPayload>
/**
 * Model Quota
 * 
 */
export type Quota = $Result.DefaultSelection<Prisma.$QuotaPayload>
/**
 * Model ConsentRecord
 * 
 */
export type ConsentRecord = $Result.DefaultSelection<Prisma.$ConsentRecordPayload>
/**
 * Model DsrRequest
 * 
 */
export type DsrRequest = $Result.DefaultSelection<Prisma.$DsrRequestPayload>
/**
 * Model PaddleEvent
 * 
 */
export type PaddleEvent = $Result.DefaultSelection<Prisma.$PaddleEventPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.photo`: Exposes CRUD operations for the **Photo** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Photos
    * const photos = await prisma.photo.findMany()
    * ```
    */
  get photo(): Prisma.PhotoDelegate<ExtArgs>;

  /**
   * `prisma.faceAnalysis`: Exposes CRUD operations for the **FaceAnalysis** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FaceAnalyses
    * const faceAnalyses = await prisma.faceAnalysis.findMany()
    * ```
    */
  get faceAnalysis(): Prisma.FaceAnalysisDelegate<ExtArgs>;

  /**
   * `prisma.generation`: Exposes CRUD operations for the **Generation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Generations
    * const generations = await prisma.generation.findMany()
    * ```
    */
  get generation(): Prisma.GenerationDelegate<ExtArgs>;

  /**
   * `prisma.subscription`: Exposes CRUD operations for the **Subscription** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Subscriptions
    * const subscriptions = await prisma.subscription.findMany()
    * ```
    */
  get subscription(): Prisma.SubscriptionDelegate<ExtArgs>;

  /**
   * `prisma.quota`: Exposes CRUD operations for the **Quota** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Quotas
    * const quotas = await prisma.quota.findMany()
    * ```
    */
  get quota(): Prisma.QuotaDelegate<ExtArgs>;

  /**
   * `prisma.consentRecord`: Exposes CRUD operations for the **ConsentRecord** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ConsentRecords
    * const consentRecords = await prisma.consentRecord.findMany()
    * ```
    */
  get consentRecord(): Prisma.ConsentRecordDelegate<ExtArgs>;

  /**
   * `prisma.dsrRequest`: Exposes CRUD operations for the **DsrRequest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DsrRequests
    * const dsrRequests = await prisma.dsrRequest.findMany()
    * ```
    */
  get dsrRequest(): Prisma.DsrRequestDelegate<ExtArgs>;

  /**
   * `prisma.paddleEvent`: Exposes CRUD operations for the **PaddleEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PaddleEvents
    * const paddleEvents = await prisma.paddleEvent.findMany()
    * ```
    */
  get paddleEvent(): Prisma.PaddleEventDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Photo: 'Photo',
    FaceAnalysis: 'FaceAnalysis',
    Generation: 'Generation',
    Subscription: 'Subscription',
    Quota: 'Quota',
    ConsentRecord: 'ConsentRecord',
    DsrRequest: 'DsrRequest',
    PaddleEvent: 'PaddleEvent'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "user" | "photo" | "faceAnalysis" | "generation" | "subscription" | "quota" | "consentRecord" | "dsrRequest" | "paddleEvent"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Photo: {
        payload: Prisma.$PhotoPayload<ExtArgs>
        fields: Prisma.PhotoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PhotoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PhotoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoPayload>
          }
          findFirst: {
            args: Prisma.PhotoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PhotoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoPayload>
          }
          findMany: {
            args: Prisma.PhotoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoPayload>[]
          }
          create: {
            args: Prisma.PhotoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoPayload>
          }
          createMany: {
            args: Prisma.PhotoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PhotoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoPayload>[]
          }
          delete: {
            args: Prisma.PhotoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoPayload>
          }
          update: {
            args: Prisma.PhotoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoPayload>
          }
          deleteMany: {
            args: Prisma.PhotoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PhotoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PhotoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoPayload>
          }
          aggregate: {
            args: Prisma.PhotoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePhoto>
          }
          groupBy: {
            args: Prisma.PhotoGroupByArgs<ExtArgs>
            result: $Utils.Optional<PhotoGroupByOutputType>[]
          }
          count: {
            args: Prisma.PhotoCountArgs<ExtArgs>
            result: $Utils.Optional<PhotoCountAggregateOutputType> | number
          }
        }
      }
      FaceAnalysis: {
        payload: Prisma.$FaceAnalysisPayload<ExtArgs>
        fields: Prisma.FaceAnalysisFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FaceAnalysisFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FaceAnalysisPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FaceAnalysisFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FaceAnalysisPayload>
          }
          findFirst: {
            args: Prisma.FaceAnalysisFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FaceAnalysisPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FaceAnalysisFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FaceAnalysisPayload>
          }
          findMany: {
            args: Prisma.FaceAnalysisFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FaceAnalysisPayload>[]
          }
          create: {
            args: Prisma.FaceAnalysisCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FaceAnalysisPayload>
          }
          createMany: {
            args: Prisma.FaceAnalysisCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FaceAnalysisCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FaceAnalysisPayload>[]
          }
          delete: {
            args: Prisma.FaceAnalysisDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FaceAnalysisPayload>
          }
          update: {
            args: Prisma.FaceAnalysisUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FaceAnalysisPayload>
          }
          deleteMany: {
            args: Prisma.FaceAnalysisDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FaceAnalysisUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.FaceAnalysisUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FaceAnalysisPayload>
          }
          aggregate: {
            args: Prisma.FaceAnalysisAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFaceAnalysis>
          }
          groupBy: {
            args: Prisma.FaceAnalysisGroupByArgs<ExtArgs>
            result: $Utils.Optional<FaceAnalysisGroupByOutputType>[]
          }
          count: {
            args: Prisma.FaceAnalysisCountArgs<ExtArgs>
            result: $Utils.Optional<FaceAnalysisCountAggregateOutputType> | number
          }
        }
      }
      Generation: {
        payload: Prisma.$GenerationPayload<ExtArgs>
        fields: Prisma.GenerationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GenerationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GenerationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GenerationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GenerationPayload>
          }
          findFirst: {
            args: Prisma.GenerationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GenerationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GenerationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GenerationPayload>
          }
          findMany: {
            args: Prisma.GenerationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GenerationPayload>[]
          }
          create: {
            args: Prisma.GenerationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GenerationPayload>
          }
          createMany: {
            args: Prisma.GenerationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GenerationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GenerationPayload>[]
          }
          delete: {
            args: Prisma.GenerationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GenerationPayload>
          }
          update: {
            args: Prisma.GenerationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GenerationPayload>
          }
          deleteMany: {
            args: Prisma.GenerationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GenerationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.GenerationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GenerationPayload>
          }
          aggregate: {
            args: Prisma.GenerationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGeneration>
          }
          groupBy: {
            args: Prisma.GenerationGroupByArgs<ExtArgs>
            result: $Utils.Optional<GenerationGroupByOutputType>[]
          }
          count: {
            args: Prisma.GenerationCountArgs<ExtArgs>
            result: $Utils.Optional<GenerationCountAggregateOutputType> | number
          }
        }
      }
      Subscription: {
        payload: Prisma.$SubscriptionPayload<ExtArgs>
        fields: Prisma.SubscriptionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SubscriptionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SubscriptionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          findFirst: {
            args: Prisma.SubscriptionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SubscriptionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          findMany: {
            args: Prisma.SubscriptionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>[]
          }
          create: {
            args: Prisma.SubscriptionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          createMany: {
            args: Prisma.SubscriptionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SubscriptionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>[]
          }
          delete: {
            args: Prisma.SubscriptionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          update: {
            args: Prisma.SubscriptionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          deleteMany: {
            args: Prisma.SubscriptionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SubscriptionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SubscriptionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          aggregate: {
            args: Prisma.SubscriptionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSubscription>
          }
          groupBy: {
            args: Prisma.SubscriptionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SubscriptionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SubscriptionCountArgs<ExtArgs>
            result: $Utils.Optional<SubscriptionCountAggregateOutputType> | number
          }
        }
      }
      Quota: {
        payload: Prisma.$QuotaPayload<ExtArgs>
        fields: Prisma.QuotaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.QuotaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.QuotaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotaPayload>
          }
          findFirst: {
            args: Prisma.QuotaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.QuotaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotaPayload>
          }
          findMany: {
            args: Prisma.QuotaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotaPayload>[]
          }
          create: {
            args: Prisma.QuotaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotaPayload>
          }
          createMany: {
            args: Prisma.QuotaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.QuotaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotaPayload>[]
          }
          delete: {
            args: Prisma.QuotaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotaPayload>
          }
          update: {
            args: Prisma.QuotaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotaPayload>
          }
          deleteMany: {
            args: Prisma.QuotaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.QuotaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.QuotaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotaPayload>
          }
          aggregate: {
            args: Prisma.QuotaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQuota>
          }
          groupBy: {
            args: Prisma.QuotaGroupByArgs<ExtArgs>
            result: $Utils.Optional<QuotaGroupByOutputType>[]
          }
          count: {
            args: Prisma.QuotaCountArgs<ExtArgs>
            result: $Utils.Optional<QuotaCountAggregateOutputType> | number
          }
        }
      }
      ConsentRecord: {
        payload: Prisma.$ConsentRecordPayload<ExtArgs>
        fields: Prisma.ConsentRecordFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ConsentRecordFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentRecordPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ConsentRecordFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentRecordPayload>
          }
          findFirst: {
            args: Prisma.ConsentRecordFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentRecordPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ConsentRecordFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentRecordPayload>
          }
          findMany: {
            args: Prisma.ConsentRecordFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentRecordPayload>[]
          }
          create: {
            args: Prisma.ConsentRecordCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentRecordPayload>
          }
          createMany: {
            args: Prisma.ConsentRecordCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ConsentRecordCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentRecordPayload>[]
          }
          delete: {
            args: Prisma.ConsentRecordDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentRecordPayload>
          }
          update: {
            args: Prisma.ConsentRecordUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentRecordPayload>
          }
          deleteMany: {
            args: Prisma.ConsentRecordDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ConsentRecordUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ConsentRecordUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentRecordPayload>
          }
          aggregate: {
            args: Prisma.ConsentRecordAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateConsentRecord>
          }
          groupBy: {
            args: Prisma.ConsentRecordGroupByArgs<ExtArgs>
            result: $Utils.Optional<ConsentRecordGroupByOutputType>[]
          }
          count: {
            args: Prisma.ConsentRecordCountArgs<ExtArgs>
            result: $Utils.Optional<ConsentRecordCountAggregateOutputType> | number
          }
        }
      }
      DsrRequest: {
        payload: Prisma.$DsrRequestPayload<ExtArgs>
        fields: Prisma.DsrRequestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DsrRequestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DsrRequestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DsrRequestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DsrRequestPayload>
          }
          findFirst: {
            args: Prisma.DsrRequestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DsrRequestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DsrRequestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DsrRequestPayload>
          }
          findMany: {
            args: Prisma.DsrRequestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DsrRequestPayload>[]
          }
          create: {
            args: Prisma.DsrRequestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DsrRequestPayload>
          }
          createMany: {
            args: Prisma.DsrRequestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DsrRequestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DsrRequestPayload>[]
          }
          delete: {
            args: Prisma.DsrRequestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DsrRequestPayload>
          }
          update: {
            args: Prisma.DsrRequestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DsrRequestPayload>
          }
          deleteMany: {
            args: Prisma.DsrRequestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DsrRequestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DsrRequestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DsrRequestPayload>
          }
          aggregate: {
            args: Prisma.DsrRequestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDsrRequest>
          }
          groupBy: {
            args: Prisma.DsrRequestGroupByArgs<ExtArgs>
            result: $Utils.Optional<DsrRequestGroupByOutputType>[]
          }
          count: {
            args: Prisma.DsrRequestCountArgs<ExtArgs>
            result: $Utils.Optional<DsrRequestCountAggregateOutputType> | number
          }
        }
      }
      PaddleEvent: {
        payload: Prisma.$PaddleEventPayload<ExtArgs>
        fields: Prisma.PaddleEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PaddleEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaddleEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PaddleEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaddleEventPayload>
          }
          findFirst: {
            args: Prisma.PaddleEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaddleEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PaddleEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaddleEventPayload>
          }
          findMany: {
            args: Prisma.PaddleEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaddleEventPayload>[]
          }
          create: {
            args: Prisma.PaddleEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaddleEventPayload>
          }
          createMany: {
            args: Prisma.PaddleEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PaddleEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaddleEventPayload>[]
          }
          delete: {
            args: Prisma.PaddleEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaddleEventPayload>
          }
          update: {
            args: Prisma.PaddleEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaddleEventPayload>
          }
          deleteMany: {
            args: Prisma.PaddleEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PaddleEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PaddleEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaddleEventPayload>
          }
          aggregate: {
            args: Prisma.PaddleEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePaddleEvent>
          }
          groupBy: {
            args: Prisma.PaddleEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<PaddleEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.PaddleEventCountArgs<ExtArgs>
            result: $Utils.Optional<PaddleEventCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    photos: number
    generations: number
    consents: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    photos?: boolean | UserCountOutputTypeCountPhotosArgs
    generations?: boolean | UserCountOutputTypeCountGenerationsArgs
    consents?: boolean | UserCountOutputTypeCountConsentsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPhotosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PhotoWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountGenerationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GenerationWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountConsentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConsentRecordWhereInput
  }


  /**
   * Count Type PhotoCountOutputType
   */

  export type PhotoCountOutputType = {
    generations: number
  }

  export type PhotoCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    generations?: boolean | PhotoCountOutputTypeCountGenerationsArgs
  }

  // Custom InputTypes
  /**
   * PhotoCountOutputType without action
   */
  export type PhotoCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhotoCountOutputType
     */
    select?: PhotoCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PhotoCountOutputType without action
   */
  export type PhotoCountOutputTypeCountGenerationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GenerationWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    passwordHash: string | null
    name: string | null
    avatarUrl: string | null
    oauthProvider: string | null
    oauthUserId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    passwordHash: string | null
    name: string | null
    avatarUrl: string | null
    oauthProvider: string | null
    oauthUserId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    passwordHash: number
    name: number
    avatarUrl: number
    oauthProvider: number
    oauthUserId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    name?: true
    avatarUrl?: true
    oauthProvider?: true
    oauthUserId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    name?: true
    avatarUrl?: true
    oauthProvider?: true
    oauthUserId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    name?: true
    avatarUrl?: true
    oauthProvider?: true
    oauthUserId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    passwordHash: string | null
    name: string | null
    avatarUrl: string | null
    oauthProvider: string | null
    oauthUserId: string | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    name?: boolean
    avatarUrl?: boolean
    oauthProvider?: boolean
    oauthUserId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    photos?: boolean | User$photosArgs<ExtArgs>
    generations?: boolean | User$generationsArgs<ExtArgs>
    subscription?: boolean | User$subscriptionArgs<ExtArgs>
    quota?: boolean | User$quotaArgs<ExtArgs>
    consents?: boolean | User$consentsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    name?: boolean
    avatarUrl?: boolean
    oauthProvider?: boolean
    oauthUserId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    name?: boolean
    avatarUrl?: boolean
    oauthProvider?: boolean
    oauthUserId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    photos?: boolean | User$photosArgs<ExtArgs>
    generations?: boolean | User$generationsArgs<ExtArgs>
    subscription?: boolean | User$subscriptionArgs<ExtArgs>
    quota?: boolean | User$quotaArgs<ExtArgs>
    consents?: boolean | User$consentsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      photos: Prisma.$PhotoPayload<ExtArgs>[]
      generations: Prisma.$GenerationPayload<ExtArgs>[]
      subscription: Prisma.$SubscriptionPayload<ExtArgs> | null
      quota: Prisma.$QuotaPayload<ExtArgs> | null
      consents: Prisma.$ConsentRecordPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      passwordHash: string | null
      name: string | null
      avatarUrl: string | null
      oauthProvider: string | null
      oauthUserId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    photos<T extends User$photosArgs<ExtArgs> = {}>(args?: Subset<T, User$photosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "findMany"> | Null>
    generations<T extends User$generationsArgs<ExtArgs> = {}>(args?: Subset<T, User$generationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GenerationPayload<ExtArgs>, T, "findMany"> | Null>
    subscription<T extends User$subscriptionArgs<ExtArgs> = {}>(args?: Subset<T, User$subscriptionArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    quota<T extends User$quotaArgs<ExtArgs> = {}>(args?: Subset<T, User$quotaArgs<ExtArgs>>): Prisma__QuotaClient<$Result.GetResult<Prisma.$QuotaPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    consents<T extends User$consentsArgs<ExtArgs> = {}>(args?: Subset<T, User$consentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConsentRecordPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly avatarUrl: FieldRef<"User", 'String'>
    readonly oauthProvider: FieldRef<"User", 'String'>
    readonly oauthUserId: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.photos
   */
  export type User$photosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoInclude<ExtArgs> | null
    where?: PhotoWhereInput
    orderBy?: PhotoOrderByWithRelationInput | PhotoOrderByWithRelationInput[]
    cursor?: PhotoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PhotoScalarFieldEnum | PhotoScalarFieldEnum[]
  }

  /**
   * User.generations
   */
  export type User$generationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Generation
     */
    select?: GenerationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GenerationInclude<ExtArgs> | null
    where?: GenerationWhereInput
    orderBy?: GenerationOrderByWithRelationInput | GenerationOrderByWithRelationInput[]
    cursor?: GenerationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GenerationScalarFieldEnum | GenerationScalarFieldEnum[]
  }

  /**
   * User.subscription
   */
  export type User$subscriptionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    where?: SubscriptionWhereInput
  }

  /**
   * User.quota
   */
  export type User$quotaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quota
     */
    select?: QuotaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotaInclude<ExtArgs> | null
    where?: QuotaWhereInput
  }

  /**
   * User.consents
   */
  export type User$consentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentRecord
     */
    select?: ConsentRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentRecordInclude<ExtArgs> | null
    where?: ConsentRecordWhereInput
    orderBy?: ConsentRecordOrderByWithRelationInput | ConsentRecordOrderByWithRelationInput[]
    cursor?: ConsentRecordWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ConsentRecordScalarFieldEnum | ConsentRecordScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Photo
   */

  export type AggregatePhoto = {
    _count: PhotoCountAggregateOutputType | null
    _avg: PhotoAvgAggregateOutputType | null
    _sum: PhotoSumAggregateOutputType | null
    _min: PhotoMinAggregateOutputType | null
    _max: PhotoMaxAggregateOutputType | null
  }

  export type PhotoAvgAggregateOutputType = {
    width: number | null
    height: number | null
  }

  export type PhotoSumAggregateOutputType = {
    width: number | null
    height: number | null
  }

  export type PhotoMinAggregateOutputType = {
    id: string | null
    userId: string | null
    r2Key: string | null
    r2Url: string | null
    width: number | null
    height: number | null
    faceDetected: boolean | null
    createdAt: Date | null
  }

  export type PhotoMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    r2Key: string | null
    r2Url: string | null
    width: number | null
    height: number | null
    faceDetected: boolean | null
    createdAt: Date | null
  }

  export type PhotoCountAggregateOutputType = {
    id: number
    userId: number
    r2Key: number
    r2Url: number
    width: number
    height: number
    faceDetected: number
    createdAt: number
    _all: number
  }


  export type PhotoAvgAggregateInputType = {
    width?: true
    height?: true
  }

  export type PhotoSumAggregateInputType = {
    width?: true
    height?: true
  }

  export type PhotoMinAggregateInputType = {
    id?: true
    userId?: true
    r2Key?: true
    r2Url?: true
    width?: true
    height?: true
    faceDetected?: true
    createdAt?: true
  }

  export type PhotoMaxAggregateInputType = {
    id?: true
    userId?: true
    r2Key?: true
    r2Url?: true
    width?: true
    height?: true
    faceDetected?: true
    createdAt?: true
  }

  export type PhotoCountAggregateInputType = {
    id?: true
    userId?: true
    r2Key?: true
    r2Url?: true
    width?: true
    height?: true
    faceDetected?: true
    createdAt?: true
    _all?: true
  }

  export type PhotoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Photo to aggregate.
     */
    where?: PhotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Photos to fetch.
     */
    orderBy?: PhotoOrderByWithRelationInput | PhotoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PhotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Photos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Photos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Photos
    **/
    _count?: true | PhotoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PhotoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PhotoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PhotoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PhotoMaxAggregateInputType
  }

  export type GetPhotoAggregateType<T extends PhotoAggregateArgs> = {
        [P in keyof T & keyof AggregatePhoto]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePhoto[P]>
      : GetScalarType<T[P], AggregatePhoto[P]>
  }




  export type PhotoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PhotoWhereInput
    orderBy?: PhotoOrderByWithAggregationInput | PhotoOrderByWithAggregationInput[]
    by: PhotoScalarFieldEnum[] | PhotoScalarFieldEnum
    having?: PhotoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PhotoCountAggregateInputType | true
    _avg?: PhotoAvgAggregateInputType
    _sum?: PhotoSumAggregateInputType
    _min?: PhotoMinAggregateInputType
    _max?: PhotoMaxAggregateInputType
  }

  export type PhotoGroupByOutputType = {
    id: string
    userId: string
    r2Key: string
    r2Url: string | null
    width: number | null
    height: number | null
    faceDetected: boolean
    createdAt: Date
    _count: PhotoCountAggregateOutputType | null
    _avg: PhotoAvgAggregateOutputType | null
    _sum: PhotoSumAggregateOutputType | null
    _min: PhotoMinAggregateOutputType | null
    _max: PhotoMaxAggregateOutputType | null
  }

  type GetPhotoGroupByPayload<T extends PhotoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PhotoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PhotoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PhotoGroupByOutputType[P]>
            : GetScalarType<T[P], PhotoGroupByOutputType[P]>
        }
      >
    >


  export type PhotoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    r2Key?: boolean
    r2Url?: boolean
    width?: boolean
    height?: boolean
    faceDetected?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    generations?: boolean | Photo$generationsArgs<ExtArgs>
    analysis?: boolean | Photo$analysisArgs<ExtArgs>
    _count?: boolean | PhotoCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["photo"]>

  export type PhotoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    r2Key?: boolean
    r2Url?: boolean
    width?: boolean
    height?: boolean
    faceDetected?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["photo"]>

  export type PhotoSelectScalar = {
    id?: boolean
    userId?: boolean
    r2Key?: boolean
    r2Url?: boolean
    width?: boolean
    height?: boolean
    faceDetected?: boolean
    createdAt?: boolean
  }

  export type PhotoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    generations?: boolean | Photo$generationsArgs<ExtArgs>
    analysis?: boolean | Photo$analysisArgs<ExtArgs>
    _count?: boolean | PhotoCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PhotoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $PhotoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Photo"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      generations: Prisma.$GenerationPayload<ExtArgs>[]
      analysis: Prisma.$FaceAnalysisPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      r2Key: string
      r2Url: string | null
      width: number | null
      height: number | null
      faceDetected: boolean
      createdAt: Date
    }, ExtArgs["result"]["photo"]>
    composites: {}
  }

  type PhotoGetPayload<S extends boolean | null | undefined | PhotoDefaultArgs> = $Result.GetResult<Prisma.$PhotoPayload, S>

  type PhotoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PhotoFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PhotoCountAggregateInputType | true
    }

  export interface PhotoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Photo'], meta: { name: 'Photo' } }
    /**
     * Find zero or one Photo that matches the filter.
     * @param {PhotoFindUniqueArgs} args - Arguments to find a Photo
     * @example
     * // Get one Photo
     * const photo = await prisma.photo.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PhotoFindUniqueArgs>(args: SelectSubset<T, PhotoFindUniqueArgs<ExtArgs>>): Prisma__PhotoClient<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Photo that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PhotoFindUniqueOrThrowArgs} args - Arguments to find a Photo
     * @example
     * // Get one Photo
     * const photo = await prisma.photo.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PhotoFindUniqueOrThrowArgs>(args: SelectSubset<T, PhotoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PhotoClient<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Photo that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhotoFindFirstArgs} args - Arguments to find a Photo
     * @example
     * // Get one Photo
     * const photo = await prisma.photo.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PhotoFindFirstArgs>(args?: SelectSubset<T, PhotoFindFirstArgs<ExtArgs>>): Prisma__PhotoClient<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Photo that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhotoFindFirstOrThrowArgs} args - Arguments to find a Photo
     * @example
     * // Get one Photo
     * const photo = await prisma.photo.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PhotoFindFirstOrThrowArgs>(args?: SelectSubset<T, PhotoFindFirstOrThrowArgs<ExtArgs>>): Prisma__PhotoClient<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Photos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhotoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Photos
     * const photos = await prisma.photo.findMany()
     * 
     * // Get first 10 Photos
     * const photos = await prisma.photo.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const photoWithIdOnly = await prisma.photo.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PhotoFindManyArgs>(args?: SelectSubset<T, PhotoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Photo.
     * @param {PhotoCreateArgs} args - Arguments to create a Photo.
     * @example
     * // Create one Photo
     * const Photo = await prisma.photo.create({
     *   data: {
     *     // ... data to create a Photo
     *   }
     * })
     * 
     */
    create<T extends PhotoCreateArgs>(args: SelectSubset<T, PhotoCreateArgs<ExtArgs>>): Prisma__PhotoClient<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Photos.
     * @param {PhotoCreateManyArgs} args - Arguments to create many Photos.
     * @example
     * // Create many Photos
     * const photo = await prisma.photo.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PhotoCreateManyArgs>(args?: SelectSubset<T, PhotoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Photos and returns the data saved in the database.
     * @param {PhotoCreateManyAndReturnArgs} args - Arguments to create many Photos.
     * @example
     * // Create many Photos
     * const photo = await prisma.photo.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Photos and only return the `id`
     * const photoWithIdOnly = await prisma.photo.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PhotoCreateManyAndReturnArgs>(args?: SelectSubset<T, PhotoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Photo.
     * @param {PhotoDeleteArgs} args - Arguments to delete one Photo.
     * @example
     * // Delete one Photo
     * const Photo = await prisma.photo.delete({
     *   where: {
     *     // ... filter to delete one Photo
     *   }
     * })
     * 
     */
    delete<T extends PhotoDeleteArgs>(args: SelectSubset<T, PhotoDeleteArgs<ExtArgs>>): Prisma__PhotoClient<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Photo.
     * @param {PhotoUpdateArgs} args - Arguments to update one Photo.
     * @example
     * // Update one Photo
     * const photo = await prisma.photo.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PhotoUpdateArgs>(args: SelectSubset<T, PhotoUpdateArgs<ExtArgs>>): Prisma__PhotoClient<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Photos.
     * @param {PhotoDeleteManyArgs} args - Arguments to filter Photos to delete.
     * @example
     * // Delete a few Photos
     * const { count } = await prisma.photo.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PhotoDeleteManyArgs>(args?: SelectSubset<T, PhotoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Photos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhotoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Photos
     * const photo = await prisma.photo.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PhotoUpdateManyArgs>(args: SelectSubset<T, PhotoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Photo.
     * @param {PhotoUpsertArgs} args - Arguments to update or create a Photo.
     * @example
     * // Update or create a Photo
     * const photo = await prisma.photo.upsert({
     *   create: {
     *     // ... data to create a Photo
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Photo we want to update
     *   }
     * })
     */
    upsert<T extends PhotoUpsertArgs>(args: SelectSubset<T, PhotoUpsertArgs<ExtArgs>>): Prisma__PhotoClient<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Photos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhotoCountArgs} args - Arguments to filter Photos to count.
     * @example
     * // Count the number of Photos
     * const count = await prisma.photo.count({
     *   where: {
     *     // ... the filter for the Photos we want to count
     *   }
     * })
    **/
    count<T extends PhotoCountArgs>(
      args?: Subset<T, PhotoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PhotoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Photo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhotoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PhotoAggregateArgs>(args: Subset<T, PhotoAggregateArgs>): Prisma.PrismaPromise<GetPhotoAggregateType<T>>

    /**
     * Group by Photo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhotoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PhotoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PhotoGroupByArgs['orderBy'] }
        : { orderBy?: PhotoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PhotoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPhotoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Photo model
   */
  readonly fields: PhotoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Photo.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PhotoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    generations<T extends Photo$generationsArgs<ExtArgs> = {}>(args?: Subset<T, Photo$generationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GenerationPayload<ExtArgs>, T, "findMany"> | Null>
    analysis<T extends Photo$analysisArgs<ExtArgs> = {}>(args?: Subset<T, Photo$analysisArgs<ExtArgs>>): Prisma__FaceAnalysisClient<$Result.GetResult<Prisma.$FaceAnalysisPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Photo model
   */ 
  interface PhotoFieldRefs {
    readonly id: FieldRef<"Photo", 'String'>
    readonly userId: FieldRef<"Photo", 'String'>
    readonly r2Key: FieldRef<"Photo", 'String'>
    readonly r2Url: FieldRef<"Photo", 'String'>
    readonly width: FieldRef<"Photo", 'Int'>
    readonly height: FieldRef<"Photo", 'Int'>
    readonly faceDetected: FieldRef<"Photo", 'Boolean'>
    readonly createdAt: FieldRef<"Photo", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Photo findUnique
   */
  export type PhotoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoInclude<ExtArgs> | null
    /**
     * Filter, which Photo to fetch.
     */
    where: PhotoWhereUniqueInput
  }

  /**
   * Photo findUniqueOrThrow
   */
  export type PhotoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoInclude<ExtArgs> | null
    /**
     * Filter, which Photo to fetch.
     */
    where: PhotoWhereUniqueInput
  }

  /**
   * Photo findFirst
   */
  export type PhotoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoInclude<ExtArgs> | null
    /**
     * Filter, which Photo to fetch.
     */
    where?: PhotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Photos to fetch.
     */
    orderBy?: PhotoOrderByWithRelationInput | PhotoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Photos.
     */
    cursor?: PhotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Photos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Photos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Photos.
     */
    distinct?: PhotoScalarFieldEnum | PhotoScalarFieldEnum[]
  }

  /**
   * Photo findFirstOrThrow
   */
  export type PhotoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoInclude<ExtArgs> | null
    /**
     * Filter, which Photo to fetch.
     */
    where?: PhotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Photos to fetch.
     */
    orderBy?: PhotoOrderByWithRelationInput | PhotoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Photos.
     */
    cursor?: PhotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Photos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Photos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Photos.
     */
    distinct?: PhotoScalarFieldEnum | PhotoScalarFieldEnum[]
  }

  /**
   * Photo findMany
   */
  export type PhotoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoInclude<ExtArgs> | null
    /**
     * Filter, which Photos to fetch.
     */
    where?: PhotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Photos to fetch.
     */
    orderBy?: PhotoOrderByWithRelationInput | PhotoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Photos.
     */
    cursor?: PhotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Photos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Photos.
     */
    skip?: number
    distinct?: PhotoScalarFieldEnum | PhotoScalarFieldEnum[]
  }

  /**
   * Photo create
   */
  export type PhotoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoInclude<ExtArgs> | null
    /**
     * The data needed to create a Photo.
     */
    data: XOR<PhotoCreateInput, PhotoUncheckedCreateInput>
  }

  /**
   * Photo createMany
   */
  export type PhotoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Photos.
     */
    data: PhotoCreateManyInput | PhotoCreateManyInput[]
  }

  /**
   * Photo createManyAndReturn
   */
  export type PhotoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Photos.
     */
    data: PhotoCreateManyInput | PhotoCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Photo update
   */
  export type PhotoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoInclude<ExtArgs> | null
    /**
     * The data needed to update a Photo.
     */
    data: XOR<PhotoUpdateInput, PhotoUncheckedUpdateInput>
    /**
     * Choose, which Photo to update.
     */
    where: PhotoWhereUniqueInput
  }

  /**
   * Photo updateMany
   */
  export type PhotoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Photos.
     */
    data: XOR<PhotoUpdateManyMutationInput, PhotoUncheckedUpdateManyInput>
    /**
     * Filter which Photos to update
     */
    where?: PhotoWhereInput
  }

  /**
   * Photo upsert
   */
  export type PhotoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoInclude<ExtArgs> | null
    /**
     * The filter to search for the Photo to update in case it exists.
     */
    where: PhotoWhereUniqueInput
    /**
     * In case the Photo found by the `where` argument doesn't exist, create a new Photo with this data.
     */
    create: XOR<PhotoCreateInput, PhotoUncheckedCreateInput>
    /**
     * In case the Photo was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PhotoUpdateInput, PhotoUncheckedUpdateInput>
  }

  /**
   * Photo delete
   */
  export type PhotoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoInclude<ExtArgs> | null
    /**
     * Filter which Photo to delete.
     */
    where: PhotoWhereUniqueInput
  }

  /**
   * Photo deleteMany
   */
  export type PhotoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Photos to delete
     */
    where?: PhotoWhereInput
  }

  /**
   * Photo.generations
   */
  export type Photo$generationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Generation
     */
    select?: GenerationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GenerationInclude<ExtArgs> | null
    where?: GenerationWhereInput
    orderBy?: GenerationOrderByWithRelationInput | GenerationOrderByWithRelationInput[]
    cursor?: GenerationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GenerationScalarFieldEnum | GenerationScalarFieldEnum[]
  }

  /**
   * Photo.analysis
   */
  export type Photo$analysisArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FaceAnalysis
     */
    select?: FaceAnalysisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FaceAnalysisInclude<ExtArgs> | null
    where?: FaceAnalysisWhereInput
  }

  /**
   * Photo without action
   */
  export type PhotoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoInclude<ExtArgs> | null
  }


  /**
   * Model FaceAnalysis
   */

  export type AggregateFaceAnalysis = {
    _count: FaceAnalysisCountAggregateOutputType | null
    _min: FaceAnalysisMinAggregateOutputType | null
    _max: FaceAnalysisMaxAggregateOutputType | null
  }

  export type FaceAnalysisMinAggregateOutputType = {
    id: string | null
    photoId: string | null
    faceShape: string | null
    hairLength: string | null
    hairTexture: string | null
    hairDensity: string | null
    forehead: string | null
    jawline: string | null
    provider: string | null
    createdAt: Date | null
  }

  export type FaceAnalysisMaxAggregateOutputType = {
    id: string | null
    photoId: string | null
    faceShape: string | null
    hairLength: string | null
    hairTexture: string | null
    hairDensity: string | null
    forehead: string | null
    jawline: string | null
    provider: string | null
    createdAt: Date | null
  }

  export type FaceAnalysisCountAggregateOutputType = {
    id: number
    photoId: number
    faceShape: number
    hairLength: number
    hairTexture: number
    hairDensity: number
    forehead: number
    jawline: number
    provider: number
    createdAt: number
    _all: number
  }


  export type FaceAnalysisMinAggregateInputType = {
    id?: true
    photoId?: true
    faceShape?: true
    hairLength?: true
    hairTexture?: true
    hairDensity?: true
    forehead?: true
    jawline?: true
    provider?: true
    createdAt?: true
  }

  export type FaceAnalysisMaxAggregateInputType = {
    id?: true
    photoId?: true
    faceShape?: true
    hairLength?: true
    hairTexture?: true
    hairDensity?: true
    forehead?: true
    jawline?: true
    provider?: true
    createdAt?: true
  }

  export type FaceAnalysisCountAggregateInputType = {
    id?: true
    photoId?: true
    faceShape?: true
    hairLength?: true
    hairTexture?: true
    hairDensity?: true
    forehead?: true
    jawline?: true
    provider?: true
    createdAt?: true
    _all?: true
  }

  export type FaceAnalysisAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FaceAnalysis to aggregate.
     */
    where?: FaceAnalysisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FaceAnalyses to fetch.
     */
    orderBy?: FaceAnalysisOrderByWithRelationInput | FaceAnalysisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FaceAnalysisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FaceAnalyses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FaceAnalyses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FaceAnalyses
    **/
    _count?: true | FaceAnalysisCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FaceAnalysisMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FaceAnalysisMaxAggregateInputType
  }

  export type GetFaceAnalysisAggregateType<T extends FaceAnalysisAggregateArgs> = {
        [P in keyof T & keyof AggregateFaceAnalysis]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFaceAnalysis[P]>
      : GetScalarType<T[P], AggregateFaceAnalysis[P]>
  }




  export type FaceAnalysisGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FaceAnalysisWhereInput
    orderBy?: FaceAnalysisOrderByWithAggregationInput | FaceAnalysisOrderByWithAggregationInput[]
    by: FaceAnalysisScalarFieldEnum[] | FaceAnalysisScalarFieldEnum
    having?: FaceAnalysisScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FaceAnalysisCountAggregateInputType | true
    _min?: FaceAnalysisMinAggregateInputType
    _max?: FaceAnalysisMaxAggregateInputType
  }

  export type FaceAnalysisGroupByOutputType = {
    id: string
    photoId: string
    faceShape: string
    hairLength: string
    hairTexture: string
    hairDensity: string
    forehead: string
    jawline: string
    provider: string
    createdAt: Date
    _count: FaceAnalysisCountAggregateOutputType | null
    _min: FaceAnalysisMinAggregateOutputType | null
    _max: FaceAnalysisMaxAggregateOutputType | null
  }

  type GetFaceAnalysisGroupByPayload<T extends FaceAnalysisGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FaceAnalysisGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FaceAnalysisGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FaceAnalysisGroupByOutputType[P]>
            : GetScalarType<T[P], FaceAnalysisGroupByOutputType[P]>
        }
      >
    >


  export type FaceAnalysisSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    photoId?: boolean
    faceShape?: boolean
    hairLength?: boolean
    hairTexture?: boolean
    hairDensity?: boolean
    forehead?: boolean
    jawline?: boolean
    provider?: boolean
    createdAt?: boolean
    photo?: boolean | PhotoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["faceAnalysis"]>

  export type FaceAnalysisSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    photoId?: boolean
    faceShape?: boolean
    hairLength?: boolean
    hairTexture?: boolean
    hairDensity?: boolean
    forehead?: boolean
    jawline?: boolean
    provider?: boolean
    createdAt?: boolean
    photo?: boolean | PhotoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["faceAnalysis"]>

  export type FaceAnalysisSelectScalar = {
    id?: boolean
    photoId?: boolean
    faceShape?: boolean
    hairLength?: boolean
    hairTexture?: boolean
    hairDensity?: boolean
    forehead?: boolean
    jawline?: boolean
    provider?: boolean
    createdAt?: boolean
  }

  export type FaceAnalysisInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    photo?: boolean | PhotoDefaultArgs<ExtArgs>
  }
  export type FaceAnalysisIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    photo?: boolean | PhotoDefaultArgs<ExtArgs>
  }

  export type $FaceAnalysisPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FaceAnalysis"
    objects: {
      photo: Prisma.$PhotoPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      photoId: string
      faceShape: string
      hairLength: string
      hairTexture: string
      hairDensity: string
      forehead: string
      jawline: string
      provider: string
      createdAt: Date
    }, ExtArgs["result"]["faceAnalysis"]>
    composites: {}
  }

  type FaceAnalysisGetPayload<S extends boolean | null | undefined | FaceAnalysisDefaultArgs> = $Result.GetResult<Prisma.$FaceAnalysisPayload, S>

  type FaceAnalysisCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<FaceAnalysisFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: FaceAnalysisCountAggregateInputType | true
    }

  export interface FaceAnalysisDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FaceAnalysis'], meta: { name: 'FaceAnalysis' } }
    /**
     * Find zero or one FaceAnalysis that matches the filter.
     * @param {FaceAnalysisFindUniqueArgs} args - Arguments to find a FaceAnalysis
     * @example
     * // Get one FaceAnalysis
     * const faceAnalysis = await prisma.faceAnalysis.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FaceAnalysisFindUniqueArgs>(args: SelectSubset<T, FaceAnalysisFindUniqueArgs<ExtArgs>>): Prisma__FaceAnalysisClient<$Result.GetResult<Prisma.$FaceAnalysisPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one FaceAnalysis that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {FaceAnalysisFindUniqueOrThrowArgs} args - Arguments to find a FaceAnalysis
     * @example
     * // Get one FaceAnalysis
     * const faceAnalysis = await prisma.faceAnalysis.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FaceAnalysisFindUniqueOrThrowArgs>(args: SelectSubset<T, FaceAnalysisFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FaceAnalysisClient<$Result.GetResult<Prisma.$FaceAnalysisPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first FaceAnalysis that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FaceAnalysisFindFirstArgs} args - Arguments to find a FaceAnalysis
     * @example
     * // Get one FaceAnalysis
     * const faceAnalysis = await prisma.faceAnalysis.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FaceAnalysisFindFirstArgs>(args?: SelectSubset<T, FaceAnalysisFindFirstArgs<ExtArgs>>): Prisma__FaceAnalysisClient<$Result.GetResult<Prisma.$FaceAnalysisPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first FaceAnalysis that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FaceAnalysisFindFirstOrThrowArgs} args - Arguments to find a FaceAnalysis
     * @example
     * // Get one FaceAnalysis
     * const faceAnalysis = await prisma.faceAnalysis.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FaceAnalysisFindFirstOrThrowArgs>(args?: SelectSubset<T, FaceAnalysisFindFirstOrThrowArgs<ExtArgs>>): Prisma__FaceAnalysisClient<$Result.GetResult<Prisma.$FaceAnalysisPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more FaceAnalyses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FaceAnalysisFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FaceAnalyses
     * const faceAnalyses = await prisma.faceAnalysis.findMany()
     * 
     * // Get first 10 FaceAnalyses
     * const faceAnalyses = await prisma.faceAnalysis.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const faceAnalysisWithIdOnly = await prisma.faceAnalysis.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FaceAnalysisFindManyArgs>(args?: SelectSubset<T, FaceAnalysisFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FaceAnalysisPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a FaceAnalysis.
     * @param {FaceAnalysisCreateArgs} args - Arguments to create a FaceAnalysis.
     * @example
     * // Create one FaceAnalysis
     * const FaceAnalysis = await prisma.faceAnalysis.create({
     *   data: {
     *     // ... data to create a FaceAnalysis
     *   }
     * })
     * 
     */
    create<T extends FaceAnalysisCreateArgs>(args: SelectSubset<T, FaceAnalysisCreateArgs<ExtArgs>>): Prisma__FaceAnalysisClient<$Result.GetResult<Prisma.$FaceAnalysisPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many FaceAnalyses.
     * @param {FaceAnalysisCreateManyArgs} args - Arguments to create many FaceAnalyses.
     * @example
     * // Create many FaceAnalyses
     * const faceAnalysis = await prisma.faceAnalysis.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FaceAnalysisCreateManyArgs>(args?: SelectSubset<T, FaceAnalysisCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FaceAnalyses and returns the data saved in the database.
     * @param {FaceAnalysisCreateManyAndReturnArgs} args - Arguments to create many FaceAnalyses.
     * @example
     * // Create many FaceAnalyses
     * const faceAnalysis = await prisma.faceAnalysis.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FaceAnalyses and only return the `id`
     * const faceAnalysisWithIdOnly = await prisma.faceAnalysis.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FaceAnalysisCreateManyAndReturnArgs>(args?: SelectSubset<T, FaceAnalysisCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FaceAnalysisPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a FaceAnalysis.
     * @param {FaceAnalysisDeleteArgs} args - Arguments to delete one FaceAnalysis.
     * @example
     * // Delete one FaceAnalysis
     * const FaceAnalysis = await prisma.faceAnalysis.delete({
     *   where: {
     *     // ... filter to delete one FaceAnalysis
     *   }
     * })
     * 
     */
    delete<T extends FaceAnalysisDeleteArgs>(args: SelectSubset<T, FaceAnalysisDeleteArgs<ExtArgs>>): Prisma__FaceAnalysisClient<$Result.GetResult<Prisma.$FaceAnalysisPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one FaceAnalysis.
     * @param {FaceAnalysisUpdateArgs} args - Arguments to update one FaceAnalysis.
     * @example
     * // Update one FaceAnalysis
     * const faceAnalysis = await prisma.faceAnalysis.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FaceAnalysisUpdateArgs>(args: SelectSubset<T, FaceAnalysisUpdateArgs<ExtArgs>>): Prisma__FaceAnalysisClient<$Result.GetResult<Prisma.$FaceAnalysisPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more FaceAnalyses.
     * @param {FaceAnalysisDeleteManyArgs} args - Arguments to filter FaceAnalyses to delete.
     * @example
     * // Delete a few FaceAnalyses
     * const { count } = await prisma.faceAnalysis.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FaceAnalysisDeleteManyArgs>(args?: SelectSubset<T, FaceAnalysisDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FaceAnalyses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FaceAnalysisUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FaceAnalyses
     * const faceAnalysis = await prisma.faceAnalysis.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FaceAnalysisUpdateManyArgs>(args: SelectSubset<T, FaceAnalysisUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one FaceAnalysis.
     * @param {FaceAnalysisUpsertArgs} args - Arguments to update or create a FaceAnalysis.
     * @example
     * // Update or create a FaceAnalysis
     * const faceAnalysis = await prisma.faceAnalysis.upsert({
     *   create: {
     *     // ... data to create a FaceAnalysis
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FaceAnalysis we want to update
     *   }
     * })
     */
    upsert<T extends FaceAnalysisUpsertArgs>(args: SelectSubset<T, FaceAnalysisUpsertArgs<ExtArgs>>): Prisma__FaceAnalysisClient<$Result.GetResult<Prisma.$FaceAnalysisPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of FaceAnalyses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FaceAnalysisCountArgs} args - Arguments to filter FaceAnalyses to count.
     * @example
     * // Count the number of FaceAnalyses
     * const count = await prisma.faceAnalysis.count({
     *   where: {
     *     // ... the filter for the FaceAnalyses we want to count
     *   }
     * })
    **/
    count<T extends FaceAnalysisCountArgs>(
      args?: Subset<T, FaceAnalysisCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FaceAnalysisCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FaceAnalysis.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FaceAnalysisAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FaceAnalysisAggregateArgs>(args: Subset<T, FaceAnalysisAggregateArgs>): Prisma.PrismaPromise<GetFaceAnalysisAggregateType<T>>

    /**
     * Group by FaceAnalysis.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FaceAnalysisGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FaceAnalysisGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FaceAnalysisGroupByArgs['orderBy'] }
        : { orderBy?: FaceAnalysisGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FaceAnalysisGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFaceAnalysisGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FaceAnalysis model
   */
  readonly fields: FaceAnalysisFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FaceAnalysis.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FaceAnalysisClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    photo<T extends PhotoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PhotoDefaultArgs<ExtArgs>>): Prisma__PhotoClient<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the FaceAnalysis model
   */ 
  interface FaceAnalysisFieldRefs {
    readonly id: FieldRef<"FaceAnalysis", 'String'>
    readonly photoId: FieldRef<"FaceAnalysis", 'String'>
    readonly faceShape: FieldRef<"FaceAnalysis", 'String'>
    readonly hairLength: FieldRef<"FaceAnalysis", 'String'>
    readonly hairTexture: FieldRef<"FaceAnalysis", 'String'>
    readonly hairDensity: FieldRef<"FaceAnalysis", 'String'>
    readonly forehead: FieldRef<"FaceAnalysis", 'String'>
    readonly jawline: FieldRef<"FaceAnalysis", 'String'>
    readonly provider: FieldRef<"FaceAnalysis", 'String'>
    readonly createdAt: FieldRef<"FaceAnalysis", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * FaceAnalysis findUnique
   */
  export type FaceAnalysisFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FaceAnalysis
     */
    select?: FaceAnalysisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FaceAnalysisInclude<ExtArgs> | null
    /**
     * Filter, which FaceAnalysis to fetch.
     */
    where: FaceAnalysisWhereUniqueInput
  }

  /**
   * FaceAnalysis findUniqueOrThrow
   */
  export type FaceAnalysisFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FaceAnalysis
     */
    select?: FaceAnalysisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FaceAnalysisInclude<ExtArgs> | null
    /**
     * Filter, which FaceAnalysis to fetch.
     */
    where: FaceAnalysisWhereUniqueInput
  }

  /**
   * FaceAnalysis findFirst
   */
  export type FaceAnalysisFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FaceAnalysis
     */
    select?: FaceAnalysisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FaceAnalysisInclude<ExtArgs> | null
    /**
     * Filter, which FaceAnalysis to fetch.
     */
    where?: FaceAnalysisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FaceAnalyses to fetch.
     */
    orderBy?: FaceAnalysisOrderByWithRelationInput | FaceAnalysisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FaceAnalyses.
     */
    cursor?: FaceAnalysisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FaceAnalyses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FaceAnalyses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FaceAnalyses.
     */
    distinct?: FaceAnalysisScalarFieldEnum | FaceAnalysisScalarFieldEnum[]
  }

  /**
   * FaceAnalysis findFirstOrThrow
   */
  export type FaceAnalysisFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FaceAnalysis
     */
    select?: FaceAnalysisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FaceAnalysisInclude<ExtArgs> | null
    /**
     * Filter, which FaceAnalysis to fetch.
     */
    where?: FaceAnalysisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FaceAnalyses to fetch.
     */
    orderBy?: FaceAnalysisOrderByWithRelationInput | FaceAnalysisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FaceAnalyses.
     */
    cursor?: FaceAnalysisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FaceAnalyses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FaceAnalyses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FaceAnalyses.
     */
    distinct?: FaceAnalysisScalarFieldEnum | FaceAnalysisScalarFieldEnum[]
  }

  /**
   * FaceAnalysis findMany
   */
  export type FaceAnalysisFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FaceAnalysis
     */
    select?: FaceAnalysisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FaceAnalysisInclude<ExtArgs> | null
    /**
     * Filter, which FaceAnalyses to fetch.
     */
    where?: FaceAnalysisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FaceAnalyses to fetch.
     */
    orderBy?: FaceAnalysisOrderByWithRelationInput | FaceAnalysisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FaceAnalyses.
     */
    cursor?: FaceAnalysisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FaceAnalyses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FaceAnalyses.
     */
    skip?: number
    distinct?: FaceAnalysisScalarFieldEnum | FaceAnalysisScalarFieldEnum[]
  }

  /**
   * FaceAnalysis create
   */
  export type FaceAnalysisCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FaceAnalysis
     */
    select?: FaceAnalysisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FaceAnalysisInclude<ExtArgs> | null
    /**
     * The data needed to create a FaceAnalysis.
     */
    data: XOR<FaceAnalysisCreateInput, FaceAnalysisUncheckedCreateInput>
  }

  /**
   * FaceAnalysis createMany
   */
  export type FaceAnalysisCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FaceAnalyses.
     */
    data: FaceAnalysisCreateManyInput | FaceAnalysisCreateManyInput[]
  }

  /**
   * FaceAnalysis createManyAndReturn
   */
  export type FaceAnalysisCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FaceAnalysis
     */
    select?: FaceAnalysisSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many FaceAnalyses.
     */
    data: FaceAnalysisCreateManyInput | FaceAnalysisCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FaceAnalysisIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * FaceAnalysis update
   */
  export type FaceAnalysisUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FaceAnalysis
     */
    select?: FaceAnalysisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FaceAnalysisInclude<ExtArgs> | null
    /**
     * The data needed to update a FaceAnalysis.
     */
    data: XOR<FaceAnalysisUpdateInput, FaceAnalysisUncheckedUpdateInput>
    /**
     * Choose, which FaceAnalysis to update.
     */
    where: FaceAnalysisWhereUniqueInput
  }

  /**
   * FaceAnalysis updateMany
   */
  export type FaceAnalysisUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FaceAnalyses.
     */
    data: XOR<FaceAnalysisUpdateManyMutationInput, FaceAnalysisUncheckedUpdateManyInput>
    /**
     * Filter which FaceAnalyses to update
     */
    where?: FaceAnalysisWhereInput
  }

  /**
   * FaceAnalysis upsert
   */
  export type FaceAnalysisUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FaceAnalysis
     */
    select?: FaceAnalysisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FaceAnalysisInclude<ExtArgs> | null
    /**
     * The filter to search for the FaceAnalysis to update in case it exists.
     */
    where: FaceAnalysisWhereUniqueInput
    /**
     * In case the FaceAnalysis found by the `where` argument doesn't exist, create a new FaceAnalysis with this data.
     */
    create: XOR<FaceAnalysisCreateInput, FaceAnalysisUncheckedCreateInput>
    /**
     * In case the FaceAnalysis was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FaceAnalysisUpdateInput, FaceAnalysisUncheckedUpdateInput>
  }

  /**
   * FaceAnalysis delete
   */
  export type FaceAnalysisDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FaceAnalysis
     */
    select?: FaceAnalysisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FaceAnalysisInclude<ExtArgs> | null
    /**
     * Filter which FaceAnalysis to delete.
     */
    where: FaceAnalysisWhereUniqueInput
  }

  /**
   * FaceAnalysis deleteMany
   */
  export type FaceAnalysisDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FaceAnalyses to delete
     */
    where?: FaceAnalysisWhereInput
  }

  /**
   * FaceAnalysis without action
   */
  export type FaceAnalysisDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FaceAnalysis
     */
    select?: FaceAnalysisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FaceAnalysisInclude<ExtArgs> | null
  }


  /**
   * Model Generation
   */

  export type AggregateGeneration = {
    _count: GenerationCountAggregateOutputType | null
    _min: GenerationMinAggregateOutputType | null
    _max: GenerationMaxAggregateOutputType | null
  }

  export type GenerationMinAggregateOutputType = {
    id: string | null
    userId: string | null
    photoId: string | null
    prompt: string | null
    status: string | null
    replicatePredictionId: string | null
    resultR2Key: string | null
    resultR2Url: string | null
    error: string | null
    styleId: string | null
    styleName: string | null
    mode: string | null
    batchId: string | null
    hairColor: string | null
    referencePhotoId: string | null
    shareToken: string | null
    createdAt: Date | null
    completedAt: Date | null
  }

  export type GenerationMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    photoId: string | null
    prompt: string | null
    status: string | null
    replicatePredictionId: string | null
    resultR2Key: string | null
    resultR2Url: string | null
    error: string | null
    styleId: string | null
    styleName: string | null
    mode: string | null
    batchId: string | null
    hairColor: string | null
    referencePhotoId: string | null
    shareToken: string | null
    createdAt: Date | null
    completedAt: Date | null
  }

  export type GenerationCountAggregateOutputType = {
    id: number
    userId: number
    photoId: number
    prompt: number
    status: number
    replicatePredictionId: number
    resultR2Key: number
    resultR2Url: number
    error: number
    styleId: number
    styleName: number
    mode: number
    batchId: number
    hairColor: number
    referencePhotoId: number
    shareToken: number
    createdAt: number
    completedAt: number
    _all: number
  }


  export type GenerationMinAggregateInputType = {
    id?: true
    userId?: true
    photoId?: true
    prompt?: true
    status?: true
    replicatePredictionId?: true
    resultR2Key?: true
    resultR2Url?: true
    error?: true
    styleId?: true
    styleName?: true
    mode?: true
    batchId?: true
    hairColor?: true
    referencePhotoId?: true
    shareToken?: true
    createdAt?: true
    completedAt?: true
  }

  export type GenerationMaxAggregateInputType = {
    id?: true
    userId?: true
    photoId?: true
    prompt?: true
    status?: true
    replicatePredictionId?: true
    resultR2Key?: true
    resultR2Url?: true
    error?: true
    styleId?: true
    styleName?: true
    mode?: true
    batchId?: true
    hairColor?: true
    referencePhotoId?: true
    shareToken?: true
    createdAt?: true
    completedAt?: true
  }

  export type GenerationCountAggregateInputType = {
    id?: true
    userId?: true
    photoId?: true
    prompt?: true
    status?: true
    replicatePredictionId?: true
    resultR2Key?: true
    resultR2Url?: true
    error?: true
    styleId?: true
    styleName?: true
    mode?: true
    batchId?: true
    hairColor?: true
    referencePhotoId?: true
    shareToken?: true
    createdAt?: true
    completedAt?: true
    _all?: true
  }

  export type GenerationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Generation to aggregate.
     */
    where?: GenerationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Generations to fetch.
     */
    orderBy?: GenerationOrderByWithRelationInput | GenerationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GenerationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Generations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Generations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Generations
    **/
    _count?: true | GenerationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GenerationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GenerationMaxAggregateInputType
  }

  export type GetGenerationAggregateType<T extends GenerationAggregateArgs> = {
        [P in keyof T & keyof AggregateGeneration]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGeneration[P]>
      : GetScalarType<T[P], AggregateGeneration[P]>
  }




  export type GenerationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GenerationWhereInput
    orderBy?: GenerationOrderByWithAggregationInput | GenerationOrderByWithAggregationInput[]
    by: GenerationScalarFieldEnum[] | GenerationScalarFieldEnum
    having?: GenerationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GenerationCountAggregateInputType | true
    _min?: GenerationMinAggregateInputType
    _max?: GenerationMaxAggregateInputType
  }

  export type GenerationGroupByOutputType = {
    id: string
    userId: string
    photoId: string
    prompt: string
    status: string
    replicatePredictionId: string | null
    resultR2Key: string | null
    resultR2Url: string | null
    error: string | null
    styleId: string | null
    styleName: string | null
    mode: string
    batchId: string | null
    hairColor: string | null
    referencePhotoId: string | null
    shareToken: string | null
    createdAt: Date
    completedAt: Date | null
    _count: GenerationCountAggregateOutputType | null
    _min: GenerationMinAggregateOutputType | null
    _max: GenerationMaxAggregateOutputType | null
  }

  type GetGenerationGroupByPayload<T extends GenerationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GenerationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GenerationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GenerationGroupByOutputType[P]>
            : GetScalarType<T[P], GenerationGroupByOutputType[P]>
        }
      >
    >


  export type GenerationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    photoId?: boolean
    prompt?: boolean
    status?: boolean
    replicatePredictionId?: boolean
    resultR2Key?: boolean
    resultR2Url?: boolean
    error?: boolean
    styleId?: boolean
    styleName?: boolean
    mode?: boolean
    batchId?: boolean
    hairColor?: boolean
    referencePhotoId?: boolean
    shareToken?: boolean
    createdAt?: boolean
    completedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    photo?: boolean | PhotoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["generation"]>

  export type GenerationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    photoId?: boolean
    prompt?: boolean
    status?: boolean
    replicatePredictionId?: boolean
    resultR2Key?: boolean
    resultR2Url?: boolean
    error?: boolean
    styleId?: boolean
    styleName?: boolean
    mode?: boolean
    batchId?: boolean
    hairColor?: boolean
    referencePhotoId?: boolean
    shareToken?: boolean
    createdAt?: boolean
    completedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    photo?: boolean | PhotoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["generation"]>

  export type GenerationSelectScalar = {
    id?: boolean
    userId?: boolean
    photoId?: boolean
    prompt?: boolean
    status?: boolean
    replicatePredictionId?: boolean
    resultR2Key?: boolean
    resultR2Url?: boolean
    error?: boolean
    styleId?: boolean
    styleName?: boolean
    mode?: boolean
    batchId?: boolean
    hairColor?: boolean
    referencePhotoId?: boolean
    shareToken?: boolean
    createdAt?: boolean
    completedAt?: boolean
  }

  export type GenerationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    photo?: boolean | PhotoDefaultArgs<ExtArgs>
  }
  export type GenerationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    photo?: boolean | PhotoDefaultArgs<ExtArgs>
  }

  export type $GenerationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Generation"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      photo: Prisma.$PhotoPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      photoId: string
      prompt: string
      status: string
      replicatePredictionId: string | null
      resultR2Key: string | null
      resultR2Url: string | null
      error: string | null
      styleId: string | null
      styleName: string | null
      mode: string
      batchId: string | null
      hairColor: string | null
      referencePhotoId: string | null
      shareToken: string | null
      createdAt: Date
      completedAt: Date | null
    }, ExtArgs["result"]["generation"]>
    composites: {}
  }

  type GenerationGetPayload<S extends boolean | null | undefined | GenerationDefaultArgs> = $Result.GetResult<Prisma.$GenerationPayload, S>

  type GenerationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<GenerationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: GenerationCountAggregateInputType | true
    }

  export interface GenerationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Generation'], meta: { name: 'Generation' } }
    /**
     * Find zero or one Generation that matches the filter.
     * @param {GenerationFindUniqueArgs} args - Arguments to find a Generation
     * @example
     * // Get one Generation
     * const generation = await prisma.generation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GenerationFindUniqueArgs>(args: SelectSubset<T, GenerationFindUniqueArgs<ExtArgs>>): Prisma__GenerationClient<$Result.GetResult<Prisma.$GenerationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Generation that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {GenerationFindUniqueOrThrowArgs} args - Arguments to find a Generation
     * @example
     * // Get one Generation
     * const generation = await prisma.generation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GenerationFindUniqueOrThrowArgs>(args: SelectSubset<T, GenerationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GenerationClient<$Result.GetResult<Prisma.$GenerationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Generation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GenerationFindFirstArgs} args - Arguments to find a Generation
     * @example
     * // Get one Generation
     * const generation = await prisma.generation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GenerationFindFirstArgs>(args?: SelectSubset<T, GenerationFindFirstArgs<ExtArgs>>): Prisma__GenerationClient<$Result.GetResult<Prisma.$GenerationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Generation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GenerationFindFirstOrThrowArgs} args - Arguments to find a Generation
     * @example
     * // Get one Generation
     * const generation = await prisma.generation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GenerationFindFirstOrThrowArgs>(args?: SelectSubset<T, GenerationFindFirstOrThrowArgs<ExtArgs>>): Prisma__GenerationClient<$Result.GetResult<Prisma.$GenerationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Generations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GenerationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Generations
     * const generations = await prisma.generation.findMany()
     * 
     * // Get first 10 Generations
     * const generations = await prisma.generation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const generationWithIdOnly = await prisma.generation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GenerationFindManyArgs>(args?: SelectSubset<T, GenerationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GenerationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Generation.
     * @param {GenerationCreateArgs} args - Arguments to create a Generation.
     * @example
     * // Create one Generation
     * const Generation = await prisma.generation.create({
     *   data: {
     *     // ... data to create a Generation
     *   }
     * })
     * 
     */
    create<T extends GenerationCreateArgs>(args: SelectSubset<T, GenerationCreateArgs<ExtArgs>>): Prisma__GenerationClient<$Result.GetResult<Prisma.$GenerationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Generations.
     * @param {GenerationCreateManyArgs} args - Arguments to create many Generations.
     * @example
     * // Create many Generations
     * const generation = await prisma.generation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GenerationCreateManyArgs>(args?: SelectSubset<T, GenerationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Generations and returns the data saved in the database.
     * @param {GenerationCreateManyAndReturnArgs} args - Arguments to create many Generations.
     * @example
     * // Create many Generations
     * const generation = await prisma.generation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Generations and only return the `id`
     * const generationWithIdOnly = await prisma.generation.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GenerationCreateManyAndReturnArgs>(args?: SelectSubset<T, GenerationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GenerationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Generation.
     * @param {GenerationDeleteArgs} args - Arguments to delete one Generation.
     * @example
     * // Delete one Generation
     * const Generation = await prisma.generation.delete({
     *   where: {
     *     // ... filter to delete one Generation
     *   }
     * })
     * 
     */
    delete<T extends GenerationDeleteArgs>(args: SelectSubset<T, GenerationDeleteArgs<ExtArgs>>): Prisma__GenerationClient<$Result.GetResult<Prisma.$GenerationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Generation.
     * @param {GenerationUpdateArgs} args - Arguments to update one Generation.
     * @example
     * // Update one Generation
     * const generation = await prisma.generation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GenerationUpdateArgs>(args: SelectSubset<T, GenerationUpdateArgs<ExtArgs>>): Prisma__GenerationClient<$Result.GetResult<Prisma.$GenerationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Generations.
     * @param {GenerationDeleteManyArgs} args - Arguments to filter Generations to delete.
     * @example
     * // Delete a few Generations
     * const { count } = await prisma.generation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GenerationDeleteManyArgs>(args?: SelectSubset<T, GenerationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Generations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GenerationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Generations
     * const generation = await prisma.generation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GenerationUpdateManyArgs>(args: SelectSubset<T, GenerationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Generation.
     * @param {GenerationUpsertArgs} args - Arguments to update or create a Generation.
     * @example
     * // Update or create a Generation
     * const generation = await prisma.generation.upsert({
     *   create: {
     *     // ... data to create a Generation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Generation we want to update
     *   }
     * })
     */
    upsert<T extends GenerationUpsertArgs>(args: SelectSubset<T, GenerationUpsertArgs<ExtArgs>>): Prisma__GenerationClient<$Result.GetResult<Prisma.$GenerationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Generations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GenerationCountArgs} args - Arguments to filter Generations to count.
     * @example
     * // Count the number of Generations
     * const count = await prisma.generation.count({
     *   where: {
     *     // ... the filter for the Generations we want to count
     *   }
     * })
    **/
    count<T extends GenerationCountArgs>(
      args?: Subset<T, GenerationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GenerationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Generation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GenerationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GenerationAggregateArgs>(args: Subset<T, GenerationAggregateArgs>): Prisma.PrismaPromise<GetGenerationAggregateType<T>>

    /**
     * Group by Generation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GenerationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GenerationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GenerationGroupByArgs['orderBy'] }
        : { orderBy?: GenerationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GenerationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGenerationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Generation model
   */
  readonly fields: GenerationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Generation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GenerationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    photo<T extends PhotoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PhotoDefaultArgs<ExtArgs>>): Prisma__PhotoClient<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Generation model
   */ 
  interface GenerationFieldRefs {
    readonly id: FieldRef<"Generation", 'String'>
    readonly userId: FieldRef<"Generation", 'String'>
    readonly photoId: FieldRef<"Generation", 'String'>
    readonly prompt: FieldRef<"Generation", 'String'>
    readonly status: FieldRef<"Generation", 'String'>
    readonly replicatePredictionId: FieldRef<"Generation", 'String'>
    readonly resultR2Key: FieldRef<"Generation", 'String'>
    readonly resultR2Url: FieldRef<"Generation", 'String'>
    readonly error: FieldRef<"Generation", 'String'>
    readonly styleId: FieldRef<"Generation", 'String'>
    readonly styleName: FieldRef<"Generation", 'String'>
    readonly mode: FieldRef<"Generation", 'String'>
    readonly batchId: FieldRef<"Generation", 'String'>
    readonly hairColor: FieldRef<"Generation", 'String'>
    readonly referencePhotoId: FieldRef<"Generation", 'String'>
    readonly shareToken: FieldRef<"Generation", 'String'>
    readonly createdAt: FieldRef<"Generation", 'DateTime'>
    readonly completedAt: FieldRef<"Generation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Generation findUnique
   */
  export type GenerationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Generation
     */
    select?: GenerationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GenerationInclude<ExtArgs> | null
    /**
     * Filter, which Generation to fetch.
     */
    where: GenerationWhereUniqueInput
  }

  /**
   * Generation findUniqueOrThrow
   */
  export type GenerationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Generation
     */
    select?: GenerationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GenerationInclude<ExtArgs> | null
    /**
     * Filter, which Generation to fetch.
     */
    where: GenerationWhereUniqueInput
  }

  /**
   * Generation findFirst
   */
  export type GenerationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Generation
     */
    select?: GenerationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GenerationInclude<ExtArgs> | null
    /**
     * Filter, which Generation to fetch.
     */
    where?: GenerationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Generations to fetch.
     */
    orderBy?: GenerationOrderByWithRelationInput | GenerationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Generations.
     */
    cursor?: GenerationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Generations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Generations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Generations.
     */
    distinct?: GenerationScalarFieldEnum | GenerationScalarFieldEnum[]
  }

  /**
   * Generation findFirstOrThrow
   */
  export type GenerationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Generation
     */
    select?: GenerationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GenerationInclude<ExtArgs> | null
    /**
     * Filter, which Generation to fetch.
     */
    where?: GenerationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Generations to fetch.
     */
    orderBy?: GenerationOrderByWithRelationInput | GenerationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Generations.
     */
    cursor?: GenerationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Generations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Generations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Generations.
     */
    distinct?: GenerationScalarFieldEnum | GenerationScalarFieldEnum[]
  }

  /**
   * Generation findMany
   */
  export type GenerationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Generation
     */
    select?: GenerationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GenerationInclude<ExtArgs> | null
    /**
     * Filter, which Generations to fetch.
     */
    where?: GenerationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Generations to fetch.
     */
    orderBy?: GenerationOrderByWithRelationInput | GenerationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Generations.
     */
    cursor?: GenerationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Generations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Generations.
     */
    skip?: number
    distinct?: GenerationScalarFieldEnum | GenerationScalarFieldEnum[]
  }

  /**
   * Generation create
   */
  export type GenerationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Generation
     */
    select?: GenerationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GenerationInclude<ExtArgs> | null
    /**
     * The data needed to create a Generation.
     */
    data: XOR<GenerationCreateInput, GenerationUncheckedCreateInput>
  }

  /**
   * Generation createMany
   */
  export type GenerationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Generations.
     */
    data: GenerationCreateManyInput | GenerationCreateManyInput[]
  }

  /**
   * Generation createManyAndReturn
   */
  export type GenerationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Generation
     */
    select?: GenerationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Generations.
     */
    data: GenerationCreateManyInput | GenerationCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GenerationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Generation update
   */
  export type GenerationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Generation
     */
    select?: GenerationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GenerationInclude<ExtArgs> | null
    /**
     * The data needed to update a Generation.
     */
    data: XOR<GenerationUpdateInput, GenerationUncheckedUpdateInput>
    /**
     * Choose, which Generation to update.
     */
    where: GenerationWhereUniqueInput
  }

  /**
   * Generation updateMany
   */
  export type GenerationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Generations.
     */
    data: XOR<GenerationUpdateManyMutationInput, GenerationUncheckedUpdateManyInput>
    /**
     * Filter which Generations to update
     */
    where?: GenerationWhereInput
  }

  /**
   * Generation upsert
   */
  export type GenerationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Generation
     */
    select?: GenerationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GenerationInclude<ExtArgs> | null
    /**
     * The filter to search for the Generation to update in case it exists.
     */
    where: GenerationWhereUniqueInput
    /**
     * In case the Generation found by the `where` argument doesn't exist, create a new Generation with this data.
     */
    create: XOR<GenerationCreateInput, GenerationUncheckedCreateInput>
    /**
     * In case the Generation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GenerationUpdateInput, GenerationUncheckedUpdateInput>
  }

  /**
   * Generation delete
   */
  export type GenerationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Generation
     */
    select?: GenerationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GenerationInclude<ExtArgs> | null
    /**
     * Filter which Generation to delete.
     */
    where: GenerationWhereUniqueInput
  }

  /**
   * Generation deleteMany
   */
  export type GenerationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Generations to delete
     */
    where?: GenerationWhereInput
  }

  /**
   * Generation without action
   */
  export type GenerationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Generation
     */
    select?: GenerationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GenerationInclude<ExtArgs> | null
  }


  /**
   * Model Subscription
   */

  export type AggregateSubscription = {
    _count: SubscriptionCountAggregateOutputType | null
    _min: SubscriptionMinAggregateOutputType | null
    _max: SubscriptionMaxAggregateOutputType | null
  }

  export type SubscriptionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    stripeSubId: string | null
    status: string | null
    stripeCustomerId: string | null
    currentPeriodEnd: Date | null
    cancelAtPeriodEnd: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SubscriptionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    stripeSubId: string | null
    status: string | null
    stripeCustomerId: string | null
    currentPeriodEnd: Date | null
    cancelAtPeriodEnd: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SubscriptionCountAggregateOutputType = {
    id: number
    userId: number
    stripeSubId: number
    status: number
    stripeCustomerId: number
    currentPeriodEnd: number
    cancelAtPeriodEnd: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SubscriptionMinAggregateInputType = {
    id?: true
    userId?: true
    stripeSubId?: true
    status?: true
    stripeCustomerId?: true
    currentPeriodEnd?: true
    cancelAtPeriodEnd?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SubscriptionMaxAggregateInputType = {
    id?: true
    userId?: true
    stripeSubId?: true
    status?: true
    stripeCustomerId?: true
    currentPeriodEnd?: true
    cancelAtPeriodEnd?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SubscriptionCountAggregateInputType = {
    id?: true
    userId?: true
    stripeSubId?: true
    status?: true
    stripeCustomerId?: true
    currentPeriodEnd?: true
    cancelAtPeriodEnd?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SubscriptionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Subscription to aggregate.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Subscriptions
    **/
    _count?: true | SubscriptionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SubscriptionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SubscriptionMaxAggregateInputType
  }

  export type GetSubscriptionAggregateType<T extends SubscriptionAggregateArgs> = {
        [P in keyof T & keyof AggregateSubscription]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubscription[P]>
      : GetScalarType<T[P], AggregateSubscription[P]>
  }




  export type SubscriptionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubscriptionWhereInput
    orderBy?: SubscriptionOrderByWithAggregationInput | SubscriptionOrderByWithAggregationInput[]
    by: SubscriptionScalarFieldEnum[] | SubscriptionScalarFieldEnum
    having?: SubscriptionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SubscriptionCountAggregateInputType | true
    _min?: SubscriptionMinAggregateInputType
    _max?: SubscriptionMaxAggregateInputType
  }

  export type SubscriptionGroupByOutputType = {
    id: string
    userId: string
    stripeSubId: string | null
    status: string
    stripeCustomerId: string | null
    currentPeriodEnd: Date | null
    cancelAtPeriodEnd: boolean
    createdAt: Date
    updatedAt: Date
    _count: SubscriptionCountAggregateOutputType | null
    _min: SubscriptionMinAggregateOutputType | null
    _max: SubscriptionMaxAggregateOutputType | null
  }

  type GetSubscriptionGroupByPayload<T extends SubscriptionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SubscriptionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SubscriptionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SubscriptionGroupByOutputType[P]>
            : GetScalarType<T[P], SubscriptionGroupByOutputType[P]>
        }
      >
    >


  export type SubscriptionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    stripeSubId?: boolean
    status?: boolean
    stripeCustomerId?: boolean
    currentPeriodEnd?: boolean
    cancelAtPeriodEnd?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscription"]>

  export type SubscriptionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    stripeSubId?: boolean
    status?: boolean
    stripeCustomerId?: boolean
    currentPeriodEnd?: boolean
    cancelAtPeriodEnd?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscription"]>

  export type SubscriptionSelectScalar = {
    id?: boolean
    userId?: boolean
    stripeSubId?: boolean
    status?: boolean
    stripeCustomerId?: boolean
    currentPeriodEnd?: boolean
    cancelAtPeriodEnd?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SubscriptionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SubscriptionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SubscriptionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Subscription"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      stripeSubId: string | null
      status: string
      stripeCustomerId: string | null
      currentPeriodEnd: Date | null
      cancelAtPeriodEnd: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["subscription"]>
    composites: {}
  }

  type SubscriptionGetPayload<S extends boolean | null | undefined | SubscriptionDefaultArgs> = $Result.GetResult<Prisma.$SubscriptionPayload, S>

  type SubscriptionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SubscriptionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SubscriptionCountAggregateInputType | true
    }

  export interface SubscriptionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Subscription'], meta: { name: 'Subscription' } }
    /**
     * Find zero or one Subscription that matches the filter.
     * @param {SubscriptionFindUniqueArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SubscriptionFindUniqueArgs>(args: SelectSubset<T, SubscriptionFindUniqueArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Subscription that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SubscriptionFindUniqueOrThrowArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SubscriptionFindUniqueOrThrowArgs>(args: SelectSubset<T, SubscriptionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Subscription that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionFindFirstArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SubscriptionFindFirstArgs>(args?: SelectSubset<T, SubscriptionFindFirstArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Subscription that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionFindFirstOrThrowArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SubscriptionFindFirstOrThrowArgs>(args?: SelectSubset<T, SubscriptionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Subscriptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Subscriptions
     * const subscriptions = await prisma.subscription.findMany()
     * 
     * // Get first 10 Subscriptions
     * const subscriptions = await prisma.subscription.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const subscriptionWithIdOnly = await prisma.subscription.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SubscriptionFindManyArgs>(args?: SelectSubset<T, SubscriptionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Subscription.
     * @param {SubscriptionCreateArgs} args - Arguments to create a Subscription.
     * @example
     * // Create one Subscription
     * const Subscription = await prisma.subscription.create({
     *   data: {
     *     // ... data to create a Subscription
     *   }
     * })
     * 
     */
    create<T extends SubscriptionCreateArgs>(args: SelectSubset<T, SubscriptionCreateArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Subscriptions.
     * @param {SubscriptionCreateManyArgs} args - Arguments to create many Subscriptions.
     * @example
     * // Create many Subscriptions
     * const subscription = await prisma.subscription.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SubscriptionCreateManyArgs>(args?: SelectSubset<T, SubscriptionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Subscriptions and returns the data saved in the database.
     * @param {SubscriptionCreateManyAndReturnArgs} args - Arguments to create many Subscriptions.
     * @example
     * // Create many Subscriptions
     * const subscription = await prisma.subscription.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Subscriptions and only return the `id`
     * const subscriptionWithIdOnly = await prisma.subscription.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SubscriptionCreateManyAndReturnArgs>(args?: SelectSubset<T, SubscriptionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Subscription.
     * @param {SubscriptionDeleteArgs} args - Arguments to delete one Subscription.
     * @example
     * // Delete one Subscription
     * const Subscription = await prisma.subscription.delete({
     *   where: {
     *     // ... filter to delete one Subscription
     *   }
     * })
     * 
     */
    delete<T extends SubscriptionDeleteArgs>(args: SelectSubset<T, SubscriptionDeleteArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Subscription.
     * @param {SubscriptionUpdateArgs} args - Arguments to update one Subscription.
     * @example
     * // Update one Subscription
     * const subscription = await prisma.subscription.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SubscriptionUpdateArgs>(args: SelectSubset<T, SubscriptionUpdateArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Subscriptions.
     * @param {SubscriptionDeleteManyArgs} args - Arguments to filter Subscriptions to delete.
     * @example
     * // Delete a few Subscriptions
     * const { count } = await prisma.subscription.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SubscriptionDeleteManyArgs>(args?: SelectSubset<T, SubscriptionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Subscriptions
     * const subscription = await prisma.subscription.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SubscriptionUpdateManyArgs>(args: SelectSubset<T, SubscriptionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Subscription.
     * @param {SubscriptionUpsertArgs} args - Arguments to update or create a Subscription.
     * @example
     * // Update or create a Subscription
     * const subscription = await prisma.subscription.upsert({
     *   create: {
     *     // ... data to create a Subscription
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Subscription we want to update
     *   }
     * })
     */
    upsert<T extends SubscriptionUpsertArgs>(args: SelectSubset<T, SubscriptionUpsertArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionCountArgs} args - Arguments to filter Subscriptions to count.
     * @example
     * // Count the number of Subscriptions
     * const count = await prisma.subscription.count({
     *   where: {
     *     // ... the filter for the Subscriptions we want to count
     *   }
     * })
    **/
    count<T extends SubscriptionCountArgs>(
      args?: Subset<T, SubscriptionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SubscriptionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Subscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SubscriptionAggregateArgs>(args: Subset<T, SubscriptionAggregateArgs>): Prisma.PrismaPromise<GetSubscriptionAggregateType<T>>

    /**
     * Group by Subscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SubscriptionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SubscriptionGroupByArgs['orderBy'] }
        : { orderBy?: SubscriptionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SubscriptionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubscriptionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Subscription model
   */
  readonly fields: SubscriptionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Subscription.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SubscriptionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Subscription model
   */ 
  interface SubscriptionFieldRefs {
    readonly id: FieldRef<"Subscription", 'String'>
    readonly userId: FieldRef<"Subscription", 'String'>
    readonly stripeSubId: FieldRef<"Subscription", 'String'>
    readonly status: FieldRef<"Subscription", 'String'>
    readonly stripeCustomerId: FieldRef<"Subscription", 'String'>
    readonly currentPeriodEnd: FieldRef<"Subscription", 'DateTime'>
    readonly cancelAtPeriodEnd: FieldRef<"Subscription", 'Boolean'>
    readonly createdAt: FieldRef<"Subscription", 'DateTime'>
    readonly updatedAt: FieldRef<"Subscription", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Subscription findUnique
   */
  export type SubscriptionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription findUniqueOrThrow
   */
  export type SubscriptionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription findFirst
   */
  export type SubscriptionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Subscriptions.
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Subscriptions.
     */
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * Subscription findFirstOrThrow
   */
  export type SubscriptionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Subscriptions.
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Subscriptions.
     */
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * Subscription findMany
   */
  export type SubscriptionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscriptions to fetch.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Subscriptions.
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * Subscription create
   */
  export type SubscriptionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to create a Subscription.
     */
    data: XOR<SubscriptionCreateInput, SubscriptionUncheckedCreateInput>
  }

  /**
   * Subscription createMany
   */
  export type SubscriptionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Subscriptions.
     */
    data: SubscriptionCreateManyInput | SubscriptionCreateManyInput[]
  }

  /**
   * Subscription createManyAndReturn
   */
  export type SubscriptionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Subscriptions.
     */
    data: SubscriptionCreateManyInput | SubscriptionCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Subscription update
   */
  export type SubscriptionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to update a Subscription.
     */
    data: XOR<SubscriptionUpdateInput, SubscriptionUncheckedUpdateInput>
    /**
     * Choose, which Subscription to update.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription updateMany
   */
  export type SubscriptionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Subscriptions.
     */
    data: XOR<SubscriptionUpdateManyMutationInput, SubscriptionUncheckedUpdateManyInput>
    /**
     * Filter which Subscriptions to update
     */
    where?: SubscriptionWhereInput
  }

  /**
   * Subscription upsert
   */
  export type SubscriptionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * The filter to search for the Subscription to update in case it exists.
     */
    where: SubscriptionWhereUniqueInput
    /**
     * In case the Subscription found by the `where` argument doesn't exist, create a new Subscription with this data.
     */
    create: XOR<SubscriptionCreateInput, SubscriptionUncheckedCreateInput>
    /**
     * In case the Subscription was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SubscriptionUpdateInput, SubscriptionUncheckedUpdateInput>
  }

  /**
   * Subscription delete
   */
  export type SubscriptionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter which Subscription to delete.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription deleteMany
   */
  export type SubscriptionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Subscriptions to delete
     */
    where?: SubscriptionWhereInput
  }

  /**
   * Subscription without action
   */
  export type SubscriptionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
  }


  /**
   * Model Quota
   */

  export type AggregateQuota = {
    _count: QuotaCountAggregateOutputType | null
    _avg: QuotaAvgAggregateOutputType | null
    _sum: QuotaSumAggregateOutputType | null
    _min: QuotaMinAggregateOutputType | null
    _max: QuotaMaxAggregateOutputType | null
  }

  export type QuotaAvgAggregateOutputType = {
    freeUsedThisMonth: number | null
    paidCredits: number | null
  }

  export type QuotaSumAggregateOutputType = {
    freeUsedThisMonth: number | null
    paidCredits: number | null
  }

  export type QuotaMinAggregateOutputType = {
    id: string | null
    userId: string | null
    freeUsedThisMonth: number | null
    freeResetAt: Date | null
    paidCredits: number | null
    updatedAt: Date | null
  }

  export type QuotaMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    freeUsedThisMonth: number | null
    freeResetAt: Date | null
    paidCredits: number | null
    updatedAt: Date | null
  }

  export type QuotaCountAggregateOutputType = {
    id: number
    userId: number
    freeUsedThisMonth: number
    freeResetAt: number
    paidCredits: number
    updatedAt: number
    _all: number
  }


  export type QuotaAvgAggregateInputType = {
    freeUsedThisMonth?: true
    paidCredits?: true
  }

  export type QuotaSumAggregateInputType = {
    freeUsedThisMonth?: true
    paidCredits?: true
  }

  export type QuotaMinAggregateInputType = {
    id?: true
    userId?: true
    freeUsedThisMonth?: true
    freeResetAt?: true
    paidCredits?: true
    updatedAt?: true
  }

  export type QuotaMaxAggregateInputType = {
    id?: true
    userId?: true
    freeUsedThisMonth?: true
    freeResetAt?: true
    paidCredits?: true
    updatedAt?: true
  }

  export type QuotaCountAggregateInputType = {
    id?: true
    userId?: true
    freeUsedThisMonth?: true
    freeResetAt?: true
    paidCredits?: true
    updatedAt?: true
    _all?: true
  }

  export type QuotaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Quota to aggregate.
     */
    where?: QuotaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Quotas to fetch.
     */
    orderBy?: QuotaOrderByWithRelationInput | QuotaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: QuotaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Quotas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Quotas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Quotas
    **/
    _count?: true | QuotaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: QuotaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: QuotaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: QuotaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: QuotaMaxAggregateInputType
  }

  export type GetQuotaAggregateType<T extends QuotaAggregateArgs> = {
        [P in keyof T & keyof AggregateQuota]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQuota[P]>
      : GetScalarType<T[P], AggregateQuota[P]>
  }




  export type QuotaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuotaWhereInput
    orderBy?: QuotaOrderByWithAggregationInput | QuotaOrderByWithAggregationInput[]
    by: QuotaScalarFieldEnum[] | QuotaScalarFieldEnum
    having?: QuotaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: QuotaCountAggregateInputType | true
    _avg?: QuotaAvgAggregateInputType
    _sum?: QuotaSumAggregateInputType
    _min?: QuotaMinAggregateInputType
    _max?: QuotaMaxAggregateInputType
  }

  export type QuotaGroupByOutputType = {
    id: string
    userId: string
    freeUsedThisMonth: number
    freeResetAt: Date
    paidCredits: number
    updatedAt: Date
    _count: QuotaCountAggregateOutputType | null
    _avg: QuotaAvgAggregateOutputType | null
    _sum: QuotaSumAggregateOutputType | null
    _min: QuotaMinAggregateOutputType | null
    _max: QuotaMaxAggregateOutputType | null
  }

  type GetQuotaGroupByPayload<T extends QuotaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<QuotaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof QuotaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], QuotaGroupByOutputType[P]>
            : GetScalarType<T[P], QuotaGroupByOutputType[P]>
        }
      >
    >


  export type QuotaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    freeUsedThisMonth?: boolean
    freeResetAt?: boolean
    paidCredits?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["quota"]>

  export type QuotaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    freeUsedThisMonth?: boolean
    freeResetAt?: boolean
    paidCredits?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["quota"]>

  export type QuotaSelectScalar = {
    id?: boolean
    userId?: boolean
    freeUsedThisMonth?: boolean
    freeResetAt?: boolean
    paidCredits?: boolean
    updatedAt?: boolean
  }

  export type QuotaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type QuotaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $QuotaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Quota"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      freeUsedThisMonth: number
      freeResetAt: Date
      paidCredits: number
      updatedAt: Date
    }, ExtArgs["result"]["quota"]>
    composites: {}
  }

  type QuotaGetPayload<S extends boolean | null | undefined | QuotaDefaultArgs> = $Result.GetResult<Prisma.$QuotaPayload, S>

  type QuotaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<QuotaFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: QuotaCountAggregateInputType | true
    }

  export interface QuotaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Quota'], meta: { name: 'Quota' } }
    /**
     * Find zero or one Quota that matches the filter.
     * @param {QuotaFindUniqueArgs} args - Arguments to find a Quota
     * @example
     * // Get one Quota
     * const quota = await prisma.quota.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends QuotaFindUniqueArgs>(args: SelectSubset<T, QuotaFindUniqueArgs<ExtArgs>>): Prisma__QuotaClient<$Result.GetResult<Prisma.$QuotaPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Quota that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {QuotaFindUniqueOrThrowArgs} args - Arguments to find a Quota
     * @example
     * // Get one Quota
     * const quota = await prisma.quota.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends QuotaFindUniqueOrThrowArgs>(args: SelectSubset<T, QuotaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__QuotaClient<$Result.GetResult<Prisma.$QuotaPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Quota that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuotaFindFirstArgs} args - Arguments to find a Quota
     * @example
     * // Get one Quota
     * const quota = await prisma.quota.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends QuotaFindFirstArgs>(args?: SelectSubset<T, QuotaFindFirstArgs<ExtArgs>>): Prisma__QuotaClient<$Result.GetResult<Prisma.$QuotaPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Quota that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuotaFindFirstOrThrowArgs} args - Arguments to find a Quota
     * @example
     * // Get one Quota
     * const quota = await prisma.quota.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends QuotaFindFirstOrThrowArgs>(args?: SelectSubset<T, QuotaFindFirstOrThrowArgs<ExtArgs>>): Prisma__QuotaClient<$Result.GetResult<Prisma.$QuotaPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Quotas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuotaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Quotas
     * const quotas = await prisma.quota.findMany()
     * 
     * // Get first 10 Quotas
     * const quotas = await prisma.quota.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const quotaWithIdOnly = await prisma.quota.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends QuotaFindManyArgs>(args?: SelectSubset<T, QuotaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuotaPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Quota.
     * @param {QuotaCreateArgs} args - Arguments to create a Quota.
     * @example
     * // Create one Quota
     * const Quota = await prisma.quota.create({
     *   data: {
     *     // ... data to create a Quota
     *   }
     * })
     * 
     */
    create<T extends QuotaCreateArgs>(args: SelectSubset<T, QuotaCreateArgs<ExtArgs>>): Prisma__QuotaClient<$Result.GetResult<Prisma.$QuotaPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Quotas.
     * @param {QuotaCreateManyArgs} args - Arguments to create many Quotas.
     * @example
     * // Create many Quotas
     * const quota = await prisma.quota.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends QuotaCreateManyArgs>(args?: SelectSubset<T, QuotaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Quotas and returns the data saved in the database.
     * @param {QuotaCreateManyAndReturnArgs} args - Arguments to create many Quotas.
     * @example
     * // Create many Quotas
     * const quota = await prisma.quota.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Quotas and only return the `id`
     * const quotaWithIdOnly = await prisma.quota.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends QuotaCreateManyAndReturnArgs>(args?: SelectSubset<T, QuotaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuotaPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Quota.
     * @param {QuotaDeleteArgs} args - Arguments to delete one Quota.
     * @example
     * // Delete one Quota
     * const Quota = await prisma.quota.delete({
     *   where: {
     *     // ... filter to delete one Quota
     *   }
     * })
     * 
     */
    delete<T extends QuotaDeleteArgs>(args: SelectSubset<T, QuotaDeleteArgs<ExtArgs>>): Prisma__QuotaClient<$Result.GetResult<Prisma.$QuotaPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Quota.
     * @param {QuotaUpdateArgs} args - Arguments to update one Quota.
     * @example
     * // Update one Quota
     * const quota = await prisma.quota.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends QuotaUpdateArgs>(args: SelectSubset<T, QuotaUpdateArgs<ExtArgs>>): Prisma__QuotaClient<$Result.GetResult<Prisma.$QuotaPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Quotas.
     * @param {QuotaDeleteManyArgs} args - Arguments to filter Quotas to delete.
     * @example
     * // Delete a few Quotas
     * const { count } = await prisma.quota.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends QuotaDeleteManyArgs>(args?: SelectSubset<T, QuotaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Quotas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuotaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Quotas
     * const quota = await prisma.quota.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends QuotaUpdateManyArgs>(args: SelectSubset<T, QuotaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Quota.
     * @param {QuotaUpsertArgs} args - Arguments to update or create a Quota.
     * @example
     * // Update or create a Quota
     * const quota = await prisma.quota.upsert({
     *   create: {
     *     // ... data to create a Quota
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Quota we want to update
     *   }
     * })
     */
    upsert<T extends QuotaUpsertArgs>(args: SelectSubset<T, QuotaUpsertArgs<ExtArgs>>): Prisma__QuotaClient<$Result.GetResult<Prisma.$QuotaPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Quotas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuotaCountArgs} args - Arguments to filter Quotas to count.
     * @example
     * // Count the number of Quotas
     * const count = await prisma.quota.count({
     *   where: {
     *     // ... the filter for the Quotas we want to count
     *   }
     * })
    **/
    count<T extends QuotaCountArgs>(
      args?: Subset<T, QuotaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], QuotaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Quota.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuotaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends QuotaAggregateArgs>(args: Subset<T, QuotaAggregateArgs>): Prisma.PrismaPromise<GetQuotaAggregateType<T>>

    /**
     * Group by Quota.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuotaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends QuotaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: QuotaGroupByArgs['orderBy'] }
        : { orderBy?: QuotaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, QuotaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQuotaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Quota model
   */
  readonly fields: QuotaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Quota.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__QuotaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Quota model
   */ 
  interface QuotaFieldRefs {
    readonly id: FieldRef<"Quota", 'String'>
    readonly userId: FieldRef<"Quota", 'String'>
    readonly freeUsedThisMonth: FieldRef<"Quota", 'Int'>
    readonly freeResetAt: FieldRef<"Quota", 'DateTime'>
    readonly paidCredits: FieldRef<"Quota", 'Int'>
    readonly updatedAt: FieldRef<"Quota", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Quota findUnique
   */
  export type QuotaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quota
     */
    select?: QuotaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotaInclude<ExtArgs> | null
    /**
     * Filter, which Quota to fetch.
     */
    where: QuotaWhereUniqueInput
  }

  /**
   * Quota findUniqueOrThrow
   */
  export type QuotaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quota
     */
    select?: QuotaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotaInclude<ExtArgs> | null
    /**
     * Filter, which Quota to fetch.
     */
    where: QuotaWhereUniqueInput
  }

  /**
   * Quota findFirst
   */
  export type QuotaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quota
     */
    select?: QuotaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotaInclude<ExtArgs> | null
    /**
     * Filter, which Quota to fetch.
     */
    where?: QuotaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Quotas to fetch.
     */
    orderBy?: QuotaOrderByWithRelationInput | QuotaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Quotas.
     */
    cursor?: QuotaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Quotas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Quotas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Quotas.
     */
    distinct?: QuotaScalarFieldEnum | QuotaScalarFieldEnum[]
  }

  /**
   * Quota findFirstOrThrow
   */
  export type QuotaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quota
     */
    select?: QuotaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotaInclude<ExtArgs> | null
    /**
     * Filter, which Quota to fetch.
     */
    where?: QuotaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Quotas to fetch.
     */
    orderBy?: QuotaOrderByWithRelationInput | QuotaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Quotas.
     */
    cursor?: QuotaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Quotas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Quotas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Quotas.
     */
    distinct?: QuotaScalarFieldEnum | QuotaScalarFieldEnum[]
  }

  /**
   * Quota findMany
   */
  export type QuotaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quota
     */
    select?: QuotaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotaInclude<ExtArgs> | null
    /**
     * Filter, which Quotas to fetch.
     */
    where?: QuotaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Quotas to fetch.
     */
    orderBy?: QuotaOrderByWithRelationInput | QuotaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Quotas.
     */
    cursor?: QuotaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Quotas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Quotas.
     */
    skip?: number
    distinct?: QuotaScalarFieldEnum | QuotaScalarFieldEnum[]
  }

  /**
   * Quota create
   */
  export type QuotaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quota
     */
    select?: QuotaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotaInclude<ExtArgs> | null
    /**
     * The data needed to create a Quota.
     */
    data: XOR<QuotaCreateInput, QuotaUncheckedCreateInput>
  }

  /**
   * Quota createMany
   */
  export type QuotaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Quotas.
     */
    data: QuotaCreateManyInput | QuotaCreateManyInput[]
  }

  /**
   * Quota createManyAndReturn
   */
  export type QuotaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quota
     */
    select?: QuotaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Quotas.
     */
    data: QuotaCreateManyInput | QuotaCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotaIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Quota update
   */
  export type QuotaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quota
     */
    select?: QuotaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotaInclude<ExtArgs> | null
    /**
     * The data needed to update a Quota.
     */
    data: XOR<QuotaUpdateInput, QuotaUncheckedUpdateInput>
    /**
     * Choose, which Quota to update.
     */
    where: QuotaWhereUniqueInput
  }

  /**
   * Quota updateMany
   */
  export type QuotaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Quotas.
     */
    data: XOR<QuotaUpdateManyMutationInput, QuotaUncheckedUpdateManyInput>
    /**
     * Filter which Quotas to update
     */
    where?: QuotaWhereInput
  }

  /**
   * Quota upsert
   */
  export type QuotaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quota
     */
    select?: QuotaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotaInclude<ExtArgs> | null
    /**
     * The filter to search for the Quota to update in case it exists.
     */
    where: QuotaWhereUniqueInput
    /**
     * In case the Quota found by the `where` argument doesn't exist, create a new Quota with this data.
     */
    create: XOR<QuotaCreateInput, QuotaUncheckedCreateInput>
    /**
     * In case the Quota was found with the provided `where` argument, update it with this data.
     */
    update: XOR<QuotaUpdateInput, QuotaUncheckedUpdateInput>
  }

  /**
   * Quota delete
   */
  export type QuotaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quota
     */
    select?: QuotaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotaInclude<ExtArgs> | null
    /**
     * Filter which Quota to delete.
     */
    where: QuotaWhereUniqueInput
  }

  /**
   * Quota deleteMany
   */
  export type QuotaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Quotas to delete
     */
    where?: QuotaWhereInput
  }

  /**
   * Quota without action
   */
  export type QuotaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quota
     */
    select?: QuotaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotaInclude<ExtArgs> | null
  }


  /**
   * Model ConsentRecord
   */

  export type AggregateConsentRecord = {
    _count: ConsentRecordCountAggregateOutputType | null
    _min: ConsentRecordMinAggregateOutputType | null
    _max: ConsentRecordMaxAggregateOutputType | null
  }

  export type ConsentRecordMinAggregateOutputType = {
    id: string | null
    userId: string | null
    accepted: string | null
    policyVersion: string | null
    recordedAt: Date | null
  }

  export type ConsentRecordMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    accepted: string | null
    policyVersion: string | null
    recordedAt: Date | null
  }

  export type ConsentRecordCountAggregateOutputType = {
    id: number
    userId: number
    accepted: number
    policyVersion: number
    recordedAt: number
    _all: number
  }


  export type ConsentRecordMinAggregateInputType = {
    id?: true
    userId?: true
    accepted?: true
    policyVersion?: true
    recordedAt?: true
  }

  export type ConsentRecordMaxAggregateInputType = {
    id?: true
    userId?: true
    accepted?: true
    policyVersion?: true
    recordedAt?: true
  }

  export type ConsentRecordCountAggregateInputType = {
    id?: true
    userId?: true
    accepted?: true
    policyVersion?: true
    recordedAt?: true
    _all?: true
  }

  export type ConsentRecordAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ConsentRecord to aggregate.
     */
    where?: ConsentRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConsentRecords to fetch.
     */
    orderBy?: ConsentRecordOrderByWithRelationInput | ConsentRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ConsentRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConsentRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConsentRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ConsentRecords
    **/
    _count?: true | ConsentRecordCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ConsentRecordMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ConsentRecordMaxAggregateInputType
  }

  export type GetConsentRecordAggregateType<T extends ConsentRecordAggregateArgs> = {
        [P in keyof T & keyof AggregateConsentRecord]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateConsentRecord[P]>
      : GetScalarType<T[P], AggregateConsentRecord[P]>
  }




  export type ConsentRecordGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConsentRecordWhereInput
    orderBy?: ConsentRecordOrderByWithAggregationInput | ConsentRecordOrderByWithAggregationInput[]
    by: ConsentRecordScalarFieldEnum[] | ConsentRecordScalarFieldEnum
    having?: ConsentRecordScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ConsentRecordCountAggregateInputType | true
    _min?: ConsentRecordMinAggregateInputType
    _max?: ConsentRecordMaxAggregateInputType
  }

  export type ConsentRecordGroupByOutputType = {
    id: string
    userId: string
    accepted: string
    policyVersion: string
    recordedAt: Date
    _count: ConsentRecordCountAggregateOutputType | null
    _min: ConsentRecordMinAggregateOutputType | null
    _max: ConsentRecordMaxAggregateOutputType | null
  }

  type GetConsentRecordGroupByPayload<T extends ConsentRecordGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ConsentRecordGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ConsentRecordGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ConsentRecordGroupByOutputType[P]>
            : GetScalarType<T[P], ConsentRecordGroupByOutputType[P]>
        }
      >
    >


  export type ConsentRecordSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    accepted?: boolean
    policyVersion?: boolean
    recordedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["consentRecord"]>

  export type ConsentRecordSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    accepted?: boolean
    policyVersion?: boolean
    recordedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["consentRecord"]>

  export type ConsentRecordSelectScalar = {
    id?: boolean
    userId?: boolean
    accepted?: boolean
    policyVersion?: boolean
    recordedAt?: boolean
  }

  export type ConsentRecordInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ConsentRecordIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ConsentRecordPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ConsentRecord"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      accepted: string
      policyVersion: string
      recordedAt: Date
    }, ExtArgs["result"]["consentRecord"]>
    composites: {}
  }

  type ConsentRecordGetPayload<S extends boolean | null | undefined | ConsentRecordDefaultArgs> = $Result.GetResult<Prisma.$ConsentRecordPayload, S>

  type ConsentRecordCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ConsentRecordFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ConsentRecordCountAggregateInputType | true
    }

  export interface ConsentRecordDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ConsentRecord'], meta: { name: 'ConsentRecord' } }
    /**
     * Find zero or one ConsentRecord that matches the filter.
     * @param {ConsentRecordFindUniqueArgs} args - Arguments to find a ConsentRecord
     * @example
     * // Get one ConsentRecord
     * const consentRecord = await prisma.consentRecord.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ConsentRecordFindUniqueArgs>(args: SelectSubset<T, ConsentRecordFindUniqueArgs<ExtArgs>>): Prisma__ConsentRecordClient<$Result.GetResult<Prisma.$ConsentRecordPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ConsentRecord that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ConsentRecordFindUniqueOrThrowArgs} args - Arguments to find a ConsentRecord
     * @example
     * // Get one ConsentRecord
     * const consentRecord = await prisma.consentRecord.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ConsentRecordFindUniqueOrThrowArgs>(args: SelectSubset<T, ConsentRecordFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ConsentRecordClient<$Result.GetResult<Prisma.$ConsentRecordPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ConsentRecord that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentRecordFindFirstArgs} args - Arguments to find a ConsentRecord
     * @example
     * // Get one ConsentRecord
     * const consentRecord = await prisma.consentRecord.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ConsentRecordFindFirstArgs>(args?: SelectSubset<T, ConsentRecordFindFirstArgs<ExtArgs>>): Prisma__ConsentRecordClient<$Result.GetResult<Prisma.$ConsentRecordPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ConsentRecord that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentRecordFindFirstOrThrowArgs} args - Arguments to find a ConsentRecord
     * @example
     * // Get one ConsentRecord
     * const consentRecord = await prisma.consentRecord.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ConsentRecordFindFirstOrThrowArgs>(args?: SelectSubset<T, ConsentRecordFindFirstOrThrowArgs<ExtArgs>>): Prisma__ConsentRecordClient<$Result.GetResult<Prisma.$ConsentRecordPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ConsentRecords that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentRecordFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ConsentRecords
     * const consentRecords = await prisma.consentRecord.findMany()
     * 
     * // Get first 10 ConsentRecords
     * const consentRecords = await prisma.consentRecord.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const consentRecordWithIdOnly = await prisma.consentRecord.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ConsentRecordFindManyArgs>(args?: SelectSubset<T, ConsentRecordFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConsentRecordPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ConsentRecord.
     * @param {ConsentRecordCreateArgs} args - Arguments to create a ConsentRecord.
     * @example
     * // Create one ConsentRecord
     * const ConsentRecord = await prisma.consentRecord.create({
     *   data: {
     *     // ... data to create a ConsentRecord
     *   }
     * })
     * 
     */
    create<T extends ConsentRecordCreateArgs>(args: SelectSubset<T, ConsentRecordCreateArgs<ExtArgs>>): Prisma__ConsentRecordClient<$Result.GetResult<Prisma.$ConsentRecordPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ConsentRecords.
     * @param {ConsentRecordCreateManyArgs} args - Arguments to create many ConsentRecords.
     * @example
     * // Create many ConsentRecords
     * const consentRecord = await prisma.consentRecord.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ConsentRecordCreateManyArgs>(args?: SelectSubset<T, ConsentRecordCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ConsentRecords and returns the data saved in the database.
     * @param {ConsentRecordCreateManyAndReturnArgs} args - Arguments to create many ConsentRecords.
     * @example
     * // Create many ConsentRecords
     * const consentRecord = await prisma.consentRecord.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ConsentRecords and only return the `id`
     * const consentRecordWithIdOnly = await prisma.consentRecord.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ConsentRecordCreateManyAndReturnArgs>(args?: SelectSubset<T, ConsentRecordCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConsentRecordPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ConsentRecord.
     * @param {ConsentRecordDeleteArgs} args - Arguments to delete one ConsentRecord.
     * @example
     * // Delete one ConsentRecord
     * const ConsentRecord = await prisma.consentRecord.delete({
     *   where: {
     *     // ... filter to delete one ConsentRecord
     *   }
     * })
     * 
     */
    delete<T extends ConsentRecordDeleteArgs>(args: SelectSubset<T, ConsentRecordDeleteArgs<ExtArgs>>): Prisma__ConsentRecordClient<$Result.GetResult<Prisma.$ConsentRecordPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ConsentRecord.
     * @param {ConsentRecordUpdateArgs} args - Arguments to update one ConsentRecord.
     * @example
     * // Update one ConsentRecord
     * const consentRecord = await prisma.consentRecord.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ConsentRecordUpdateArgs>(args: SelectSubset<T, ConsentRecordUpdateArgs<ExtArgs>>): Prisma__ConsentRecordClient<$Result.GetResult<Prisma.$ConsentRecordPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ConsentRecords.
     * @param {ConsentRecordDeleteManyArgs} args - Arguments to filter ConsentRecords to delete.
     * @example
     * // Delete a few ConsentRecords
     * const { count } = await prisma.consentRecord.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ConsentRecordDeleteManyArgs>(args?: SelectSubset<T, ConsentRecordDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ConsentRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentRecordUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ConsentRecords
     * const consentRecord = await prisma.consentRecord.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ConsentRecordUpdateManyArgs>(args: SelectSubset<T, ConsentRecordUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ConsentRecord.
     * @param {ConsentRecordUpsertArgs} args - Arguments to update or create a ConsentRecord.
     * @example
     * // Update or create a ConsentRecord
     * const consentRecord = await prisma.consentRecord.upsert({
     *   create: {
     *     // ... data to create a ConsentRecord
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ConsentRecord we want to update
     *   }
     * })
     */
    upsert<T extends ConsentRecordUpsertArgs>(args: SelectSubset<T, ConsentRecordUpsertArgs<ExtArgs>>): Prisma__ConsentRecordClient<$Result.GetResult<Prisma.$ConsentRecordPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ConsentRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentRecordCountArgs} args - Arguments to filter ConsentRecords to count.
     * @example
     * // Count the number of ConsentRecords
     * const count = await prisma.consentRecord.count({
     *   where: {
     *     // ... the filter for the ConsentRecords we want to count
     *   }
     * })
    **/
    count<T extends ConsentRecordCountArgs>(
      args?: Subset<T, ConsentRecordCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ConsentRecordCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ConsentRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentRecordAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ConsentRecordAggregateArgs>(args: Subset<T, ConsentRecordAggregateArgs>): Prisma.PrismaPromise<GetConsentRecordAggregateType<T>>

    /**
     * Group by ConsentRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentRecordGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ConsentRecordGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ConsentRecordGroupByArgs['orderBy'] }
        : { orderBy?: ConsentRecordGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ConsentRecordGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetConsentRecordGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ConsentRecord model
   */
  readonly fields: ConsentRecordFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ConsentRecord.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ConsentRecordClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ConsentRecord model
   */ 
  interface ConsentRecordFieldRefs {
    readonly id: FieldRef<"ConsentRecord", 'String'>
    readonly userId: FieldRef<"ConsentRecord", 'String'>
    readonly accepted: FieldRef<"ConsentRecord", 'String'>
    readonly policyVersion: FieldRef<"ConsentRecord", 'String'>
    readonly recordedAt: FieldRef<"ConsentRecord", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ConsentRecord findUnique
   */
  export type ConsentRecordFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentRecord
     */
    select?: ConsentRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentRecordInclude<ExtArgs> | null
    /**
     * Filter, which ConsentRecord to fetch.
     */
    where: ConsentRecordWhereUniqueInput
  }

  /**
   * ConsentRecord findUniqueOrThrow
   */
  export type ConsentRecordFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentRecord
     */
    select?: ConsentRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentRecordInclude<ExtArgs> | null
    /**
     * Filter, which ConsentRecord to fetch.
     */
    where: ConsentRecordWhereUniqueInput
  }

  /**
   * ConsentRecord findFirst
   */
  export type ConsentRecordFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentRecord
     */
    select?: ConsentRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentRecordInclude<ExtArgs> | null
    /**
     * Filter, which ConsentRecord to fetch.
     */
    where?: ConsentRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConsentRecords to fetch.
     */
    orderBy?: ConsentRecordOrderByWithRelationInput | ConsentRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ConsentRecords.
     */
    cursor?: ConsentRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConsentRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConsentRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConsentRecords.
     */
    distinct?: ConsentRecordScalarFieldEnum | ConsentRecordScalarFieldEnum[]
  }

  /**
   * ConsentRecord findFirstOrThrow
   */
  export type ConsentRecordFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentRecord
     */
    select?: ConsentRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentRecordInclude<ExtArgs> | null
    /**
     * Filter, which ConsentRecord to fetch.
     */
    where?: ConsentRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConsentRecords to fetch.
     */
    orderBy?: ConsentRecordOrderByWithRelationInput | ConsentRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ConsentRecords.
     */
    cursor?: ConsentRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConsentRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConsentRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConsentRecords.
     */
    distinct?: ConsentRecordScalarFieldEnum | ConsentRecordScalarFieldEnum[]
  }

  /**
   * ConsentRecord findMany
   */
  export type ConsentRecordFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentRecord
     */
    select?: ConsentRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentRecordInclude<ExtArgs> | null
    /**
     * Filter, which ConsentRecords to fetch.
     */
    where?: ConsentRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConsentRecords to fetch.
     */
    orderBy?: ConsentRecordOrderByWithRelationInput | ConsentRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ConsentRecords.
     */
    cursor?: ConsentRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConsentRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConsentRecords.
     */
    skip?: number
    distinct?: ConsentRecordScalarFieldEnum | ConsentRecordScalarFieldEnum[]
  }

  /**
   * ConsentRecord create
   */
  export type ConsentRecordCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentRecord
     */
    select?: ConsentRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentRecordInclude<ExtArgs> | null
    /**
     * The data needed to create a ConsentRecord.
     */
    data: XOR<ConsentRecordCreateInput, ConsentRecordUncheckedCreateInput>
  }

  /**
   * ConsentRecord createMany
   */
  export type ConsentRecordCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ConsentRecords.
     */
    data: ConsentRecordCreateManyInput | ConsentRecordCreateManyInput[]
  }

  /**
   * ConsentRecord createManyAndReturn
   */
  export type ConsentRecordCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentRecord
     */
    select?: ConsentRecordSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ConsentRecords.
     */
    data: ConsentRecordCreateManyInput | ConsentRecordCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentRecordIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ConsentRecord update
   */
  export type ConsentRecordUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentRecord
     */
    select?: ConsentRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentRecordInclude<ExtArgs> | null
    /**
     * The data needed to update a ConsentRecord.
     */
    data: XOR<ConsentRecordUpdateInput, ConsentRecordUncheckedUpdateInput>
    /**
     * Choose, which ConsentRecord to update.
     */
    where: ConsentRecordWhereUniqueInput
  }

  /**
   * ConsentRecord updateMany
   */
  export type ConsentRecordUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ConsentRecords.
     */
    data: XOR<ConsentRecordUpdateManyMutationInput, ConsentRecordUncheckedUpdateManyInput>
    /**
     * Filter which ConsentRecords to update
     */
    where?: ConsentRecordWhereInput
  }

  /**
   * ConsentRecord upsert
   */
  export type ConsentRecordUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentRecord
     */
    select?: ConsentRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentRecordInclude<ExtArgs> | null
    /**
     * The filter to search for the ConsentRecord to update in case it exists.
     */
    where: ConsentRecordWhereUniqueInput
    /**
     * In case the ConsentRecord found by the `where` argument doesn't exist, create a new ConsentRecord with this data.
     */
    create: XOR<ConsentRecordCreateInput, ConsentRecordUncheckedCreateInput>
    /**
     * In case the ConsentRecord was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ConsentRecordUpdateInput, ConsentRecordUncheckedUpdateInput>
  }

  /**
   * ConsentRecord delete
   */
  export type ConsentRecordDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentRecord
     */
    select?: ConsentRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentRecordInclude<ExtArgs> | null
    /**
     * Filter which ConsentRecord to delete.
     */
    where: ConsentRecordWhereUniqueInput
  }

  /**
   * ConsentRecord deleteMany
   */
  export type ConsentRecordDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ConsentRecords to delete
     */
    where?: ConsentRecordWhereInput
  }

  /**
   * ConsentRecord without action
   */
  export type ConsentRecordDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentRecord
     */
    select?: ConsentRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentRecordInclude<ExtArgs> | null
  }


  /**
   * Model DsrRequest
   */

  export type AggregateDsrRequest = {
    _count: DsrRequestCountAggregateOutputType | null
    _min: DsrRequestMinAggregateOutputType | null
    _max: DsrRequestMaxAggregateOutputType | null
  }

  export type DsrRequestMinAggregateOutputType = {
    id: string | null
    userId: string | null
    status: string | null
    reason: string | null
    createdAt: Date | null
    completedAt: Date | null
  }

  export type DsrRequestMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    status: string | null
    reason: string | null
    createdAt: Date | null
    completedAt: Date | null
  }

  export type DsrRequestCountAggregateOutputType = {
    id: number
    userId: number
    status: number
    reason: number
    createdAt: number
    completedAt: number
    _all: number
  }


  export type DsrRequestMinAggregateInputType = {
    id?: true
    userId?: true
    status?: true
    reason?: true
    createdAt?: true
    completedAt?: true
  }

  export type DsrRequestMaxAggregateInputType = {
    id?: true
    userId?: true
    status?: true
    reason?: true
    createdAt?: true
    completedAt?: true
  }

  export type DsrRequestCountAggregateInputType = {
    id?: true
    userId?: true
    status?: true
    reason?: true
    createdAt?: true
    completedAt?: true
    _all?: true
  }

  export type DsrRequestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DsrRequest to aggregate.
     */
    where?: DsrRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DsrRequests to fetch.
     */
    orderBy?: DsrRequestOrderByWithRelationInput | DsrRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DsrRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DsrRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DsrRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DsrRequests
    **/
    _count?: true | DsrRequestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DsrRequestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DsrRequestMaxAggregateInputType
  }

  export type GetDsrRequestAggregateType<T extends DsrRequestAggregateArgs> = {
        [P in keyof T & keyof AggregateDsrRequest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDsrRequest[P]>
      : GetScalarType<T[P], AggregateDsrRequest[P]>
  }




  export type DsrRequestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DsrRequestWhereInput
    orderBy?: DsrRequestOrderByWithAggregationInput | DsrRequestOrderByWithAggregationInput[]
    by: DsrRequestScalarFieldEnum[] | DsrRequestScalarFieldEnum
    having?: DsrRequestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DsrRequestCountAggregateInputType | true
    _min?: DsrRequestMinAggregateInputType
    _max?: DsrRequestMaxAggregateInputType
  }

  export type DsrRequestGroupByOutputType = {
    id: string
    userId: string
    status: string
    reason: string | null
    createdAt: Date
    completedAt: Date | null
    _count: DsrRequestCountAggregateOutputType | null
    _min: DsrRequestMinAggregateOutputType | null
    _max: DsrRequestMaxAggregateOutputType | null
  }

  type GetDsrRequestGroupByPayload<T extends DsrRequestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DsrRequestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DsrRequestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DsrRequestGroupByOutputType[P]>
            : GetScalarType<T[P], DsrRequestGroupByOutputType[P]>
        }
      >
    >


  export type DsrRequestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    status?: boolean
    reason?: boolean
    createdAt?: boolean
    completedAt?: boolean
  }, ExtArgs["result"]["dsrRequest"]>

  export type DsrRequestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    status?: boolean
    reason?: boolean
    createdAt?: boolean
    completedAt?: boolean
  }, ExtArgs["result"]["dsrRequest"]>

  export type DsrRequestSelectScalar = {
    id?: boolean
    userId?: boolean
    status?: boolean
    reason?: boolean
    createdAt?: boolean
    completedAt?: boolean
  }


  export type $DsrRequestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DsrRequest"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      status: string
      reason: string | null
      createdAt: Date
      completedAt: Date | null
    }, ExtArgs["result"]["dsrRequest"]>
    composites: {}
  }

  type DsrRequestGetPayload<S extends boolean | null | undefined | DsrRequestDefaultArgs> = $Result.GetResult<Prisma.$DsrRequestPayload, S>

  type DsrRequestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DsrRequestFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DsrRequestCountAggregateInputType | true
    }

  export interface DsrRequestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DsrRequest'], meta: { name: 'DsrRequest' } }
    /**
     * Find zero or one DsrRequest that matches the filter.
     * @param {DsrRequestFindUniqueArgs} args - Arguments to find a DsrRequest
     * @example
     * // Get one DsrRequest
     * const dsrRequest = await prisma.dsrRequest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DsrRequestFindUniqueArgs>(args: SelectSubset<T, DsrRequestFindUniqueArgs<ExtArgs>>): Prisma__DsrRequestClient<$Result.GetResult<Prisma.$DsrRequestPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one DsrRequest that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DsrRequestFindUniqueOrThrowArgs} args - Arguments to find a DsrRequest
     * @example
     * // Get one DsrRequest
     * const dsrRequest = await prisma.dsrRequest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DsrRequestFindUniqueOrThrowArgs>(args: SelectSubset<T, DsrRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DsrRequestClient<$Result.GetResult<Prisma.$DsrRequestPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first DsrRequest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DsrRequestFindFirstArgs} args - Arguments to find a DsrRequest
     * @example
     * // Get one DsrRequest
     * const dsrRequest = await prisma.dsrRequest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DsrRequestFindFirstArgs>(args?: SelectSubset<T, DsrRequestFindFirstArgs<ExtArgs>>): Prisma__DsrRequestClient<$Result.GetResult<Prisma.$DsrRequestPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first DsrRequest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DsrRequestFindFirstOrThrowArgs} args - Arguments to find a DsrRequest
     * @example
     * // Get one DsrRequest
     * const dsrRequest = await prisma.dsrRequest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DsrRequestFindFirstOrThrowArgs>(args?: SelectSubset<T, DsrRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma__DsrRequestClient<$Result.GetResult<Prisma.$DsrRequestPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more DsrRequests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DsrRequestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DsrRequests
     * const dsrRequests = await prisma.dsrRequest.findMany()
     * 
     * // Get first 10 DsrRequests
     * const dsrRequests = await prisma.dsrRequest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const dsrRequestWithIdOnly = await prisma.dsrRequest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DsrRequestFindManyArgs>(args?: SelectSubset<T, DsrRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DsrRequestPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a DsrRequest.
     * @param {DsrRequestCreateArgs} args - Arguments to create a DsrRequest.
     * @example
     * // Create one DsrRequest
     * const DsrRequest = await prisma.dsrRequest.create({
     *   data: {
     *     // ... data to create a DsrRequest
     *   }
     * })
     * 
     */
    create<T extends DsrRequestCreateArgs>(args: SelectSubset<T, DsrRequestCreateArgs<ExtArgs>>): Prisma__DsrRequestClient<$Result.GetResult<Prisma.$DsrRequestPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many DsrRequests.
     * @param {DsrRequestCreateManyArgs} args - Arguments to create many DsrRequests.
     * @example
     * // Create many DsrRequests
     * const dsrRequest = await prisma.dsrRequest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DsrRequestCreateManyArgs>(args?: SelectSubset<T, DsrRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DsrRequests and returns the data saved in the database.
     * @param {DsrRequestCreateManyAndReturnArgs} args - Arguments to create many DsrRequests.
     * @example
     * // Create many DsrRequests
     * const dsrRequest = await prisma.dsrRequest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DsrRequests and only return the `id`
     * const dsrRequestWithIdOnly = await prisma.dsrRequest.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DsrRequestCreateManyAndReturnArgs>(args?: SelectSubset<T, DsrRequestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DsrRequestPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a DsrRequest.
     * @param {DsrRequestDeleteArgs} args - Arguments to delete one DsrRequest.
     * @example
     * // Delete one DsrRequest
     * const DsrRequest = await prisma.dsrRequest.delete({
     *   where: {
     *     // ... filter to delete one DsrRequest
     *   }
     * })
     * 
     */
    delete<T extends DsrRequestDeleteArgs>(args: SelectSubset<T, DsrRequestDeleteArgs<ExtArgs>>): Prisma__DsrRequestClient<$Result.GetResult<Prisma.$DsrRequestPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one DsrRequest.
     * @param {DsrRequestUpdateArgs} args - Arguments to update one DsrRequest.
     * @example
     * // Update one DsrRequest
     * const dsrRequest = await prisma.dsrRequest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DsrRequestUpdateArgs>(args: SelectSubset<T, DsrRequestUpdateArgs<ExtArgs>>): Prisma__DsrRequestClient<$Result.GetResult<Prisma.$DsrRequestPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more DsrRequests.
     * @param {DsrRequestDeleteManyArgs} args - Arguments to filter DsrRequests to delete.
     * @example
     * // Delete a few DsrRequests
     * const { count } = await prisma.dsrRequest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DsrRequestDeleteManyArgs>(args?: SelectSubset<T, DsrRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DsrRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DsrRequestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DsrRequests
     * const dsrRequest = await prisma.dsrRequest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DsrRequestUpdateManyArgs>(args: SelectSubset<T, DsrRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one DsrRequest.
     * @param {DsrRequestUpsertArgs} args - Arguments to update or create a DsrRequest.
     * @example
     * // Update or create a DsrRequest
     * const dsrRequest = await prisma.dsrRequest.upsert({
     *   create: {
     *     // ... data to create a DsrRequest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DsrRequest we want to update
     *   }
     * })
     */
    upsert<T extends DsrRequestUpsertArgs>(args: SelectSubset<T, DsrRequestUpsertArgs<ExtArgs>>): Prisma__DsrRequestClient<$Result.GetResult<Prisma.$DsrRequestPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of DsrRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DsrRequestCountArgs} args - Arguments to filter DsrRequests to count.
     * @example
     * // Count the number of DsrRequests
     * const count = await prisma.dsrRequest.count({
     *   where: {
     *     // ... the filter for the DsrRequests we want to count
     *   }
     * })
    **/
    count<T extends DsrRequestCountArgs>(
      args?: Subset<T, DsrRequestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DsrRequestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DsrRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DsrRequestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DsrRequestAggregateArgs>(args: Subset<T, DsrRequestAggregateArgs>): Prisma.PrismaPromise<GetDsrRequestAggregateType<T>>

    /**
     * Group by DsrRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DsrRequestGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DsrRequestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DsrRequestGroupByArgs['orderBy'] }
        : { orderBy?: DsrRequestGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DsrRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDsrRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DsrRequest model
   */
  readonly fields: DsrRequestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DsrRequest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DsrRequestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DsrRequest model
   */ 
  interface DsrRequestFieldRefs {
    readonly id: FieldRef<"DsrRequest", 'String'>
    readonly userId: FieldRef<"DsrRequest", 'String'>
    readonly status: FieldRef<"DsrRequest", 'String'>
    readonly reason: FieldRef<"DsrRequest", 'String'>
    readonly createdAt: FieldRef<"DsrRequest", 'DateTime'>
    readonly completedAt: FieldRef<"DsrRequest", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DsrRequest findUnique
   */
  export type DsrRequestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DsrRequest
     */
    select?: DsrRequestSelect<ExtArgs> | null
    /**
     * Filter, which DsrRequest to fetch.
     */
    where: DsrRequestWhereUniqueInput
  }

  /**
   * DsrRequest findUniqueOrThrow
   */
  export type DsrRequestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DsrRequest
     */
    select?: DsrRequestSelect<ExtArgs> | null
    /**
     * Filter, which DsrRequest to fetch.
     */
    where: DsrRequestWhereUniqueInput
  }

  /**
   * DsrRequest findFirst
   */
  export type DsrRequestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DsrRequest
     */
    select?: DsrRequestSelect<ExtArgs> | null
    /**
     * Filter, which DsrRequest to fetch.
     */
    where?: DsrRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DsrRequests to fetch.
     */
    orderBy?: DsrRequestOrderByWithRelationInput | DsrRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DsrRequests.
     */
    cursor?: DsrRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DsrRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DsrRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DsrRequests.
     */
    distinct?: DsrRequestScalarFieldEnum | DsrRequestScalarFieldEnum[]
  }

  /**
   * DsrRequest findFirstOrThrow
   */
  export type DsrRequestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DsrRequest
     */
    select?: DsrRequestSelect<ExtArgs> | null
    /**
     * Filter, which DsrRequest to fetch.
     */
    where?: DsrRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DsrRequests to fetch.
     */
    orderBy?: DsrRequestOrderByWithRelationInput | DsrRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DsrRequests.
     */
    cursor?: DsrRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DsrRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DsrRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DsrRequests.
     */
    distinct?: DsrRequestScalarFieldEnum | DsrRequestScalarFieldEnum[]
  }

  /**
   * DsrRequest findMany
   */
  export type DsrRequestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DsrRequest
     */
    select?: DsrRequestSelect<ExtArgs> | null
    /**
     * Filter, which DsrRequests to fetch.
     */
    where?: DsrRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DsrRequests to fetch.
     */
    orderBy?: DsrRequestOrderByWithRelationInput | DsrRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DsrRequests.
     */
    cursor?: DsrRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DsrRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DsrRequests.
     */
    skip?: number
    distinct?: DsrRequestScalarFieldEnum | DsrRequestScalarFieldEnum[]
  }

  /**
   * DsrRequest create
   */
  export type DsrRequestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DsrRequest
     */
    select?: DsrRequestSelect<ExtArgs> | null
    /**
     * The data needed to create a DsrRequest.
     */
    data: XOR<DsrRequestCreateInput, DsrRequestUncheckedCreateInput>
  }

  /**
   * DsrRequest createMany
   */
  export type DsrRequestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DsrRequests.
     */
    data: DsrRequestCreateManyInput | DsrRequestCreateManyInput[]
  }

  /**
   * DsrRequest createManyAndReturn
   */
  export type DsrRequestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DsrRequest
     */
    select?: DsrRequestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many DsrRequests.
     */
    data: DsrRequestCreateManyInput | DsrRequestCreateManyInput[]
  }

  /**
   * DsrRequest update
   */
  export type DsrRequestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DsrRequest
     */
    select?: DsrRequestSelect<ExtArgs> | null
    /**
     * The data needed to update a DsrRequest.
     */
    data: XOR<DsrRequestUpdateInput, DsrRequestUncheckedUpdateInput>
    /**
     * Choose, which DsrRequest to update.
     */
    where: DsrRequestWhereUniqueInput
  }

  /**
   * DsrRequest updateMany
   */
  export type DsrRequestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DsrRequests.
     */
    data: XOR<DsrRequestUpdateManyMutationInput, DsrRequestUncheckedUpdateManyInput>
    /**
     * Filter which DsrRequests to update
     */
    where?: DsrRequestWhereInput
  }

  /**
   * DsrRequest upsert
   */
  export type DsrRequestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DsrRequest
     */
    select?: DsrRequestSelect<ExtArgs> | null
    /**
     * The filter to search for the DsrRequest to update in case it exists.
     */
    where: DsrRequestWhereUniqueInput
    /**
     * In case the DsrRequest found by the `where` argument doesn't exist, create a new DsrRequest with this data.
     */
    create: XOR<DsrRequestCreateInput, DsrRequestUncheckedCreateInput>
    /**
     * In case the DsrRequest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DsrRequestUpdateInput, DsrRequestUncheckedUpdateInput>
  }

  /**
   * DsrRequest delete
   */
  export type DsrRequestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DsrRequest
     */
    select?: DsrRequestSelect<ExtArgs> | null
    /**
     * Filter which DsrRequest to delete.
     */
    where: DsrRequestWhereUniqueInput
  }

  /**
   * DsrRequest deleteMany
   */
  export type DsrRequestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DsrRequests to delete
     */
    where?: DsrRequestWhereInput
  }

  /**
   * DsrRequest without action
   */
  export type DsrRequestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DsrRequest
     */
    select?: DsrRequestSelect<ExtArgs> | null
  }


  /**
   * Model PaddleEvent
   */

  export type AggregatePaddleEvent = {
    _count: PaddleEventCountAggregateOutputType | null
    _avg: PaddleEventAvgAggregateOutputType | null
    _sum: PaddleEventSumAggregateOutputType | null
    _min: PaddleEventMinAggregateOutputType | null
    _max: PaddleEventMaxAggregateOutputType | null
  }

  export type PaddleEventAvgAggregateOutputType = {
    credits: number | null
    refundAmount: number | null
  }

  export type PaddleEventSumAggregateOutputType = {
    credits: number | null
    refundAmount: number | null
  }

  export type PaddleEventMinAggregateOutputType = {
    id: string | null
    eventId: string | null
    eventName: string | null
    transactionId: string | null
    adjustmentId: string | null
    userId: string | null
    credits: number | null
    refundAmount: number | null
    refundReason: string | null
    eventType: string | null
    payload: string | null
    processedAt: Date | null
    success: boolean | null
    error: string | null
  }

  export type PaddleEventMaxAggregateOutputType = {
    id: string | null
    eventId: string | null
    eventName: string | null
    transactionId: string | null
    adjustmentId: string | null
    userId: string | null
    credits: number | null
    refundAmount: number | null
    refundReason: string | null
    eventType: string | null
    payload: string | null
    processedAt: Date | null
    success: boolean | null
    error: string | null
  }

  export type PaddleEventCountAggregateOutputType = {
    id: number
    eventId: number
    eventName: number
    transactionId: number
    adjustmentId: number
    userId: number
    credits: number
    refundAmount: number
    refundReason: number
    eventType: number
    payload: number
    processedAt: number
    success: number
    error: number
    _all: number
  }


  export type PaddleEventAvgAggregateInputType = {
    credits?: true
    refundAmount?: true
  }

  export type PaddleEventSumAggregateInputType = {
    credits?: true
    refundAmount?: true
  }

  export type PaddleEventMinAggregateInputType = {
    id?: true
    eventId?: true
    eventName?: true
    transactionId?: true
    adjustmentId?: true
    userId?: true
    credits?: true
    refundAmount?: true
    refundReason?: true
    eventType?: true
    payload?: true
    processedAt?: true
    success?: true
    error?: true
  }

  export type PaddleEventMaxAggregateInputType = {
    id?: true
    eventId?: true
    eventName?: true
    transactionId?: true
    adjustmentId?: true
    userId?: true
    credits?: true
    refundAmount?: true
    refundReason?: true
    eventType?: true
    payload?: true
    processedAt?: true
    success?: true
    error?: true
  }

  export type PaddleEventCountAggregateInputType = {
    id?: true
    eventId?: true
    eventName?: true
    transactionId?: true
    adjustmentId?: true
    userId?: true
    credits?: true
    refundAmount?: true
    refundReason?: true
    eventType?: true
    payload?: true
    processedAt?: true
    success?: true
    error?: true
    _all?: true
  }

  export type PaddleEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PaddleEvent to aggregate.
     */
    where?: PaddleEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaddleEvents to fetch.
     */
    orderBy?: PaddleEventOrderByWithRelationInput | PaddleEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PaddleEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaddleEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaddleEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PaddleEvents
    **/
    _count?: true | PaddleEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PaddleEventAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PaddleEventSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PaddleEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PaddleEventMaxAggregateInputType
  }

  export type GetPaddleEventAggregateType<T extends PaddleEventAggregateArgs> = {
        [P in keyof T & keyof AggregatePaddleEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePaddleEvent[P]>
      : GetScalarType<T[P], AggregatePaddleEvent[P]>
  }




  export type PaddleEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaddleEventWhereInput
    orderBy?: PaddleEventOrderByWithAggregationInput | PaddleEventOrderByWithAggregationInput[]
    by: PaddleEventScalarFieldEnum[] | PaddleEventScalarFieldEnum
    having?: PaddleEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PaddleEventCountAggregateInputType | true
    _avg?: PaddleEventAvgAggregateInputType
    _sum?: PaddleEventSumAggregateInputType
    _min?: PaddleEventMinAggregateInputType
    _max?: PaddleEventMaxAggregateInputType
  }

  export type PaddleEventGroupByOutputType = {
    id: string
    eventId: string
    eventName: string
    transactionId: string | null
    adjustmentId: string | null
    userId: string | null
    credits: number | null
    refundAmount: number | null
    refundReason: string | null
    eventType: string | null
    payload: string
    processedAt: Date
    success: boolean
    error: string | null
    _count: PaddleEventCountAggregateOutputType | null
    _avg: PaddleEventAvgAggregateOutputType | null
    _sum: PaddleEventSumAggregateOutputType | null
    _min: PaddleEventMinAggregateOutputType | null
    _max: PaddleEventMaxAggregateOutputType | null
  }

  type GetPaddleEventGroupByPayload<T extends PaddleEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PaddleEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PaddleEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PaddleEventGroupByOutputType[P]>
            : GetScalarType<T[P], PaddleEventGroupByOutputType[P]>
        }
      >
    >


  export type PaddleEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventId?: boolean
    eventName?: boolean
    transactionId?: boolean
    adjustmentId?: boolean
    userId?: boolean
    credits?: boolean
    refundAmount?: boolean
    refundReason?: boolean
    eventType?: boolean
    payload?: boolean
    processedAt?: boolean
    success?: boolean
    error?: boolean
  }, ExtArgs["result"]["paddleEvent"]>

  export type PaddleEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventId?: boolean
    eventName?: boolean
    transactionId?: boolean
    adjustmentId?: boolean
    userId?: boolean
    credits?: boolean
    refundAmount?: boolean
    refundReason?: boolean
    eventType?: boolean
    payload?: boolean
    processedAt?: boolean
    success?: boolean
    error?: boolean
  }, ExtArgs["result"]["paddleEvent"]>

  export type PaddleEventSelectScalar = {
    id?: boolean
    eventId?: boolean
    eventName?: boolean
    transactionId?: boolean
    adjustmentId?: boolean
    userId?: boolean
    credits?: boolean
    refundAmount?: boolean
    refundReason?: boolean
    eventType?: boolean
    payload?: boolean
    processedAt?: boolean
    success?: boolean
    error?: boolean
  }


  export type $PaddleEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PaddleEvent"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      eventId: string
      eventName: string
      transactionId: string | null
      adjustmentId: string | null
      userId: string | null
      credits: number | null
      refundAmount: number | null
      refundReason: string | null
      eventType: string | null
      payload: string
      processedAt: Date
      success: boolean
      error: string | null
    }, ExtArgs["result"]["paddleEvent"]>
    composites: {}
  }

  type PaddleEventGetPayload<S extends boolean | null | undefined | PaddleEventDefaultArgs> = $Result.GetResult<Prisma.$PaddleEventPayload, S>

  type PaddleEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PaddleEventFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PaddleEventCountAggregateInputType | true
    }

  export interface PaddleEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PaddleEvent'], meta: { name: 'PaddleEvent' } }
    /**
     * Find zero or one PaddleEvent that matches the filter.
     * @param {PaddleEventFindUniqueArgs} args - Arguments to find a PaddleEvent
     * @example
     * // Get one PaddleEvent
     * const paddleEvent = await prisma.paddleEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PaddleEventFindUniqueArgs>(args: SelectSubset<T, PaddleEventFindUniqueArgs<ExtArgs>>): Prisma__PaddleEventClient<$Result.GetResult<Prisma.$PaddleEventPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PaddleEvent that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PaddleEventFindUniqueOrThrowArgs} args - Arguments to find a PaddleEvent
     * @example
     * // Get one PaddleEvent
     * const paddleEvent = await prisma.paddleEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PaddleEventFindUniqueOrThrowArgs>(args: SelectSubset<T, PaddleEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PaddleEventClient<$Result.GetResult<Prisma.$PaddleEventPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PaddleEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaddleEventFindFirstArgs} args - Arguments to find a PaddleEvent
     * @example
     * // Get one PaddleEvent
     * const paddleEvent = await prisma.paddleEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PaddleEventFindFirstArgs>(args?: SelectSubset<T, PaddleEventFindFirstArgs<ExtArgs>>): Prisma__PaddleEventClient<$Result.GetResult<Prisma.$PaddleEventPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PaddleEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaddleEventFindFirstOrThrowArgs} args - Arguments to find a PaddleEvent
     * @example
     * // Get one PaddleEvent
     * const paddleEvent = await prisma.paddleEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PaddleEventFindFirstOrThrowArgs>(args?: SelectSubset<T, PaddleEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__PaddleEventClient<$Result.GetResult<Prisma.$PaddleEventPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PaddleEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaddleEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PaddleEvents
     * const paddleEvents = await prisma.paddleEvent.findMany()
     * 
     * // Get first 10 PaddleEvents
     * const paddleEvents = await prisma.paddleEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const paddleEventWithIdOnly = await prisma.paddleEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PaddleEventFindManyArgs>(args?: SelectSubset<T, PaddleEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaddleEventPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PaddleEvent.
     * @param {PaddleEventCreateArgs} args - Arguments to create a PaddleEvent.
     * @example
     * // Create one PaddleEvent
     * const PaddleEvent = await prisma.paddleEvent.create({
     *   data: {
     *     // ... data to create a PaddleEvent
     *   }
     * })
     * 
     */
    create<T extends PaddleEventCreateArgs>(args: SelectSubset<T, PaddleEventCreateArgs<ExtArgs>>): Prisma__PaddleEventClient<$Result.GetResult<Prisma.$PaddleEventPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PaddleEvents.
     * @param {PaddleEventCreateManyArgs} args - Arguments to create many PaddleEvents.
     * @example
     * // Create many PaddleEvents
     * const paddleEvent = await prisma.paddleEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PaddleEventCreateManyArgs>(args?: SelectSubset<T, PaddleEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PaddleEvents and returns the data saved in the database.
     * @param {PaddleEventCreateManyAndReturnArgs} args - Arguments to create many PaddleEvents.
     * @example
     * // Create many PaddleEvents
     * const paddleEvent = await prisma.paddleEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PaddleEvents and only return the `id`
     * const paddleEventWithIdOnly = await prisma.paddleEvent.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PaddleEventCreateManyAndReturnArgs>(args?: SelectSubset<T, PaddleEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaddleEventPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PaddleEvent.
     * @param {PaddleEventDeleteArgs} args - Arguments to delete one PaddleEvent.
     * @example
     * // Delete one PaddleEvent
     * const PaddleEvent = await prisma.paddleEvent.delete({
     *   where: {
     *     // ... filter to delete one PaddleEvent
     *   }
     * })
     * 
     */
    delete<T extends PaddleEventDeleteArgs>(args: SelectSubset<T, PaddleEventDeleteArgs<ExtArgs>>): Prisma__PaddleEventClient<$Result.GetResult<Prisma.$PaddleEventPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PaddleEvent.
     * @param {PaddleEventUpdateArgs} args - Arguments to update one PaddleEvent.
     * @example
     * // Update one PaddleEvent
     * const paddleEvent = await prisma.paddleEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PaddleEventUpdateArgs>(args: SelectSubset<T, PaddleEventUpdateArgs<ExtArgs>>): Prisma__PaddleEventClient<$Result.GetResult<Prisma.$PaddleEventPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PaddleEvents.
     * @param {PaddleEventDeleteManyArgs} args - Arguments to filter PaddleEvents to delete.
     * @example
     * // Delete a few PaddleEvents
     * const { count } = await prisma.paddleEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PaddleEventDeleteManyArgs>(args?: SelectSubset<T, PaddleEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PaddleEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaddleEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PaddleEvents
     * const paddleEvent = await prisma.paddleEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PaddleEventUpdateManyArgs>(args: SelectSubset<T, PaddleEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PaddleEvent.
     * @param {PaddleEventUpsertArgs} args - Arguments to update or create a PaddleEvent.
     * @example
     * // Update or create a PaddleEvent
     * const paddleEvent = await prisma.paddleEvent.upsert({
     *   create: {
     *     // ... data to create a PaddleEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PaddleEvent we want to update
     *   }
     * })
     */
    upsert<T extends PaddleEventUpsertArgs>(args: SelectSubset<T, PaddleEventUpsertArgs<ExtArgs>>): Prisma__PaddleEventClient<$Result.GetResult<Prisma.$PaddleEventPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PaddleEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaddleEventCountArgs} args - Arguments to filter PaddleEvents to count.
     * @example
     * // Count the number of PaddleEvents
     * const count = await prisma.paddleEvent.count({
     *   where: {
     *     // ... the filter for the PaddleEvents we want to count
     *   }
     * })
    **/
    count<T extends PaddleEventCountArgs>(
      args?: Subset<T, PaddleEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PaddleEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PaddleEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaddleEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PaddleEventAggregateArgs>(args: Subset<T, PaddleEventAggregateArgs>): Prisma.PrismaPromise<GetPaddleEventAggregateType<T>>

    /**
     * Group by PaddleEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaddleEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PaddleEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PaddleEventGroupByArgs['orderBy'] }
        : { orderBy?: PaddleEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PaddleEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPaddleEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PaddleEvent model
   */
  readonly fields: PaddleEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PaddleEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PaddleEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PaddleEvent model
   */ 
  interface PaddleEventFieldRefs {
    readonly id: FieldRef<"PaddleEvent", 'String'>
    readonly eventId: FieldRef<"PaddleEvent", 'String'>
    readonly eventName: FieldRef<"PaddleEvent", 'String'>
    readonly transactionId: FieldRef<"PaddleEvent", 'String'>
    readonly adjustmentId: FieldRef<"PaddleEvent", 'String'>
    readonly userId: FieldRef<"PaddleEvent", 'String'>
    readonly credits: FieldRef<"PaddleEvent", 'Int'>
    readonly refundAmount: FieldRef<"PaddleEvent", 'Int'>
    readonly refundReason: FieldRef<"PaddleEvent", 'String'>
    readonly eventType: FieldRef<"PaddleEvent", 'String'>
    readonly payload: FieldRef<"PaddleEvent", 'String'>
    readonly processedAt: FieldRef<"PaddleEvent", 'DateTime'>
    readonly success: FieldRef<"PaddleEvent", 'Boolean'>
    readonly error: FieldRef<"PaddleEvent", 'String'>
  }
    

  // Custom InputTypes
  /**
   * PaddleEvent findUnique
   */
  export type PaddleEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaddleEvent
     */
    select?: PaddleEventSelect<ExtArgs> | null
    /**
     * Filter, which PaddleEvent to fetch.
     */
    where: PaddleEventWhereUniqueInput
  }

  /**
   * PaddleEvent findUniqueOrThrow
   */
  export type PaddleEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaddleEvent
     */
    select?: PaddleEventSelect<ExtArgs> | null
    /**
     * Filter, which PaddleEvent to fetch.
     */
    where: PaddleEventWhereUniqueInput
  }

  /**
   * PaddleEvent findFirst
   */
  export type PaddleEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaddleEvent
     */
    select?: PaddleEventSelect<ExtArgs> | null
    /**
     * Filter, which PaddleEvent to fetch.
     */
    where?: PaddleEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaddleEvents to fetch.
     */
    orderBy?: PaddleEventOrderByWithRelationInput | PaddleEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PaddleEvents.
     */
    cursor?: PaddleEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaddleEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaddleEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PaddleEvents.
     */
    distinct?: PaddleEventScalarFieldEnum | PaddleEventScalarFieldEnum[]
  }

  /**
   * PaddleEvent findFirstOrThrow
   */
  export type PaddleEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaddleEvent
     */
    select?: PaddleEventSelect<ExtArgs> | null
    /**
     * Filter, which PaddleEvent to fetch.
     */
    where?: PaddleEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaddleEvents to fetch.
     */
    orderBy?: PaddleEventOrderByWithRelationInput | PaddleEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PaddleEvents.
     */
    cursor?: PaddleEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaddleEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaddleEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PaddleEvents.
     */
    distinct?: PaddleEventScalarFieldEnum | PaddleEventScalarFieldEnum[]
  }

  /**
   * PaddleEvent findMany
   */
  export type PaddleEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaddleEvent
     */
    select?: PaddleEventSelect<ExtArgs> | null
    /**
     * Filter, which PaddleEvents to fetch.
     */
    where?: PaddleEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaddleEvents to fetch.
     */
    orderBy?: PaddleEventOrderByWithRelationInput | PaddleEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PaddleEvents.
     */
    cursor?: PaddleEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaddleEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaddleEvents.
     */
    skip?: number
    distinct?: PaddleEventScalarFieldEnum | PaddleEventScalarFieldEnum[]
  }

  /**
   * PaddleEvent create
   */
  export type PaddleEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaddleEvent
     */
    select?: PaddleEventSelect<ExtArgs> | null
    /**
     * The data needed to create a PaddleEvent.
     */
    data: XOR<PaddleEventCreateInput, PaddleEventUncheckedCreateInput>
  }

  /**
   * PaddleEvent createMany
   */
  export type PaddleEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PaddleEvents.
     */
    data: PaddleEventCreateManyInput | PaddleEventCreateManyInput[]
  }

  /**
   * PaddleEvent createManyAndReturn
   */
  export type PaddleEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaddleEvent
     */
    select?: PaddleEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PaddleEvents.
     */
    data: PaddleEventCreateManyInput | PaddleEventCreateManyInput[]
  }

  /**
   * PaddleEvent update
   */
  export type PaddleEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaddleEvent
     */
    select?: PaddleEventSelect<ExtArgs> | null
    /**
     * The data needed to update a PaddleEvent.
     */
    data: XOR<PaddleEventUpdateInput, PaddleEventUncheckedUpdateInput>
    /**
     * Choose, which PaddleEvent to update.
     */
    where: PaddleEventWhereUniqueInput
  }

  /**
   * PaddleEvent updateMany
   */
  export type PaddleEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PaddleEvents.
     */
    data: XOR<PaddleEventUpdateManyMutationInput, PaddleEventUncheckedUpdateManyInput>
    /**
     * Filter which PaddleEvents to update
     */
    where?: PaddleEventWhereInput
  }

  /**
   * PaddleEvent upsert
   */
  export type PaddleEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaddleEvent
     */
    select?: PaddleEventSelect<ExtArgs> | null
    /**
     * The filter to search for the PaddleEvent to update in case it exists.
     */
    where: PaddleEventWhereUniqueInput
    /**
     * In case the PaddleEvent found by the `where` argument doesn't exist, create a new PaddleEvent with this data.
     */
    create: XOR<PaddleEventCreateInput, PaddleEventUncheckedCreateInput>
    /**
     * In case the PaddleEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PaddleEventUpdateInput, PaddleEventUncheckedUpdateInput>
  }

  /**
   * PaddleEvent delete
   */
  export type PaddleEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaddleEvent
     */
    select?: PaddleEventSelect<ExtArgs> | null
    /**
     * Filter which PaddleEvent to delete.
     */
    where: PaddleEventWhereUniqueInput
  }

  /**
   * PaddleEvent deleteMany
   */
  export type PaddleEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PaddleEvents to delete
     */
    where?: PaddleEventWhereInput
  }

  /**
   * PaddleEvent without action
   */
  export type PaddleEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaddleEvent
     */
    select?: PaddleEventSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    passwordHash: 'passwordHash',
    name: 'name',
    avatarUrl: 'avatarUrl',
    oauthProvider: 'oauthProvider',
    oauthUserId: 'oauthUserId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const PhotoScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    r2Key: 'r2Key',
    r2Url: 'r2Url',
    width: 'width',
    height: 'height',
    faceDetected: 'faceDetected',
    createdAt: 'createdAt'
  };

  export type PhotoScalarFieldEnum = (typeof PhotoScalarFieldEnum)[keyof typeof PhotoScalarFieldEnum]


  export const FaceAnalysisScalarFieldEnum: {
    id: 'id',
    photoId: 'photoId',
    faceShape: 'faceShape',
    hairLength: 'hairLength',
    hairTexture: 'hairTexture',
    hairDensity: 'hairDensity',
    forehead: 'forehead',
    jawline: 'jawline',
    provider: 'provider',
    createdAt: 'createdAt'
  };

  export type FaceAnalysisScalarFieldEnum = (typeof FaceAnalysisScalarFieldEnum)[keyof typeof FaceAnalysisScalarFieldEnum]


  export const GenerationScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    photoId: 'photoId',
    prompt: 'prompt',
    status: 'status',
    replicatePredictionId: 'replicatePredictionId',
    resultR2Key: 'resultR2Key',
    resultR2Url: 'resultR2Url',
    error: 'error',
    styleId: 'styleId',
    styleName: 'styleName',
    mode: 'mode',
    batchId: 'batchId',
    hairColor: 'hairColor',
    referencePhotoId: 'referencePhotoId',
    shareToken: 'shareToken',
    createdAt: 'createdAt',
    completedAt: 'completedAt'
  };

  export type GenerationScalarFieldEnum = (typeof GenerationScalarFieldEnum)[keyof typeof GenerationScalarFieldEnum]


  export const SubscriptionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    stripeSubId: 'stripeSubId',
    status: 'status',
    stripeCustomerId: 'stripeCustomerId',
    currentPeriodEnd: 'currentPeriodEnd',
    cancelAtPeriodEnd: 'cancelAtPeriodEnd',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SubscriptionScalarFieldEnum = (typeof SubscriptionScalarFieldEnum)[keyof typeof SubscriptionScalarFieldEnum]


  export const QuotaScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    freeUsedThisMonth: 'freeUsedThisMonth',
    freeResetAt: 'freeResetAt',
    paidCredits: 'paidCredits',
    updatedAt: 'updatedAt'
  };

  export type QuotaScalarFieldEnum = (typeof QuotaScalarFieldEnum)[keyof typeof QuotaScalarFieldEnum]


  export const ConsentRecordScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    accepted: 'accepted',
    policyVersion: 'policyVersion',
    recordedAt: 'recordedAt'
  };

  export type ConsentRecordScalarFieldEnum = (typeof ConsentRecordScalarFieldEnum)[keyof typeof ConsentRecordScalarFieldEnum]


  export const DsrRequestScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    status: 'status',
    reason: 'reason',
    createdAt: 'createdAt',
    completedAt: 'completedAt'
  };

  export type DsrRequestScalarFieldEnum = (typeof DsrRequestScalarFieldEnum)[keyof typeof DsrRequestScalarFieldEnum]


  export const PaddleEventScalarFieldEnum: {
    id: 'id',
    eventId: 'eventId',
    eventName: 'eventName',
    transactionId: 'transactionId',
    adjustmentId: 'adjustmentId',
    userId: 'userId',
    credits: 'credits',
    refundAmount: 'refundAmount',
    refundReason: 'refundReason',
    eventType: 'eventType',
    payload: 'payload',
    processedAt: 'processedAt',
    success: 'success',
    error: 'error'
  };

  export type PaddleEventScalarFieldEnum = (typeof PaddleEventScalarFieldEnum)[keyof typeof PaddleEventScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    passwordHash?: StringNullableFilter<"User"> | string | null
    name?: StringNullableFilter<"User"> | string | null
    avatarUrl?: StringNullableFilter<"User"> | string | null
    oauthProvider?: StringNullableFilter<"User"> | string | null
    oauthUserId?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    photos?: PhotoListRelationFilter
    generations?: GenerationListRelationFilter
    subscription?: XOR<SubscriptionNullableRelationFilter, SubscriptionWhereInput> | null
    quota?: XOR<QuotaNullableRelationFilter, QuotaWhereInput> | null
    consents?: ConsentRecordListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrderInput | SortOrder
    name?: SortOrderInput | SortOrder
    avatarUrl?: SortOrderInput | SortOrder
    oauthProvider?: SortOrderInput | SortOrder
    oauthUserId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    photos?: PhotoOrderByRelationAggregateInput
    generations?: GenerationOrderByRelationAggregateInput
    subscription?: SubscriptionOrderByWithRelationInput
    quota?: QuotaOrderByWithRelationInput
    consents?: ConsentRecordOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    passwordHash?: StringNullableFilter<"User"> | string | null
    name?: StringNullableFilter<"User"> | string | null
    avatarUrl?: StringNullableFilter<"User"> | string | null
    oauthProvider?: StringNullableFilter<"User"> | string | null
    oauthUserId?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    photos?: PhotoListRelationFilter
    generations?: GenerationListRelationFilter
    subscription?: XOR<SubscriptionNullableRelationFilter, SubscriptionWhereInput> | null
    quota?: XOR<QuotaNullableRelationFilter, QuotaWhereInput> | null
    consents?: ConsentRecordListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrderInput | SortOrder
    name?: SortOrderInput | SortOrder
    avatarUrl?: SortOrderInput | SortOrder
    oauthProvider?: SortOrderInput | SortOrder
    oauthUserId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringNullableWithAggregatesFilter<"User"> | string | null
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    avatarUrl?: StringNullableWithAggregatesFilter<"User"> | string | null
    oauthProvider?: StringNullableWithAggregatesFilter<"User"> | string | null
    oauthUserId?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type PhotoWhereInput = {
    AND?: PhotoWhereInput | PhotoWhereInput[]
    OR?: PhotoWhereInput[]
    NOT?: PhotoWhereInput | PhotoWhereInput[]
    id?: StringFilter<"Photo"> | string
    userId?: StringFilter<"Photo"> | string
    r2Key?: StringFilter<"Photo"> | string
    r2Url?: StringNullableFilter<"Photo"> | string | null
    width?: IntNullableFilter<"Photo"> | number | null
    height?: IntNullableFilter<"Photo"> | number | null
    faceDetected?: BoolFilter<"Photo"> | boolean
    createdAt?: DateTimeFilter<"Photo"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    generations?: GenerationListRelationFilter
    analysis?: XOR<FaceAnalysisNullableRelationFilter, FaceAnalysisWhereInput> | null
  }

  export type PhotoOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    r2Key?: SortOrder
    r2Url?: SortOrderInput | SortOrder
    width?: SortOrderInput | SortOrder
    height?: SortOrderInput | SortOrder
    faceDetected?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
    generations?: GenerationOrderByRelationAggregateInput
    analysis?: FaceAnalysisOrderByWithRelationInput
  }

  export type PhotoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PhotoWhereInput | PhotoWhereInput[]
    OR?: PhotoWhereInput[]
    NOT?: PhotoWhereInput | PhotoWhereInput[]
    userId?: StringFilter<"Photo"> | string
    r2Key?: StringFilter<"Photo"> | string
    r2Url?: StringNullableFilter<"Photo"> | string | null
    width?: IntNullableFilter<"Photo"> | number | null
    height?: IntNullableFilter<"Photo"> | number | null
    faceDetected?: BoolFilter<"Photo"> | boolean
    createdAt?: DateTimeFilter<"Photo"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    generations?: GenerationListRelationFilter
    analysis?: XOR<FaceAnalysisNullableRelationFilter, FaceAnalysisWhereInput> | null
  }, "id">

  export type PhotoOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    r2Key?: SortOrder
    r2Url?: SortOrderInput | SortOrder
    width?: SortOrderInput | SortOrder
    height?: SortOrderInput | SortOrder
    faceDetected?: SortOrder
    createdAt?: SortOrder
    _count?: PhotoCountOrderByAggregateInput
    _avg?: PhotoAvgOrderByAggregateInput
    _max?: PhotoMaxOrderByAggregateInput
    _min?: PhotoMinOrderByAggregateInput
    _sum?: PhotoSumOrderByAggregateInput
  }

  export type PhotoScalarWhereWithAggregatesInput = {
    AND?: PhotoScalarWhereWithAggregatesInput | PhotoScalarWhereWithAggregatesInput[]
    OR?: PhotoScalarWhereWithAggregatesInput[]
    NOT?: PhotoScalarWhereWithAggregatesInput | PhotoScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Photo"> | string
    userId?: StringWithAggregatesFilter<"Photo"> | string
    r2Key?: StringWithAggregatesFilter<"Photo"> | string
    r2Url?: StringNullableWithAggregatesFilter<"Photo"> | string | null
    width?: IntNullableWithAggregatesFilter<"Photo"> | number | null
    height?: IntNullableWithAggregatesFilter<"Photo"> | number | null
    faceDetected?: BoolWithAggregatesFilter<"Photo"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Photo"> | Date | string
  }

  export type FaceAnalysisWhereInput = {
    AND?: FaceAnalysisWhereInput | FaceAnalysisWhereInput[]
    OR?: FaceAnalysisWhereInput[]
    NOT?: FaceAnalysisWhereInput | FaceAnalysisWhereInput[]
    id?: StringFilter<"FaceAnalysis"> | string
    photoId?: StringFilter<"FaceAnalysis"> | string
    faceShape?: StringFilter<"FaceAnalysis"> | string
    hairLength?: StringFilter<"FaceAnalysis"> | string
    hairTexture?: StringFilter<"FaceAnalysis"> | string
    hairDensity?: StringFilter<"FaceAnalysis"> | string
    forehead?: StringFilter<"FaceAnalysis"> | string
    jawline?: StringFilter<"FaceAnalysis"> | string
    provider?: StringFilter<"FaceAnalysis"> | string
    createdAt?: DateTimeFilter<"FaceAnalysis"> | Date | string
    photo?: XOR<PhotoRelationFilter, PhotoWhereInput>
  }

  export type FaceAnalysisOrderByWithRelationInput = {
    id?: SortOrder
    photoId?: SortOrder
    faceShape?: SortOrder
    hairLength?: SortOrder
    hairTexture?: SortOrder
    hairDensity?: SortOrder
    forehead?: SortOrder
    jawline?: SortOrder
    provider?: SortOrder
    createdAt?: SortOrder
    photo?: PhotoOrderByWithRelationInput
  }

  export type FaceAnalysisWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    photoId?: string
    AND?: FaceAnalysisWhereInput | FaceAnalysisWhereInput[]
    OR?: FaceAnalysisWhereInput[]
    NOT?: FaceAnalysisWhereInput | FaceAnalysisWhereInput[]
    faceShape?: StringFilter<"FaceAnalysis"> | string
    hairLength?: StringFilter<"FaceAnalysis"> | string
    hairTexture?: StringFilter<"FaceAnalysis"> | string
    hairDensity?: StringFilter<"FaceAnalysis"> | string
    forehead?: StringFilter<"FaceAnalysis"> | string
    jawline?: StringFilter<"FaceAnalysis"> | string
    provider?: StringFilter<"FaceAnalysis"> | string
    createdAt?: DateTimeFilter<"FaceAnalysis"> | Date | string
    photo?: XOR<PhotoRelationFilter, PhotoWhereInput>
  }, "id" | "photoId">

  export type FaceAnalysisOrderByWithAggregationInput = {
    id?: SortOrder
    photoId?: SortOrder
    faceShape?: SortOrder
    hairLength?: SortOrder
    hairTexture?: SortOrder
    hairDensity?: SortOrder
    forehead?: SortOrder
    jawline?: SortOrder
    provider?: SortOrder
    createdAt?: SortOrder
    _count?: FaceAnalysisCountOrderByAggregateInput
    _max?: FaceAnalysisMaxOrderByAggregateInput
    _min?: FaceAnalysisMinOrderByAggregateInput
  }

  export type FaceAnalysisScalarWhereWithAggregatesInput = {
    AND?: FaceAnalysisScalarWhereWithAggregatesInput | FaceAnalysisScalarWhereWithAggregatesInput[]
    OR?: FaceAnalysisScalarWhereWithAggregatesInput[]
    NOT?: FaceAnalysisScalarWhereWithAggregatesInput | FaceAnalysisScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"FaceAnalysis"> | string
    photoId?: StringWithAggregatesFilter<"FaceAnalysis"> | string
    faceShape?: StringWithAggregatesFilter<"FaceAnalysis"> | string
    hairLength?: StringWithAggregatesFilter<"FaceAnalysis"> | string
    hairTexture?: StringWithAggregatesFilter<"FaceAnalysis"> | string
    hairDensity?: StringWithAggregatesFilter<"FaceAnalysis"> | string
    forehead?: StringWithAggregatesFilter<"FaceAnalysis"> | string
    jawline?: StringWithAggregatesFilter<"FaceAnalysis"> | string
    provider?: StringWithAggregatesFilter<"FaceAnalysis"> | string
    createdAt?: DateTimeWithAggregatesFilter<"FaceAnalysis"> | Date | string
  }

  export type GenerationWhereInput = {
    AND?: GenerationWhereInput | GenerationWhereInput[]
    OR?: GenerationWhereInput[]
    NOT?: GenerationWhereInput | GenerationWhereInput[]
    id?: StringFilter<"Generation"> | string
    userId?: StringFilter<"Generation"> | string
    photoId?: StringFilter<"Generation"> | string
    prompt?: StringFilter<"Generation"> | string
    status?: StringFilter<"Generation"> | string
    replicatePredictionId?: StringNullableFilter<"Generation"> | string | null
    resultR2Key?: StringNullableFilter<"Generation"> | string | null
    resultR2Url?: StringNullableFilter<"Generation"> | string | null
    error?: StringNullableFilter<"Generation"> | string | null
    styleId?: StringNullableFilter<"Generation"> | string | null
    styleName?: StringNullableFilter<"Generation"> | string | null
    mode?: StringFilter<"Generation"> | string
    batchId?: StringNullableFilter<"Generation"> | string | null
    hairColor?: StringNullableFilter<"Generation"> | string | null
    referencePhotoId?: StringNullableFilter<"Generation"> | string | null
    shareToken?: StringNullableFilter<"Generation"> | string | null
    createdAt?: DateTimeFilter<"Generation"> | Date | string
    completedAt?: DateTimeNullableFilter<"Generation"> | Date | string | null
    user?: XOR<UserRelationFilter, UserWhereInput>
    photo?: XOR<PhotoRelationFilter, PhotoWhereInput>
  }

  export type GenerationOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    photoId?: SortOrder
    prompt?: SortOrder
    status?: SortOrder
    replicatePredictionId?: SortOrderInput | SortOrder
    resultR2Key?: SortOrderInput | SortOrder
    resultR2Url?: SortOrderInput | SortOrder
    error?: SortOrderInput | SortOrder
    styleId?: SortOrderInput | SortOrder
    styleName?: SortOrderInput | SortOrder
    mode?: SortOrder
    batchId?: SortOrderInput | SortOrder
    hairColor?: SortOrderInput | SortOrder
    referencePhotoId?: SortOrderInput | SortOrder
    shareToken?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
    photo?: PhotoOrderByWithRelationInput
  }

  export type GenerationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    shareToken?: string
    AND?: GenerationWhereInput | GenerationWhereInput[]
    OR?: GenerationWhereInput[]
    NOT?: GenerationWhereInput | GenerationWhereInput[]
    userId?: StringFilter<"Generation"> | string
    photoId?: StringFilter<"Generation"> | string
    prompt?: StringFilter<"Generation"> | string
    status?: StringFilter<"Generation"> | string
    replicatePredictionId?: StringNullableFilter<"Generation"> | string | null
    resultR2Key?: StringNullableFilter<"Generation"> | string | null
    resultR2Url?: StringNullableFilter<"Generation"> | string | null
    error?: StringNullableFilter<"Generation"> | string | null
    styleId?: StringNullableFilter<"Generation"> | string | null
    styleName?: StringNullableFilter<"Generation"> | string | null
    mode?: StringFilter<"Generation"> | string
    batchId?: StringNullableFilter<"Generation"> | string | null
    hairColor?: StringNullableFilter<"Generation"> | string | null
    referencePhotoId?: StringNullableFilter<"Generation"> | string | null
    createdAt?: DateTimeFilter<"Generation"> | Date | string
    completedAt?: DateTimeNullableFilter<"Generation"> | Date | string | null
    user?: XOR<UserRelationFilter, UserWhereInput>
    photo?: XOR<PhotoRelationFilter, PhotoWhereInput>
  }, "id" | "shareToken">

  export type GenerationOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    photoId?: SortOrder
    prompt?: SortOrder
    status?: SortOrder
    replicatePredictionId?: SortOrderInput | SortOrder
    resultR2Key?: SortOrderInput | SortOrder
    resultR2Url?: SortOrderInput | SortOrder
    error?: SortOrderInput | SortOrder
    styleId?: SortOrderInput | SortOrder
    styleName?: SortOrderInput | SortOrder
    mode?: SortOrder
    batchId?: SortOrderInput | SortOrder
    hairColor?: SortOrderInput | SortOrder
    referencePhotoId?: SortOrderInput | SortOrder
    shareToken?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    _count?: GenerationCountOrderByAggregateInput
    _max?: GenerationMaxOrderByAggregateInput
    _min?: GenerationMinOrderByAggregateInput
  }

  export type GenerationScalarWhereWithAggregatesInput = {
    AND?: GenerationScalarWhereWithAggregatesInput | GenerationScalarWhereWithAggregatesInput[]
    OR?: GenerationScalarWhereWithAggregatesInput[]
    NOT?: GenerationScalarWhereWithAggregatesInput | GenerationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Generation"> | string
    userId?: StringWithAggregatesFilter<"Generation"> | string
    photoId?: StringWithAggregatesFilter<"Generation"> | string
    prompt?: StringWithAggregatesFilter<"Generation"> | string
    status?: StringWithAggregatesFilter<"Generation"> | string
    replicatePredictionId?: StringNullableWithAggregatesFilter<"Generation"> | string | null
    resultR2Key?: StringNullableWithAggregatesFilter<"Generation"> | string | null
    resultR2Url?: StringNullableWithAggregatesFilter<"Generation"> | string | null
    error?: StringNullableWithAggregatesFilter<"Generation"> | string | null
    styleId?: StringNullableWithAggregatesFilter<"Generation"> | string | null
    styleName?: StringNullableWithAggregatesFilter<"Generation"> | string | null
    mode?: StringWithAggregatesFilter<"Generation"> | string
    batchId?: StringNullableWithAggregatesFilter<"Generation"> | string | null
    hairColor?: StringNullableWithAggregatesFilter<"Generation"> | string | null
    referencePhotoId?: StringNullableWithAggregatesFilter<"Generation"> | string | null
    shareToken?: StringNullableWithAggregatesFilter<"Generation"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Generation"> | Date | string
    completedAt?: DateTimeNullableWithAggregatesFilter<"Generation"> | Date | string | null
  }

  export type SubscriptionWhereInput = {
    AND?: SubscriptionWhereInput | SubscriptionWhereInput[]
    OR?: SubscriptionWhereInput[]
    NOT?: SubscriptionWhereInput | SubscriptionWhereInput[]
    id?: StringFilter<"Subscription"> | string
    userId?: StringFilter<"Subscription"> | string
    stripeSubId?: StringNullableFilter<"Subscription"> | string | null
    status?: StringFilter<"Subscription"> | string
    stripeCustomerId?: StringNullableFilter<"Subscription"> | string | null
    currentPeriodEnd?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    cancelAtPeriodEnd?: BoolFilter<"Subscription"> | boolean
    createdAt?: DateTimeFilter<"Subscription"> | Date | string
    updatedAt?: DateTimeFilter<"Subscription"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type SubscriptionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    stripeSubId?: SortOrderInput | SortOrder
    status?: SortOrder
    stripeCustomerId?: SortOrderInput | SortOrder
    currentPeriodEnd?: SortOrderInput | SortOrder
    cancelAtPeriodEnd?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SubscriptionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    stripeSubId?: string
    AND?: SubscriptionWhereInput | SubscriptionWhereInput[]
    OR?: SubscriptionWhereInput[]
    NOT?: SubscriptionWhereInput | SubscriptionWhereInput[]
    status?: StringFilter<"Subscription"> | string
    stripeCustomerId?: StringNullableFilter<"Subscription"> | string | null
    currentPeriodEnd?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    cancelAtPeriodEnd?: BoolFilter<"Subscription"> | boolean
    createdAt?: DateTimeFilter<"Subscription"> | Date | string
    updatedAt?: DateTimeFilter<"Subscription"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id" | "userId" | "stripeSubId">

  export type SubscriptionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    stripeSubId?: SortOrderInput | SortOrder
    status?: SortOrder
    stripeCustomerId?: SortOrderInput | SortOrder
    currentPeriodEnd?: SortOrderInput | SortOrder
    cancelAtPeriodEnd?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SubscriptionCountOrderByAggregateInput
    _max?: SubscriptionMaxOrderByAggregateInput
    _min?: SubscriptionMinOrderByAggregateInput
  }

  export type SubscriptionScalarWhereWithAggregatesInput = {
    AND?: SubscriptionScalarWhereWithAggregatesInput | SubscriptionScalarWhereWithAggregatesInput[]
    OR?: SubscriptionScalarWhereWithAggregatesInput[]
    NOT?: SubscriptionScalarWhereWithAggregatesInput | SubscriptionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Subscription"> | string
    userId?: StringWithAggregatesFilter<"Subscription"> | string
    stripeSubId?: StringNullableWithAggregatesFilter<"Subscription"> | string | null
    status?: StringWithAggregatesFilter<"Subscription"> | string
    stripeCustomerId?: StringNullableWithAggregatesFilter<"Subscription"> | string | null
    currentPeriodEnd?: DateTimeNullableWithAggregatesFilter<"Subscription"> | Date | string | null
    cancelAtPeriodEnd?: BoolWithAggregatesFilter<"Subscription"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Subscription"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Subscription"> | Date | string
  }

  export type QuotaWhereInput = {
    AND?: QuotaWhereInput | QuotaWhereInput[]
    OR?: QuotaWhereInput[]
    NOT?: QuotaWhereInput | QuotaWhereInput[]
    id?: StringFilter<"Quota"> | string
    userId?: StringFilter<"Quota"> | string
    freeUsedThisMonth?: IntFilter<"Quota"> | number
    freeResetAt?: DateTimeFilter<"Quota"> | Date | string
    paidCredits?: IntFilter<"Quota"> | number
    updatedAt?: DateTimeFilter<"Quota"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type QuotaOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    freeUsedThisMonth?: SortOrder
    freeResetAt?: SortOrder
    paidCredits?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type QuotaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: QuotaWhereInput | QuotaWhereInput[]
    OR?: QuotaWhereInput[]
    NOT?: QuotaWhereInput | QuotaWhereInput[]
    freeUsedThisMonth?: IntFilter<"Quota"> | number
    freeResetAt?: DateTimeFilter<"Quota"> | Date | string
    paidCredits?: IntFilter<"Quota"> | number
    updatedAt?: DateTimeFilter<"Quota"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id" | "userId">

  export type QuotaOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    freeUsedThisMonth?: SortOrder
    freeResetAt?: SortOrder
    paidCredits?: SortOrder
    updatedAt?: SortOrder
    _count?: QuotaCountOrderByAggregateInput
    _avg?: QuotaAvgOrderByAggregateInput
    _max?: QuotaMaxOrderByAggregateInput
    _min?: QuotaMinOrderByAggregateInput
    _sum?: QuotaSumOrderByAggregateInput
  }

  export type QuotaScalarWhereWithAggregatesInput = {
    AND?: QuotaScalarWhereWithAggregatesInput | QuotaScalarWhereWithAggregatesInput[]
    OR?: QuotaScalarWhereWithAggregatesInput[]
    NOT?: QuotaScalarWhereWithAggregatesInput | QuotaScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Quota"> | string
    userId?: StringWithAggregatesFilter<"Quota"> | string
    freeUsedThisMonth?: IntWithAggregatesFilter<"Quota"> | number
    freeResetAt?: DateTimeWithAggregatesFilter<"Quota"> | Date | string
    paidCredits?: IntWithAggregatesFilter<"Quota"> | number
    updatedAt?: DateTimeWithAggregatesFilter<"Quota"> | Date | string
  }

  export type ConsentRecordWhereInput = {
    AND?: ConsentRecordWhereInput | ConsentRecordWhereInput[]
    OR?: ConsentRecordWhereInput[]
    NOT?: ConsentRecordWhereInput | ConsentRecordWhereInput[]
    id?: StringFilter<"ConsentRecord"> | string
    userId?: StringFilter<"ConsentRecord"> | string
    accepted?: StringFilter<"ConsentRecord"> | string
    policyVersion?: StringFilter<"ConsentRecord"> | string
    recordedAt?: DateTimeFilter<"ConsentRecord"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type ConsentRecordOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    accepted?: SortOrder
    policyVersion?: SortOrder
    recordedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type ConsentRecordWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ConsentRecordWhereInput | ConsentRecordWhereInput[]
    OR?: ConsentRecordWhereInput[]
    NOT?: ConsentRecordWhereInput | ConsentRecordWhereInput[]
    userId?: StringFilter<"ConsentRecord"> | string
    accepted?: StringFilter<"ConsentRecord"> | string
    policyVersion?: StringFilter<"ConsentRecord"> | string
    recordedAt?: DateTimeFilter<"ConsentRecord"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type ConsentRecordOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    accepted?: SortOrder
    policyVersion?: SortOrder
    recordedAt?: SortOrder
    _count?: ConsentRecordCountOrderByAggregateInput
    _max?: ConsentRecordMaxOrderByAggregateInput
    _min?: ConsentRecordMinOrderByAggregateInput
  }

  export type ConsentRecordScalarWhereWithAggregatesInput = {
    AND?: ConsentRecordScalarWhereWithAggregatesInput | ConsentRecordScalarWhereWithAggregatesInput[]
    OR?: ConsentRecordScalarWhereWithAggregatesInput[]
    NOT?: ConsentRecordScalarWhereWithAggregatesInput | ConsentRecordScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ConsentRecord"> | string
    userId?: StringWithAggregatesFilter<"ConsentRecord"> | string
    accepted?: StringWithAggregatesFilter<"ConsentRecord"> | string
    policyVersion?: StringWithAggregatesFilter<"ConsentRecord"> | string
    recordedAt?: DateTimeWithAggregatesFilter<"ConsentRecord"> | Date | string
  }

  export type DsrRequestWhereInput = {
    AND?: DsrRequestWhereInput | DsrRequestWhereInput[]
    OR?: DsrRequestWhereInput[]
    NOT?: DsrRequestWhereInput | DsrRequestWhereInput[]
    id?: StringFilter<"DsrRequest"> | string
    userId?: StringFilter<"DsrRequest"> | string
    status?: StringFilter<"DsrRequest"> | string
    reason?: StringNullableFilter<"DsrRequest"> | string | null
    createdAt?: DateTimeFilter<"DsrRequest"> | Date | string
    completedAt?: DateTimeNullableFilter<"DsrRequest"> | Date | string | null
  }

  export type DsrRequestOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    reason?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
  }

  export type DsrRequestWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DsrRequestWhereInput | DsrRequestWhereInput[]
    OR?: DsrRequestWhereInput[]
    NOT?: DsrRequestWhereInput | DsrRequestWhereInput[]
    userId?: StringFilter<"DsrRequest"> | string
    status?: StringFilter<"DsrRequest"> | string
    reason?: StringNullableFilter<"DsrRequest"> | string | null
    createdAt?: DateTimeFilter<"DsrRequest"> | Date | string
    completedAt?: DateTimeNullableFilter<"DsrRequest"> | Date | string | null
  }, "id">

  export type DsrRequestOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    reason?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    _count?: DsrRequestCountOrderByAggregateInput
    _max?: DsrRequestMaxOrderByAggregateInput
    _min?: DsrRequestMinOrderByAggregateInput
  }

  export type DsrRequestScalarWhereWithAggregatesInput = {
    AND?: DsrRequestScalarWhereWithAggregatesInput | DsrRequestScalarWhereWithAggregatesInput[]
    OR?: DsrRequestScalarWhereWithAggregatesInput[]
    NOT?: DsrRequestScalarWhereWithAggregatesInput | DsrRequestScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DsrRequest"> | string
    userId?: StringWithAggregatesFilter<"DsrRequest"> | string
    status?: StringWithAggregatesFilter<"DsrRequest"> | string
    reason?: StringNullableWithAggregatesFilter<"DsrRequest"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"DsrRequest"> | Date | string
    completedAt?: DateTimeNullableWithAggregatesFilter<"DsrRequest"> | Date | string | null
  }

  export type PaddleEventWhereInput = {
    AND?: PaddleEventWhereInput | PaddleEventWhereInput[]
    OR?: PaddleEventWhereInput[]
    NOT?: PaddleEventWhereInput | PaddleEventWhereInput[]
    id?: StringFilter<"PaddleEvent"> | string
    eventId?: StringFilter<"PaddleEvent"> | string
    eventName?: StringFilter<"PaddleEvent"> | string
    transactionId?: StringNullableFilter<"PaddleEvent"> | string | null
    adjustmentId?: StringNullableFilter<"PaddleEvent"> | string | null
    userId?: StringNullableFilter<"PaddleEvent"> | string | null
    credits?: IntNullableFilter<"PaddleEvent"> | number | null
    refundAmount?: IntNullableFilter<"PaddleEvent"> | number | null
    refundReason?: StringNullableFilter<"PaddleEvent"> | string | null
    eventType?: StringNullableFilter<"PaddleEvent"> | string | null
    payload?: StringFilter<"PaddleEvent"> | string
    processedAt?: DateTimeFilter<"PaddleEvent"> | Date | string
    success?: BoolFilter<"PaddleEvent"> | boolean
    error?: StringNullableFilter<"PaddleEvent"> | string | null
  }

  export type PaddleEventOrderByWithRelationInput = {
    id?: SortOrder
    eventId?: SortOrder
    eventName?: SortOrder
    transactionId?: SortOrderInput | SortOrder
    adjustmentId?: SortOrderInput | SortOrder
    userId?: SortOrderInput | SortOrder
    credits?: SortOrderInput | SortOrder
    refundAmount?: SortOrderInput | SortOrder
    refundReason?: SortOrderInput | SortOrder
    eventType?: SortOrderInput | SortOrder
    payload?: SortOrder
    processedAt?: SortOrder
    success?: SortOrder
    error?: SortOrderInput | SortOrder
  }

  export type PaddleEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    eventId?: string
    AND?: PaddleEventWhereInput | PaddleEventWhereInput[]
    OR?: PaddleEventWhereInput[]
    NOT?: PaddleEventWhereInput | PaddleEventWhereInput[]
    eventName?: StringFilter<"PaddleEvent"> | string
    transactionId?: StringNullableFilter<"PaddleEvent"> | string | null
    adjustmentId?: StringNullableFilter<"PaddleEvent"> | string | null
    userId?: StringNullableFilter<"PaddleEvent"> | string | null
    credits?: IntNullableFilter<"PaddleEvent"> | number | null
    refundAmount?: IntNullableFilter<"PaddleEvent"> | number | null
    refundReason?: StringNullableFilter<"PaddleEvent"> | string | null
    eventType?: StringNullableFilter<"PaddleEvent"> | string | null
    payload?: StringFilter<"PaddleEvent"> | string
    processedAt?: DateTimeFilter<"PaddleEvent"> | Date | string
    success?: BoolFilter<"PaddleEvent"> | boolean
    error?: StringNullableFilter<"PaddleEvent"> | string | null
  }, "id" | "eventId">

  export type PaddleEventOrderByWithAggregationInput = {
    id?: SortOrder
    eventId?: SortOrder
    eventName?: SortOrder
    transactionId?: SortOrderInput | SortOrder
    adjustmentId?: SortOrderInput | SortOrder
    userId?: SortOrderInput | SortOrder
    credits?: SortOrderInput | SortOrder
    refundAmount?: SortOrderInput | SortOrder
    refundReason?: SortOrderInput | SortOrder
    eventType?: SortOrderInput | SortOrder
    payload?: SortOrder
    processedAt?: SortOrder
    success?: SortOrder
    error?: SortOrderInput | SortOrder
    _count?: PaddleEventCountOrderByAggregateInput
    _avg?: PaddleEventAvgOrderByAggregateInput
    _max?: PaddleEventMaxOrderByAggregateInput
    _min?: PaddleEventMinOrderByAggregateInput
    _sum?: PaddleEventSumOrderByAggregateInput
  }

  export type PaddleEventScalarWhereWithAggregatesInput = {
    AND?: PaddleEventScalarWhereWithAggregatesInput | PaddleEventScalarWhereWithAggregatesInput[]
    OR?: PaddleEventScalarWhereWithAggregatesInput[]
    NOT?: PaddleEventScalarWhereWithAggregatesInput | PaddleEventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PaddleEvent"> | string
    eventId?: StringWithAggregatesFilter<"PaddleEvent"> | string
    eventName?: StringWithAggregatesFilter<"PaddleEvent"> | string
    transactionId?: StringNullableWithAggregatesFilter<"PaddleEvent"> | string | null
    adjustmentId?: StringNullableWithAggregatesFilter<"PaddleEvent"> | string | null
    userId?: StringNullableWithAggregatesFilter<"PaddleEvent"> | string | null
    credits?: IntNullableWithAggregatesFilter<"PaddleEvent"> | number | null
    refundAmount?: IntNullableWithAggregatesFilter<"PaddleEvent"> | number | null
    refundReason?: StringNullableWithAggregatesFilter<"PaddleEvent"> | string | null
    eventType?: StringNullableWithAggregatesFilter<"PaddleEvent"> | string | null
    payload?: StringWithAggregatesFilter<"PaddleEvent"> | string
    processedAt?: DateTimeWithAggregatesFilter<"PaddleEvent"> | Date | string
    success?: BoolWithAggregatesFilter<"PaddleEvent"> | boolean
    error?: StringNullableWithAggregatesFilter<"PaddleEvent"> | string | null
  }

  export type UserCreateInput = {
    id?: string
    email: string
    passwordHash?: string | null
    name?: string | null
    avatarUrl?: string | null
    oauthProvider?: string | null
    oauthUserId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    photos?: PhotoCreateNestedManyWithoutUserInput
    generations?: GenerationCreateNestedManyWithoutUserInput
    subscription?: SubscriptionCreateNestedOneWithoutUserInput
    quota?: QuotaCreateNestedOneWithoutUserInput
    consents?: ConsentRecordCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    passwordHash?: string | null
    name?: string | null
    avatarUrl?: string | null
    oauthProvider?: string | null
    oauthUserId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    photos?: PhotoUncheckedCreateNestedManyWithoutUserInput
    generations?: GenerationUncheckedCreateNestedManyWithoutUserInput
    subscription?: SubscriptionUncheckedCreateNestedOneWithoutUserInput
    quota?: QuotaUncheckedCreateNestedOneWithoutUserInput
    consents?: ConsentRecordUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    oauthProvider?: NullableStringFieldUpdateOperationsInput | string | null
    oauthUserId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: PhotoUpdateManyWithoutUserNestedInput
    generations?: GenerationUpdateManyWithoutUserNestedInput
    subscription?: SubscriptionUpdateOneWithoutUserNestedInput
    quota?: QuotaUpdateOneWithoutUserNestedInput
    consents?: ConsentRecordUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    oauthProvider?: NullableStringFieldUpdateOperationsInput | string | null
    oauthUserId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: PhotoUncheckedUpdateManyWithoutUserNestedInput
    generations?: GenerationUncheckedUpdateManyWithoutUserNestedInput
    subscription?: SubscriptionUncheckedUpdateOneWithoutUserNestedInput
    quota?: QuotaUncheckedUpdateOneWithoutUserNestedInput
    consents?: ConsentRecordUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    passwordHash?: string | null
    name?: string | null
    avatarUrl?: string | null
    oauthProvider?: string | null
    oauthUserId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    oauthProvider?: NullableStringFieldUpdateOperationsInput | string | null
    oauthUserId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    oauthProvider?: NullableStringFieldUpdateOperationsInput | string | null
    oauthUserId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PhotoCreateInput = {
    id?: string
    r2Key: string
    r2Url?: string | null
    width?: number | null
    height?: number | null
    faceDetected?: boolean
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutPhotosInput
    generations?: GenerationCreateNestedManyWithoutPhotoInput
    analysis?: FaceAnalysisCreateNestedOneWithoutPhotoInput
  }

  export type PhotoUncheckedCreateInput = {
    id?: string
    userId: string
    r2Key: string
    r2Url?: string | null
    width?: number | null
    height?: number | null
    faceDetected?: boolean
    createdAt?: Date | string
    generations?: GenerationUncheckedCreateNestedManyWithoutPhotoInput
    analysis?: FaceAnalysisUncheckedCreateNestedOneWithoutPhotoInput
  }

  export type PhotoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    r2Key?: StringFieldUpdateOperationsInput | string
    r2Url?: NullableStringFieldUpdateOperationsInput | string | null
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    faceDetected?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPhotosNestedInput
    generations?: GenerationUpdateManyWithoutPhotoNestedInput
    analysis?: FaceAnalysisUpdateOneWithoutPhotoNestedInput
  }

  export type PhotoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    r2Key?: StringFieldUpdateOperationsInput | string
    r2Url?: NullableStringFieldUpdateOperationsInput | string | null
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    faceDetected?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    generations?: GenerationUncheckedUpdateManyWithoutPhotoNestedInput
    analysis?: FaceAnalysisUncheckedUpdateOneWithoutPhotoNestedInput
  }

  export type PhotoCreateManyInput = {
    id?: string
    userId: string
    r2Key: string
    r2Url?: string | null
    width?: number | null
    height?: number | null
    faceDetected?: boolean
    createdAt?: Date | string
  }

  export type PhotoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    r2Key?: StringFieldUpdateOperationsInput | string
    r2Url?: NullableStringFieldUpdateOperationsInput | string | null
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    faceDetected?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PhotoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    r2Key?: StringFieldUpdateOperationsInput | string
    r2Url?: NullableStringFieldUpdateOperationsInput | string | null
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    faceDetected?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FaceAnalysisCreateInput = {
    id?: string
    faceShape: string
    hairLength: string
    hairTexture: string
    hairDensity: string
    forehead: string
    jawline: string
    provider?: string
    createdAt?: Date | string
    photo: PhotoCreateNestedOneWithoutAnalysisInput
  }

  export type FaceAnalysisUncheckedCreateInput = {
    id?: string
    photoId: string
    faceShape: string
    hairLength: string
    hairTexture: string
    hairDensity: string
    forehead: string
    jawline: string
    provider?: string
    createdAt?: Date | string
  }

  export type FaceAnalysisUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    faceShape?: StringFieldUpdateOperationsInput | string
    hairLength?: StringFieldUpdateOperationsInput | string
    hairTexture?: StringFieldUpdateOperationsInput | string
    hairDensity?: StringFieldUpdateOperationsInput | string
    forehead?: StringFieldUpdateOperationsInput | string
    jawline?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photo?: PhotoUpdateOneRequiredWithoutAnalysisNestedInput
  }

  export type FaceAnalysisUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    photoId?: StringFieldUpdateOperationsInput | string
    faceShape?: StringFieldUpdateOperationsInput | string
    hairLength?: StringFieldUpdateOperationsInput | string
    hairTexture?: StringFieldUpdateOperationsInput | string
    hairDensity?: StringFieldUpdateOperationsInput | string
    forehead?: StringFieldUpdateOperationsInput | string
    jawline?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FaceAnalysisCreateManyInput = {
    id?: string
    photoId: string
    faceShape: string
    hairLength: string
    hairTexture: string
    hairDensity: string
    forehead: string
    jawline: string
    provider?: string
    createdAt?: Date | string
  }

  export type FaceAnalysisUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    faceShape?: StringFieldUpdateOperationsInput | string
    hairLength?: StringFieldUpdateOperationsInput | string
    hairTexture?: StringFieldUpdateOperationsInput | string
    hairDensity?: StringFieldUpdateOperationsInput | string
    forehead?: StringFieldUpdateOperationsInput | string
    jawline?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FaceAnalysisUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    photoId?: StringFieldUpdateOperationsInput | string
    faceShape?: StringFieldUpdateOperationsInput | string
    hairLength?: StringFieldUpdateOperationsInput | string
    hairTexture?: StringFieldUpdateOperationsInput | string
    hairDensity?: StringFieldUpdateOperationsInput | string
    forehead?: StringFieldUpdateOperationsInput | string
    jawline?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GenerationCreateInput = {
    id?: string
    prompt: string
    status?: string
    replicatePredictionId?: string | null
    resultR2Key?: string | null
    resultR2Url?: string | null
    error?: string | null
    styleId?: string | null
    styleName?: string | null
    mode?: string
    batchId?: string | null
    hairColor?: string | null
    referencePhotoId?: string | null
    shareToken?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
    user: UserCreateNestedOneWithoutGenerationsInput
    photo: PhotoCreateNestedOneWithoutGenerationsInput
  }

  export type GenerationUncheckedCreateInput = {
    id?: string
    userId: string
    photoId: string
    prompt: string
    status?: string
    replicatePredictionId?: string | null
    resultR2Key?: string | null
    resultR2Url?: string | null
    error?: string | null
    styleId?: string | null
    styleName?: string | null
    mode?: string
    batchId?: string | null
    hairColor?: string | null
    referencePhotoId?: string | null
    shareToken?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type GenerationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    prompt?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    replicatePredictionId?: NullableStringFieldUpdateOperationsInput | string | null
    resultR2Key?: NullableStringFieldUpdateOperationsInput | string | null
    resultR2Url?: NullableStringFieldUpdateOperationsInput | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    styleId?: NullableStringFieldUpdateOperationsInput | string | null
    styleName?: NullableStringFieldUpdateOperationsInput | string | null
    mode?: StringFieldUpdateOperationsInput | string
    batchId?: NullableStringFieldUpdateOperationsInput | string | null
    hairColor?: NullableStringFieldUpdateOperationsInput | string | null
    referencePhotoId?: NullableStringFieldUpdateOperationsInput | string | null
    shareToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutGenerationsNestedInput
    photo?: PhotoUpdateOneRequiredWithoutGenerationsNestedInput
  }

  export type GenerationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    photoId?: StringFieldUpdateOperationsInput | string
    prompt?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    replicatePredictionId?: NullableStringFieldUpdateOperationsInput | string | null
    resultR2Key?: NullableStringFieldUpdateOperationsInput | string | null
    resultR2Url?: NullableStringFieldUpdateOperationsInput | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    styleId?: NullableStringFieldUpdateOperationsInput | string | null
    styleName?: NullableStringFieldUpdateOperationsInput | string | null
    mode?: StringFieldUpdateOperationsInput | string
    batchId?: NullableStringFieldUpdateOperationsInput | string | null
    hairColor?: NullableStringFieldUpdateOperationsInput | string | null
    referencePhotoId?: NullableStringFieldUpdateOperationsInput | string | null
    shareToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GenerationCreateManyInput = {
    id?: string
    userId: string
    photoId: string
    prompt: string
    status?: string
    replicatePredictionId?: string | null
    resultR2Key?: string | null
    resultR2Url?: string | null
    error?: string | null
    styleId?: string | null
    styleName?: string | null
    mode?: string
    batchId?: string | null
    hairColor?: string | null
    referencePhotoId?: string | null
    shareToken?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type GenerationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    prompt?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    replicatePredictionId?: NullableStringFieldUpdateOperationsInput | string | null
    resultR2Key?: NullableStringFieldUpdateOperationsInput | string | null
    resultR2Url?: NullableStringFieldUpdateOperationsInput | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    styleId?: NullableStringFieldUpdateOperationsInput | string | null
    styleName?: NullableStringFieldUpdateOperationsInput | string | null
    mode?: StringFieldUpdateOperationsInput | string
    batchId?: NullableStringFieldUpdateOperationsInput | string | null
    hairColor?: NullableStringFieldUpdateOperationsInput | string | null
    referencePhotoId?: NullableStringFieldUpdateOperationsInput | string | null
    shareToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GenerationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    photoId?: StringFieldUpdateOperationsInput | string
    prompt?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    replicatePredictionId?: NullableStringFieldUpdateOperationsInput | string | null
    resultR2Key?: NullableStringFieldUpdateOperationsInput | string | null
    resultR2Url?: NullableStringFieldUpdateOperationsInput | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    styleId?: NullableStringFieldUpdateOperationsInput | string | null
    styleName?: NullableStringFieldUpdateOperationsInput | string | null
    mode?: StringFieldUpdateOperationsInput | string
    batchId?: NullableStringFieldUpdateOperationsInput | string | null
    hairColor?: NullableStringFieldUpdateOperationsInput | string | null
    referencePhotoId?: NullableStringFieldUpdateOperationsInput | string | null
    shareToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SubscriptionCreateInput = {
    id?: string
    stripeSubId?: string | null
    status?: string
    stripeCustomerId?: string | null
    currentPeriodEnd?: Date | string | null
    cancelAtPeriodEnd?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutSubscriptionInput
  }

  export type SubscriptionUncheckedCreateInput = {
    id?: string
    userId: string
    stripeSubId?: string | null
    status?: string
    stripeCustomerId?: string | null
    currentPeriodEnd?: Date | string | null
    cancelAtPeriodEnd?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubscriptionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripeSubId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSubscriptionNestedInput
  }

  export type SubscriptionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    stripeSubId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionCreateManyInput = {
    id?: string
    userId: string
    stripeSubId?: string | null
    status?: string
    stripeCustomerId?: string | null
    currentPeriodEnd?: Date | string | null
    cancelAtPeriodEnd?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubscriptionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripeSubId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    stripeSubId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuotaCreateInput = {
    id?: string
    freeUsedThisMonth?: number
    freeResetAt: Date | string
    paidCredits?: number
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutQuotaInput
  }

  export type QuotaUncheckedCreateInput = {
    id?: string
    userId: string
    freeUsedThisMonth?: number
    freeResetAt: Date | string
    paidCredits?: number
    updatedAt?: Date | string
  }

  export type QuotaUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    freeUsedThisMonth?: IntFieldUpdateOperationsInput | number
    freeResetAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paidCredits?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutQuotaNestedInput
  }

  export type QuotaUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    freeUsedThisMonth?: IntFieldUpdateOperationsInput | number
    freeResetAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paidCredits?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuotaCreateManyInput = {
    id?: string
    userId: string
    freeUsedThisMonth?: number
    freeResetAt: Date | string
    paidCredits?: number
    updatedAt?: Date | string
  }

  export type QuotaUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    freeUsedThisMonth?: IntFieldUpdateOperationsInput | number
    freeResetAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paidCredits?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuotaUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    freeUsedThisMonth?: IntFieldUpdateOperationsInput | number
    freeResetAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paidCredits?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConsentRecordCreateInput = {
    id?: string
    accepted: string
    policyVersion: string
    recordedAt?: Date | string
    user: UserCreateNestedOneWithoutConsentsInput
  }

  export type ConsentRecordUncheckedCreateInput = {
    id?: string
    userId: string
    accepted: string
    policyVersion: string
    recordedAt?: Date | string
  }

  export type ConsentRecordUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    accepted?: StringFieldUpdateOperationsInput | string
    policyVersion?: StringFieldUpdateOperationsInput | string
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutConsentsNestedInput
  }

  export type ConsentRecordUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    accepted?: StringFieldUpdateOperationsInput | string
    policyVersion?: StringFieldUpdateOperationsInput | string
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConsentRecordCreateManyInput = {
    id?: string
    userId: string
    accepted: string
    policyVersion: string
    recordedAt?: Date | string
  }

  export type ConsentRecordUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    accepted?: StringFieldUpdateOperationsInput | string
    policyVersion?: StringFieldUpdateOperationsInput | string
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConsentRecordUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    accepted?: StringFieldUpdateOperationsInput | string
    policyVersion?: StringFieldUpdateOperationsInput | string
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DsrRequestCreateInput = {
    id?: string
    userId: string
    status?: string
    reason?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type DsrRequestUncheckedCreateInput = {
    id?: string
    userId: string
    status?: string
    reason?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type DsrRequestUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type DsrRequestUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type DsrRequestCreateManyInput = {
    id?: string
    userId: string
    status?: string
    reason?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type DsrRequestUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type DsrRequestUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PaddleEventCreateInput = {
    id?: string
    eventId: string
    eventName: string
    transactionId?: string | null
    adjustmentId?: string | null
    userId?: string | null
    credits?: number | null
    refundAmount?: number | null
    refundReason?: string | null
    eventType?: string | null
    payload: string
    processedAt?: Date | string
    success?: boolean
    error?: string | null
  }

  export type PaddleEventUncheckedCreateInput = {
    id?: string
    eventId: string
    eventName: string
    transactionId?: string | null
    adjustmentId?: string | null
    userId?: string | null
    credits?: number | null
    refundAmount?: number | null
    refundReason?: string | null
    eventType?: string | null
    payload: string
    processedAt?: Date | string
    success?: boolean
    error?: string | null
  }

  export type PaddleEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    eventName?: StringFieldUpdateOperationsInput | string
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
    adjustmentId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    credits?: NullableIntFieldUpdateOperationsInput | number | null
    refundAmount?: NullableIntFieldUpdateOperationsInput | number | null
    refundReason?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: StringFieldUpdateOperationsInput | string
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    success?: BoolFieldUpdateOperationsInput | boolean
    error?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PaddleEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    eventName?: StringFieldUpdateOperationsInput | string
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
    adjustmentId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    credits?: NullableIntFieldUpdateOperationsInput | number | null
    refundAmount?: NullableIntFieldUpdateOperationsInput | number | null
    refundReason?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: StringFieldUpdateOperationsInput | string
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    success?: BoolFieldUpdateOperationsInput | boolean
    error?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PaddleEventCreateManyInput = {
    id?: string
    eventId: string
    eventName: string
    transactionId?: string | null
    adjustmentId?: string | null
    userId?: string | null
    credits?: number | null
    refundAmount?: number | null
    refundReason?: string | null
    eventType?: string | null
    payload: string
    processedAt?: Date | string
    success?: boolean
    error?: string | null
  }

  export type PaddleEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    eventName?: StringFieldUpdateOperationsInput | string
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
    adjustmentId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    credits?: NullableIntFieldUpdateOperationsInput | number | null
    refundAmount?: NullableIntFieldUpdateOperationsInput | number | null
    refundReason?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: StringFieldUpdateOperationsInput | string
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    success?: BoolFieldUpdateOperationsInput | boolean
    error?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PaddleEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    eventName?: StringFieldUpdateOperationsInput | string
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
    adjustmentId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    credits?: NullableIntFieldUpdateOperationsInput | number | null
    refundAmount?: NullableIntFieldUpdateOperationsInput | number | null
    refundReason?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: StringFieldUpdateOperationsInput | string
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    success?: BoolFieldUpdateOperationsInput | boolean
    error?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type PhotoListRelationFilter = {
    every?: PhotoWhereInput
    some?: PhotoWhereInput
    none?: PhotoWhereInput
  }

  export type GenerationListRelationFilter = {
    every?: GenerationWhereInput
    some?: GenerationWhereInput
    none?: GenerationWhereInput
  }

  export type SubscriptionNullableRelationFilter = {
    is?: SubscriptionWhereInput | null
    isNot?: SubscriptionWhereInput | null
  }

  export type QuotaNullableRelationFilter = {
    is?: QuotaWhereInput | null
    isNot?: QuotaWhereInput | null
  }

  export type ConsentRecordListRelationFilter = {
    every?: ConsentRecordWhereInput
    some?: ConsentRecordWhereInput
    none?: ConsentRecordWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type PhotoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GenerationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ConsentRecordOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    avatarUrl?: SortOrder
    oauthProvider?: SortOrder
    oauthUserId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    avatarUrl?: SortOrder
    oauthProvider?: SortOrder
    oauthUserId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    avatarUrl?: SortOrder
    oauthProvider?: SortOrder
    oauthUserId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type FaceAnalysisNullableRelationFilter = {
    is?: FaceAnalysisWhereInput | null
    isNot?: FaceAnalysisWhereInput | null
  }

  export type PhotoCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    r2Key?: SortOrder
    r2Url?: SortOrder
    width?: SortOrder
    height?: SortOrder
    faceDetected?: SortOrder
    createdAt?: SortOrder
  }

  export type PhotoAvgOrderByAggregateInput = {
    width?: SortOrder
    height?: SortOrder
  }

  export type PhotoMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    r2Key?: SortOrder
    r2Url?: SortOrder
    width?: SortOrder
    height?: SortOrder
    faceDetected?: SortOrder
    createdAt?: SortOrder
  }

  export type PhotoMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    r2Key?: SortOrder
    r2Url?: SortOrder
    width?: SortOrder
    height?: SortOrder
    faceDetected?: SortOrder
    createdAt?: SortOrder
  }

  export type PhotoSumOrderByAggregateInput = {
    width?: SortOrder
    height?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type PhotoRelationFilter = {
    is?: PhotoWhereInput
    isNot?: PhotoWhereInput
  }

  export type FaceAnalysisCountOrderByAggregateInput = {
    id?: SortOrder
    photoId?: SortOrder
    faceShape?: SortOrder
    hairLength?: SortOrder
    hairTexture?: SortOrder
    hairDensity?: SortOrder
    forehead?: SortOrder
    jawline?: SortOrder
    provider?: SortOrder
    createdAt?: SortOrder
  }

  export type FaceAnalysisMaxOrderByAggregateInput = {
    id?: SortOrder
    photoId?: SortOrder
    faceShape?: SortOrder
    hairLength?: SortOrder
    hairTexture?: SortOrder
    hairDensity?: SortOrder
    forehead?: SortOrder
    jawline?: SortOrder
    provider?: SortOrder
    createdAt?: SortOrder
  }

  export type FaceAnalysisMinOrderByAggregateInput = {
    id?: SortOrder
    photoId?: SortOrder
    faceShape?: SortOrder
    hairLength?: SortOrder
    hairTexture?: SortOrder
    hairDensity?: SortOrder
    forehead?: SortOrder
    jawline?: SortOrder
    provider?: SortOrder
    createdAt?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type GenerationCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    photoId?: SortOrder
    prompt?: SortOrder
    status?: SortOrder
    replicatePredictionId?: SortOrder
    resultR2Key?: SortOrder
    resultR2Url?: SortOrder
    error?: SortOrder
    styleId?: SortOrder
    styleName?: SortOrder
    mode?: SortOrder
    batchId?: SortOrder
    hairColor?: SortOrder
    referencePhotoId?: SortOrder
    shareToken?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrder
  }

  export type GenerationMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    photoId?: SortOrder
    prompt?: SortOrder
    status?: SortOrder
    replicatePredictionId?: SortOrder
    resultR2Key?: SortOrder
    resultR2Url?: SortOrder
    error?: SortOrder
    styleId?: SortOrder
    styleName?: SortOrder
    mode?: SortOrder
    batchId?: SortOrder
    hairColor?: SortOrder
    referencePhotoId?: SortOrder
    shareToken?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrder
  }

  export type GenerationMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    photoId?: SortOrder
    prompt?: SortOrder
    status?: SortOrder
    replicatePredictionId?: SortOrder
    resultR2Key?: SortOrder
    resultR2Url?: SortOrder
    error?: SortOrder
    styleId?: SortOrder
    styleName?: SortOrder
    mode?: SortOrder
    batchId?: SortOrder
    hairColor?: SortOrder
    referencePhotoId?: SortOrder
    shareToken?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type SubscriptionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    stripeSubId?: SortOrder
    status?: SortOrder
    stripeCustomerId?: SortOrder
    currentPeriodEnd?: SortOrder
    cancelAtPeriodEnd?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SubscriptionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    stripeSubId?: SortOrder
    status?: SortOrder
    stripeCustomerId?: SortOrder
    currentPeriodEnd?: SortOrder
    cancelAtPeriodEnd?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SubscriptionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    stripeSubId?: SortOrder
    status?: SortOrder
    stripeCustomerId?: SortOrder
    currentPeriodEnd?: SortOrder
    cancelAtPeriodEnd?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type QuotaCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    freeUsedThisMonth?: SortOrder
    freeResetAt?: SortOrder
    paidCredits?: SortOrder
    updatedAt?: SortOrder
  }

  export type QuotaAvgOrderByAggregateInput = {
    freeUsedThisMonth?: SortOrder
    paidCredits?: SortOrder
  }

  export type QuotaMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    freeUsedThisMonth?: SortOrder
    freeResetAt?: SortOrder
    paidCredits?: SortOrder
    updatedAt?: SortOrder
  }

  export type QuotaMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    freeUsedThisMonth?: SortOrder
    freeResetAt?: SortOrder
    paidCredits?: SortOrder
    updatedAt?: SortOrder
  }

  export type QuotaSumOrderByAggregateInput = {
    freeUsedThisMonth?: SortOrder
    paidCredits?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type ConsentRecordCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    accepted?: SortOrder
    policyVersion?: SortOrder
    recordedAt?: SortOrder
  }

  export type ConsentRecordMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    accepted?: SortOrder
    policyVersion?: SortOrder
    recordedAt?: SortOrder
  }

  export type ConsentRecordMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    accepted?: SortOrder
    policyVersion?: SortOrder
    recordedAt?: SortOrder
  }

  export type DsrRequestCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    reason?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrder
  }

  export type DsrRequestMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    reason?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrder
  }

  export type DsrRequestMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    reason?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrder
  }

  export type PaddleEventCountOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    eventName?: SortOrder
    transactionId?: SortOrder
    adjustmentId?: SortOrder
    userId?: SortOrder
    credits?: SortOrder
    refundAmount?: SortOrder
    refundReason?: SortOrder
    eventType?: SortOrder
    payload?: SortOrder
    processedAt?: SortOrder
    success?: SortOrder
    error?: SortOrder
  }

  export type PaddleEventAvgOrderByAggregateInput = {
    credits?: SortOrder
    refundAmount?: SortOrder
  }

  export type PaddleEventMaxOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    eventName?: SortOrder
    transactionId?: SortOrder
    adjustmentId?: SortOrder
    userId?: SortOrder
    credits?: SortOrder
    refundAmount?: SortOrder
    refundReason?: SortOrder
    eventType?: SortOrder
    payload?: SortOrder
    processedAt?: SortOrder
    success?: SortOrder
    error?: SortOrder
  }

  export type PaddleEventMinOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    eventName?: SortOrder
    transactionId?: SortOrder
    adjustmentId?: SortOrder
    userId?: SortOrder
    credits?: SortOrder
    refundAmount?: SortOrder
    refundReason?: SortOrder
    eventType?: SortOrder
    payload?: SortOrder
    processedAt?: SortOrder
    success?: SortOrder
    error?: SortOrder
  }

  export type PaddleEventSumOrderByAggregateInput = {
    credits?: SortOrder
    refundAmount?: SortOrder
  }

  export type PhotoCreateNestedManyWithoutUserInput = {
    create?: XOR<PhotoCreateWithoutUserInput, PhotoUncheckedCreateWithoutUserInput> | PhotoCreateWithoutUserInput[] | PhotoUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PhotoCreateOrConnectWithoutUserInput | PhotoCreateOrConnectWithoutUserInput[]
    createMany?: PhotoCreateManyUserInputEnvelope
    connect?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
  }

  export type GenerationCreateNestedManyWithoutUserInput = {
    create?: XOR<GenerationCreateWithoutUserInput, GenerationUncheckedCreateWithoutUserInput> | GenerationCreateWithoutUserInput[] | GenerationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: GenerationCreateOrConnectWithoutUserInput | GenerationCreateOrConnectWithoutUserInput[]
    createMany?: GenerationCreateManyUserInputEnvelope
    connect?: GenerationWhereUniqueInput | GenerationWhereUniqueInput[]
  }

  export type SubscriptionCreateNestedOneWithoutUserInput = {
    create?: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput>
    connectOrCreate?: SubscriptionCreateOrConnectWithoutUserInput
    connect?: SubscriptionWhereUniqueInput
  }

  export type QuotaCreateNestedOneWithoutUserInput = {
    create?: XOR<QuotaCreateWithoutUserInput, QuotaUncheckedCreateWithoutUserInput>
    connectOrCreate?: QuotaCreateOrConnectWithoutUserInput
    connect?: QuotaWhereUniqueInput
  }

  export type ConsentRecordCreateNestedManyWithoutUserInput = {
    create?: XOR<ConsentRecordCreateWithoutUserInput, ConsentRecordUncheckedCreateWithoutUserInput> | ConsentRecordCreateWithoutUserInput[] | ConsentRecordUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ConsentRecordCreateOrConnectWithoutUserInput | ConsentRecordCreateOrConnectWithoutUserInput[]
    createMany?: ConsentRecordCreateManyUserInputEnvelope
    connect?: ConsentRecordWhereUniqueInput | ConsentRecordWhereUniqueInput[]
  }

  export type PhotoUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PhotoCreateWithoutUserInput, PhotoUncheckedCreateWithoutUserInput> | PhotoCreateWithoutUserInput[] | PhotoUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PhotoCreateOrConnectWithoutUserInput | PhotoCreateOrConnectWithoutUserInput[]
    createMany?: PhotoCreateManyUserInputEnvelope
    connect?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
  }

  export type GenerationUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<GenerationCreateWithoutUserInput, GenerationUncheckedCreateWithoutUserInput> | GenerationCreateWithoutUserInput[] | GenerationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: GenerationCreateOrConnectWithoutUserInput | GenerationCreateOrConnectWithoutUserInput[]
    createMany?: GenerationCreateManyUserInputEnvelope
    connect?: GenerationWhereUniqueInput | GenerationWhereUniqueInput[]
  }

  export type SubscriptionUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput>
    connectOrCreate?: SubscriptionCreateOrConnectWithoutUserInput
    connect?: SubscriptionWhereUniqueInput
  }

  export type QuotaUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<QuotaCreateWithoutUserInput, QuotaUncheckedCreateWithoutUserInput>
    connectOrCreate?: QuotaCreateOrConnectWithoutUserInput
    connect?: QuotaWhereUniqueInput
  }

  export type ConsentRecordUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ConsentRecordCreateWithoutUserInput, ConsentRecordUncheckedCreateWithoutUserInput> | ConsentRecordCreateWithoutUserInput[] | ConsentRecordUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ConsentRecordCreateOrConnectWithoutUserInput | ConsentRecordCreateOrConnectWithoutUserInput[]
    createMany?: ConsentRecordCreateManyUserInputEnvelope
    connect?: ConsentRecordWhereUniqueInput | ConsentRecordWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type PhotoUpdateManyWithoutUserNestedInput = {
    create?: XOR<PhotoCreateWithoutUserInput, PhotoUncheckedCreateWithoutUserInput> | PhotoCreateWithoutUserInput[] | PhotoUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PhotoCreateOrConnectWithoutUserInput | PhotoCreateOrConnectWithoutUserInput[]
    upsert?: PhotoUpsertWithWhereUniqueWithoutUserInput | PhotoUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PhotoCreateManyUserInputEnvelope
    set?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
    disconnect?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
    delete?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
    connect?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
    update?: PhotoUpdateWithWhereUniqueWithoutUserInput | PhotoUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PhotoUpdateManyWithWhereWithoutUserInput | PhotoUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PhotoScalarWhereInput | PhotoScalarWhereInput[]
  }

  export type GenerationUpdateManyWithoutUserNestedInput = {
    create?: XOR<GenerationCreateWithoutUserInput, GenerationUncheckedCreateWithoutUserInput> | GenerationCreateWithoutUserInput[] | GenerationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: GenerationCreateOrConnectWithoutUserInput | GenerationCreateOrConnectWithoutUserInput[]
    upsert?: GenerationUpsertWithWhereUniqueWithoutUserInput | GenerationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: GenerationCreateManyUserInputEnvelope
    set?: GenerationWhereUniqueInput | GenerationWhereUniqueInput[]
    disconnect?: GenerationWhereUniqueInput | GenerationWhereUniqueInput[]
    delete?: GenerationWhereUniqueInput | GenerationWhereUniqueInput[]
    connect?: GenerationWhereUniqueInput | GenerationWhereUniqueInput[]
    update?: GenerationUpdateWithWhereUniqueWithoutUserInput | GenerationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: GenerationUpdateManyWithWhereWithoutUserInput | GenerationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: GenerationScalarWhereInput | GenerationScalarWhereInput[]
  }

  export type SubscriptionUpdateOneWithoutUserNestedInput = {
    create?: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput>
    connectOrCreate?: SubscriptionCreateOrConnectWithoutUserInput
    upsert?: SubscriptionUpsertWithoutUserInput
    disconnect?: SubscriptionWhereInput | boolean
    delete?: SubscriptionWhereInput | boolean
    connect?: SubscriptionWhereUniqueInput
    update?: XOR<XOR<SubscriptionUpdateToOneWithWhereWithoutUserInput, SubscriptionUpdateWithoutUserInput>, SubscriptionUncheckedUpdateWithoutUserInput>
  }

  export type QuotaUpdateOneWithoutUserNestedInput = {
    create?: XOR<QuotaCreateWithoutUserInput, QuotaUncheckedCreateWithoutUserInput>
    connectOrCreate?: QuotaCreateOrConnectWithoutUserInput
    upsert?: QuotaUpsertWithoutUserInput
    disconnect?: QuotaWhereInput | boolean
    delete?: QuotaWhereInput | boolean
    connect?: QuotaWhereUniqueInput
    update?: XOR<XOR<QuotaUpdateToOneWithWhereWithoutUserInput, QuotaUpdateWithoutUserInput>, QuotaUncheckedUpdateWithoutUserInput>
  }

  export type ConsentRecordUpdateManyWithoutUserNestedInput = {
    create?: XOR<ConsentRecordCreateWithoutUserInput, ConsentRecordUncheckedCreateWithoutUserInput> | ConsentRecordCreateWithoutUserInput[] | ConsentRecordUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ConsentRecordCreateOrConnectWithoutUserInput | ConsentRecordCreateOrConnectWithoutUserInput[]
    upsert?: ConsentRecordUpsertWithWhereUniqueWithoutUserInput | ConsentRecordUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ConsentRecordCreateManyUserInputEnvelope
    set?: ConsentRecordWhereUniqueInput | ConsentRecordWhereUniqueInput[]
    disconnect?: ConsentRecordWhereUniqueInput | ConsentRecordWhereUniqueInput[]
    delete?: ConsentRecordWhereUniqueInput | ConsentRecordWhereUniqueInput[]
    connect?: ConsentRecordWhereUniqueInput | ConsentRecordWhereUniqueInput[]
    update?: ConsentRecordUpdateWithWhereUniqueWithoutUserInput | ConsentRecordUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ConsentRecordUpdateManyWithWhereWithoutUserInput | ConsentRecordUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ConsentRecordScalarWhereInput | ConsentRecordScalarWhereInput[]
  }

  export type PhotoUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PhotoCreateWithoutUserInput, PhotoUncheckedCreateWithoutUserInput> | PhotoCreateWithoutUserInput[] | PhotoUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PhotoCreateOrConnectWithoutUserInput | PhotoCreateOrConnectWithoutUserInput[]
    upsert?: PhotoUpsertWithWhereUniqueWithoutUserInput | PhotoUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PhotoCreateManyUserInputEnvelope
    set?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
    disconnect?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
    delete?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
    connect?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
    update?: PhotoUpdateWithWhereUniqueWithoutUserInput | PhotoUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PhotoUpdateManyWithWhereWithoutUserInput | PhotoUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PhotoScalarWhereInput | PhotoScalarWhereInput[]
  }

  export type GenerationUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<GenerationCreateWithoutUserInput, GenerationUncheckedCreateWithoutUserInput> | GenerationCreateWithoutUserInput[] | GenerationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: GenerationCreateOrConnectWithoutUserInput | GenerationCreateOrConnectWithoutUserInput[]
    upsert?: GenerationUpsertWithWhereUniqueWithoutUserInput | GenerationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: GenerationCreateManyUserInputEnvelope
    set?: GenerationWhereUniqueInput | GenerationWhereUniqueInput[]
    disconnect?: GenerationWhereUniqueInput | GenerationWhereUniqueInput[]
    delete?: GenerationWhereUniqueInput | GenerationWhereUniqueInput[]
    connect?: GenerationWhereUniqueInput | GenerationWhereUniqueInput[]
    update?: GenerationUpdateWithWhereUniqueWithoutUserInput | GenerationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: GenerationUpdateManyWithWhereWithoutUserInput | GenerationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: GenerationScalarWhereInput | GenerationScalarWhereInput[]
  }

  export type SubscriptionUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput>
    connectOrCreate?: SubscriptionCreateOrConnectWithoutUserInput
    upsert?: SubscriptionUpsertWithoutUserInput
    disconnect?: SubscriptionWhereInput | boolean
    delete?: SubscriptionWhereInput | boolean
    connect?: SubscriptionWhereUniqueInput
    update?: XOR<XOR<SubscriptionUpdateToOneWithWhereWithoutUserInput, SubscriptionUpdateWithoutUserInput>, SubscriptionUncheckedUpdateWithoutUserInput>
  }

  export type QuotaUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<QuotaCreateWithoutUserInput, QuotaUncheckedCreateWithoutUserInput>
    connectOrCreate?: QuotaCreateOrConnectWithoutUserInput
    upsert?: QuotaUpsertWithoutUserInput
    disconnect?: QuotaWhereInput | boolean
    delete?: QuotaWhereInput | boolean
    connect?: QuotaWhereUniqueInput
    update?: XOR<XOR<QuotaUpdateToOneWithWhereWithoutUserInput, QuotaUpdateWithoutUserInput>, QuotaUncheckedUpdateWithoutUserInput>
  }

  export type ConsentRecordUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ConsentRecordCreateWithoutUserInput, ConsentRecordUncheckedCreateWithoutUserInput> | ConsentRecordCreateWithoutUserInput[] | ConsentRecordUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ConsentRecordCreateOrConnectWithoutUserInput | ConsentRecordCreateOrConnectWithoutUserInput[]
    upsert?: ConsentRecordUpsertWithWhereUniqueWithoutUserInput | ConsentRecordUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ConsentRecordCreateManyUserInputEnvelope
    set?: ConsentRecordWhereUniqueInput | ConsentRecordWhereUniqueInput[]
    disconnect?: ConsentRecordWhereUniqueInput | ConsentRecordWhereUniqueInput[]
    delete?: ConsentRecordWhereUniqueInput | ConsentRecordWhereUniqueInput[]
    connect?: ConsentRecordWhereUniqueInput | ConsentRecordWhereUniqueInput[]
    update?: ConsentRecordUpdateWithWhereUniqueWithoutUserInput | ConsentRecordUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ConsentRecordUpdateManyWithWhereWithoutUserInput | ConsentRecordUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ConsentRecordScalarWhereInput | ConsentRecordScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutPhotosInput = {
    create?: XOR<UserCreateWithoutPhotosInput, UserUncheckedCreateWithoutPhotosInput>
    connectOrCreate?: UserCreateOrConnectWithoutPhotosInput
    connect?: UserWhereUniqueInput
  }

  export type GenerationCreateNestedManyWithoutPhotoInput = {
    create?: XOR<GenerationCreateWithoutPhotoInput, GenerationUncheckedCreateWithoutPhotoInput> | GenerationCreateWithoutPhotoInput[] | GenerationUncheckedCreateWithoutPhotoInput[]
    connectOrCreate?: GenerationCreateOrConnectWithoutPhotoInput | GenerationCreateOrConnectWithoutPhotoInput[]
    createMany?: GenerationCreateManyPhotoInputEnvelope
    connect?: GenerationWhereUniqueInput | GenerationWhereUniqueInput[]
  }

  export type FaceAnalysisCreateNestedOneWithoutPhotoInput = {
    create?: XOR<FaceAnalysisCreateWithoutPhotoInput, FaceAnalysisUncheckedCreateWithoutPhotoInput>
    connectOrCreate?: FaceAnalysisCreateOrConnectWithoutPhotoInput
    connect?: FaceAnalysisWhereUniqueInput
  }

  export type GenerationUncheckedCreateNestedManyWithoutPhotoInput = {
    create?: XOR<GenerationCreateWithoutPhotoInput, GenerationUncheckedCreateWithoutPhotoInput> | GenerationCreateWithoutPhotoInput[] | GenerationUncheckedCreateWithoutPhotoInput[]
    connectOrCreate?: GenerationCreateOrConnectWithoutPhotoInput | GenerationCreateOrConnectWithoutPhotoInput[]
    createMany?: GenerationCreateManyPhotoInputEnvelope
    connect?: GenerationWhereUniqueInput | GenerationWhereUniqueInput[]
  }

  export type FaceAnalysisUncheckedCreateNestedOneWithoutPhotoInput = {
    create?: XOR<FaceAnalysisCreateWithoutPhotoInput, FaceAnalysisUncheckedCreateWithoutPhotoInput>
    connectOrCreate?: FaceAnalysisCreateOrConnectWithoutPhotoInput
    connect?: FaceAnalysisWhereUniqueInput
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type UserUpdateOneRequiredWithoutPhotosNestedInput = {
    create?: XOR<UserCreateWithoutPhotosInput, UserUncheckedCreateWithoutPhotosInput>
    connectOrCreate?: UserCreateOrConnectWithoutPhotosInput
    upsert?: UserUpsertWithoutPhotosInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPhotosInput, UserUpdateWithoutPhotosInput>, UserUncheckedUpdateWithoutPhotosInput>
  }

  export type GenerationUpdateManyWithoutPhotoNestedInput = {
    create?: XOR<GenerationCreateWithoutPhotoInput, GenerationUncheckedCreateWithoutPhotoInput> | GenerationCreateWithoutPhotoInput[] | GenerationUncheckedCreateWithoutPhotoInput[]
    connectOrCreate?: GenerationCreateOrConnectWithoutPhotoInput | GenerationCreateOrConnectWithoutPhotoInput[]
    upsert?: GenerationUpsertWithWhereUniqueWithoutPhotoInput | GenerationUpsertWithWhereUniqueWithoutPhotoInput[]
    createMany?: GenerationCreateManyPhotoInputEnvelope
    set?: GenerationWhereUniqueInput | GenerationWhereUniqueInput[]
    disconnect?: GenerationWhereUniqueInput | GenerationWhereUniqueInput[]
    delete?: GenerationWhereUniqueInput | GenerationWhereUniqueInput[]
    connect?: GenerationWhereUniqueInput | GenerationWhereUniqueInput[]
    update?: GenerationUpdateWithWhereUniqueWithoutPhotoInput | GenerationUpdateWithWhereUniqueWithoutPhotoInput[]
    updateMany?: GenerationUpdateManyWithWhereWithoutPhotoInput | GenerationUpdateManyWithWhereWithoutPhotoInput[]
    deleteMany?: GenerationScalarWhereInput | GenerationScalarWhereInput[]
  }

  export type FaceAnalysisUpdateOneWithoutPhotoNestedInput = {
    create?: XOR<FaceAnalysisCreateWithoutPhotoInput, FaceAnalysisUncheckedCreateWithoutPhotoInput>
    connectOrCreate?: FaceAnalysisCreateOrConnectWithoutPhotoInput
    upsert?: FaceAnalysisUpsertWithoutPhotoInput
    disconnect?: FaceAnalysisWhereInput | boolean
    delete?: FaceAnalysisWhereInput | boolean
    connect?: FaceAnalysisWhereUniqueInput
    update?: XOR<XOR<FaceAnalysisUpdateToOneWithWhereWithoutPhotoInput, FaceAnalysisUpdateWithoutPhotoInput>, FaceAnalysisUncheckedUpdateWithoutPhotoInput>
  }

  export type GenerationUncheckedUpdateManyWithoutPhotoNestedInput = {
    create?: XOR<GenerationCreateWithoutPhotoInput, GenerationUncheckedCreateWithoutPhotoInput> | GenerationCreateWithoutPhotoInput[] | GenerationUncheckedCreateWithoutPhotoInput[]
    connectOrCreate?: GenerationCreateOrConnectWithoutPhotoInput | GenerationCreateOrConnectWithoutPhotoInput[]
    upsert?: GenerationUpsertWithWhereUniqueWithoutPhotoInput | GenerationUpsertWithWhereUniqueWithoutPhotoInput[]
    createMany?: GenerationCreateManyPhotoInputEnvelope
    set?: GenerationWhereUniqueInput | GenerationWhereUniqueInput[]
    disconnect?: GenerationWhereUniqueInput | GenerationWhereUniqueInput[]
    delete?: GenerationWhereUniqueInput | GenerationWhereUniqueInput[]
    connect?: GenerationWhereUniqueInput | GenerationWhereUniqueInput[]
    update?: GenerationUpdateWithWhereUniqueWithoutPhotoInput | GenerationUpdateWithWhereUniqueWithoutPhotoInput[]
    updateMany?: GenerationUpdateManyWithWhereWithoutPhotoInput | GenerationUpdateManyWithWhereWithoutPhotoInput[]
    deleteMany?: GenerationScalarWhereInput | GenerationScalarWhereInput[]
  }

  export type FaceAnalysisUncheckedUpdateOneWithoutPhotoNestedInput = {
    create?: XOR<FaceAnalysisCreateWithoutPhotoInput, FaceAnalysisUncheckedCreateWithoutPhotoInput>
    connectOrCreate?: FaceAnalysisCreateOrConnectWithoutPhotoInput
    upsert?: FaceAnalysisUpsertWithoutPhotoInput
    disconnect?: FaceAnalysisWhereInput | boolean
    delete?: FaceAnalysisWhereInput | boolean
    connect?: FaceAnalysisWhereUniqueInput
    update?: XOR<XOR<FaceAnalysisUpdateToOneWithWhereWithoutPhotoInput, FaceAnalysisUpdateWithoutPhotoInput>, FaceAnalysisUncheckedUpdateWithoutPhotoInput>
  }

  export type PhotoCreateNestedOneWithoutAnalysisInput = {
    create?: XOR<PhotoCreateWithoutAnalysisInput, PhotoUncheckedCreateWithoutAnalysisInput>
    connectOrCreate?: PhotoCreateOrConnectWithoutAnalysisInput
    connect?: PhotoWhereUniqueInput
  }

  export type PhotoUpdateOneRequiredWithoutAnalysisNestedInput = {
    create?: XOR<PhotoCreateWithoutAnalysisInput, PhotoUncheckedCreateWithoutAnalysisInput>
    connectOrCreate?: PhotoCreateOrConnectWithoutAnalysisInput
    upsert?: PhotoUpsertWithoutAnalysisInput
    connect?: PhotoWhereUniqueInput
    update?: XOR<XOR<PhotoUpdateToOneWithWhereWithoutAnalysisInput, PhotoUpdateWithoutAnalysisInput>, PhotoUncheckedUpdateWithoutAnalysisInput>
  }

  export type UserCreateNestedOneWithoutGenerationsInput = {
    create?: XOR<UserCreateWithoutGenerationsInput, UserUncheckedCreateWithoutGenerationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutGenerationsInput
    connect?: UserWhereUniqueInput
  }

  export type PhotoCreateNestedOneWithoutGenerationsInput = {
    create?: XOR<PhotoCreateWithoutGenerationsInput, PhotoUncheckedCreateWithoutGenerationsInput>
    connectOrCreate?: PhotoCreateOrConnectWithoutGenerationsInput
    connect?: PhotoWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserUpdateOneRequiredWithoutGenerationsNestedInput = {
    create?: XOR<UserCreateWithoutGenerationsInput, UserUncheckedCreateWithoutGenerationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutGenerationsInput
    upsert?: UserUpsertWithoutGenerationsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutGenerationsInput, UserUpdateWithoutGenerationsInput>, UserUncheckedUpdateWithoutGenerationsInput>
  }

  export type PhotoUpdateOneRequiredWithoutGenerationsNestedInput = {
    create?: XOR<PhotoCreateWithoutGenerationsInput, PhotoUncheckedCreateWithoutGenerationsInput>
    connectOrCreate?: PhotoCreateOrConnectWithoutGenerationsInput
    upsert?: PhotoUpsertWithoutGenerationsInput
    connect?: PhotoWhereUniqueInput
    update?: XOR<XOR<PhotoUpdateToOneWithWhereWithoutGenerationsInput, PhotoUpdateWithoutGenerationsInput>, PhotoUncheckedUpdateWithoutGenerationsInput>
  }

  export type UserCreateNestedOneWithoutSubscriptionInput = {
    create?: XOR<UserCreateWithoutSubscriptionInput, UserUncheckedCreateWithoutSubscriptionInput>
    connectOrCreate?: UserCreateOrConnectWithoutSubscriptionInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSubscriptionNestedInput = {
    create?: XOR<UserCreateWithoutSubscriptionInput, UserUncheckedCreateWithoutSubscriptionInput>
    connectOrCreate?: UserCreateOrConnectWithoutSubscriptionInput
    upsert?: UserUpsertWithoutSubscriptionInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSubscriptionInput, UserUpdateWithoutSubscriptionInput>, UserUncheckedUpdateWithoutSubscriptionInput>
  }

  export type UserCreateNestedOneWithoutQuotaInput = {
    create?: XOR<UserCreateWithoutQuotaInput, UserUncheckedCreateWithoutQuotaInput>
    connectOrCreate?: UserCreateOrConnectWithoutQuotaInput
    connect?: UserWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutQuotaNestedInput = {
    create?: XOR<UserCreateWithoutQuotaInput, UserUncheckedCreateWithoutQuotaInput>
    connectOrCreate?: UserCreateOrConnectWithoutQuotaInput
    upsert?: UserUpsertWithoutQuotaInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutQuotaInput, UserUpdateWithoutQuotaInput>, UserUncheckedUpdateWithoutQuotaInput>
  }

  export type UserCreateNestedOneWithoutConsentsInput = {
    create?: XOR<UserCreateWithoutConsentsInput, UserUncheckedCreateWithoutConsentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutConsentsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutConsentsNestedInput = {
    create?: XOR<UserCreateWithoutConsentsInput, UserUncheckedCreateWithoutConsentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutConsentsInput
    upsert?: UserUpsertWithoutConsentsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutConsentsInput, UserUpdateWithoutConsentsInput>, UserUncheckedUpdateWithoutConsentsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type PhotoCreateWithoutUserInput = {
    id?: string
    r2Key: string
    r2Url?: string | null
    width?: number | null
    height?: number | null
    faceDetected?: boolean
    createdAt?: Date | string
    generations?: GenerationCreateNestedManyWithoutPhotoInput
    analysis?: FaceAnalysisCreateNestedOneWithoutPhotoInput
  }

  export type PhotoUncheckedCreateWithoutUserInput = {
    id?: string
    r2Key: string
    r2Url?: string | null
    width?: number | null
    height?: number | null
    faceDetected?: boolean
    createdAt?: Date | string
    generations?: GenerationUncheckedCreateNestedManyWithoutPhotoInput
    analysis?: FaceAnalysisUncheckedCreateNestedOneWithoutPhotoInput
  }

  export type PhotoCreateOrConnectWithoutUserInput = {
    where: PhotoWhereUniqueInput
    create: XOR<PhotoCreateWithoutUserInput, PhotoUncheckedCreateWithoutUserInput>
  }

  export type PhotoCreateManyUserInputEnvelope = {
    data: PhotoCreateManyUserInput | PhotoCreateManyUserInput[]
  }

  export type GenerationCreateWithoutUserInput = {
    id?: string
    prompt: string
    status?: string
    replicatePredictionId?: string | null
    resultR2Key?: string | null
    resultR2Url?: string | null
    error?: string | null
    styleId?: string | null
    styleName?: string | null
    mode?: string
    batchId?: string | null
    hairColor?: string | null
    referencePhotoId?: string | null
    shareToken?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
    photo: PhotoCreateNestedOneWithoutGenerationsInput
  }

  export type GenerationUncheckedCreateWithoutUserInput = {
    id?: string
    photoId: string
    prompt: string
    status?: string
    replicatePredictionId?: string | null
    resultR2Key?: string | null
    resultR2Url?: string | null
    error?: string | null
    styleId?: string | null
    styleName?: string | null
    mode?: string
    batchId?: string | null
    hairColor?: string | null
    referencePhotoId?: string | null
    shareToken?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type GenerationCreateOrConnectWithoutUserInput = {
    where: GenerationWhereUniqueInput
    create: XOR<GenerationCreateWithoutUserInput, GenerationUncheckedCreateWithoutUserInput>
  }

  export type GenerationCreateManyUserInputEnvelope = {
    data: GenerationCreateManyUserInput | GenerationCreateManyUserInput[]
  }

  export type SubscriptionCreateWithoutUserInput = {
    id?: string
    stripeSubId?: string | null
    status?: string
    stripeCustomerId?: string | null
    currentPeriodEnd?: Date | string | null
    cancelAtPeriodEnd?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubscriptionUncheckedCreateWithoutUserInput = {
    id?: string
    stripeSubId?: string | null
    status?: string
    stripeCustomerId?: string | null
    currentPeriodEnd?: Date | string | null
    cancelAtPeriodEnd?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubscriptionCreateOrConnectWithoutUserInput = {
    where: SubscriptionWhereUniqueInput
    create: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput>
  }

  export type QuotaCreateWithoutUserInput = {
    id?: string
    freeUsedThisMonth?: number
    freeResetAt: Date | string
    paidCredits?: number
    updatedAt?: Date | string
  }

  export type QuotaUncheckedCreateWithoutUserInput = {
    id?: string
    freeUsedThisMonth?: number
    freeResetAt: Date | string
    paidCredits?: number
    updatedAt?: Date | string
  }

  export type QuotaCreateOrConnectWithoutUserInput = {
    where: QuotaWhereUniqueInput
    create: XOR<QuotaCreateWithoutUserInput, QuotaUncheckedCreateWithoutUserInput>
  }

  export type ConsentRecordCreateWithoutUserInput = {
    id?: string
    accepted: string
    policyVersion: string
    recordedAt?: Date | string
  }

  export type ConsentRecordUncheckedCreateWithoutUserInput = {
    id?: string
    accepted: string
    policyVersion: string
    recordedAt?: Date | string
  }

  export type ConsentRecordCreateOrConnectWithoutUserInput = {
    where: ConsentRecordWhereUniqueInput
    create: XOR<ConsentRecordCreateWithoutUserInput, ConsentRecordUncheckedCreateWithoutUserInput>
  }

  export type ConsentRecordCreateManyUserInputEnvelope = {
    data: ConsentRecordCreateManyUserInput | ConsentRecordCreateManyUserInput[]
  }

  export type PhotoUpsertWithWhereUniqueWithoutUserInput = {
    where: PhotoWhereUniqueInput
    update: XOR<PhotoUpdateWithoutUserInput, PhotoUncheckedUpdateWithoutUserInput>
    create: XOR<PhotoCreateWithoutUserInput, PhotoUncheckedCreateWithoutUserInput>
  }

  export type PhotoUpdateWithWhereUniqueWithoutUserInput = {
    where: PhotoWhereUniqueInput
    data: XOR<PhotoUpdateWithoutUserInput, PhotoUncheckedUpdateWithoutUserInput>
  }

  export type PhotoUpdateManyWithWhereWithoutUserInput = {
    where: PhotoScalarWhereInput
    data: XOR<PhotoUpdateManyMutationInput, PhotoUncheckedUpdateManyWithoutUserInput>
  }

  export type PhotoScalarWhereInput = {
    AND?: PhotoScalarWhereInput | PhotoScalarWhereInput[]
    OR?: PhotoScalarWhereInput[]
    NOT?: PhotoScalarWhereInput | PhotoScalarWhereInput[]
    id?: StringFilter<"Photo"> | string
    userId?: StringFilter<"Photo"> | string
    r2Key?: StringFilter<"Photo"> | string
    r2Url?: StringNullableFilter<"Photo"> | string | null
    width?: IntNullableFilter<"Photo"> | number | null
    height?: IntNullableFilter<"Photo"> | number | null
    faceDetected?: BoolFilter<"Photo"> | boolean
    createdAt?: DateTimeFilter<"Photo"> | Date | string
  }

  export type GenerationUpsertWithWhereUniqueWithoutUserInput = {
    where: GenerationWhereUniqueInput
    update: XOR<GenerationUpdateWithoutUserInput, GenerationUncheckedUpdateWithoutUserInput>
    create: XOR<GenerationCreateWithoutUserInput, GenerationUncheckedCreateWithoutUserInput>
  }

  export type GenerationUpdateWithWhereUniqueWithoutUserInput = {
    where: GenerationWhereUniqueInput
    data: XOR<GenerationUpdateWithoutUserInput, GenerationUncheckedUpdateWithoutUserInput>
  }

  export type GenerationUpdateManyWithWhereWithoutUserInput = {
    where: GenerationScalarWhereInput
    data: XOR<GenerationUpdateManyMutationInput, GenerationUncheckedUpdateManyWithoutUserInput>
  }

  export type GenerationScalarWhereInput = {
    AND?: GenerationScalarWhereInput | GenerationScalarWhereInput[]
    OR?: GenerationScalarWhereInput[]
    NOT?: GenerationScalarWhereInput | GenerationScalarWhereInput[]
    id?: StringFilter<"Generation"> | string
    userId?: StringFilter<"Generation"> | string
    photoId?: StringFilter<"Generation"> | string
    prompt?: StringFilter<"Generation"> | string
    status?: StringFilter<"Generation"> | string
    replicatePredictionId?: StringNullableFilter<"Generation"> | string | null
    resultR2Key?: StringNullableFilter<"Generation"> | string | null
    resultR2Url?: StringNullableFilter<"Generation"> | string | null
    error?: StringNullableFilter<"Generation"> | string | null
    styleId?: StringNullableFilter<"Generation"> | string | null
    styleName?: StringNullableFilter<"Generation"> | string | null
    mode?: StringFilter<"Generation"> | string
    batchId?: StringNullableFilter<"Generation"> | string | null
    hairColor?: StringNullableFilter<"Generation"> | string | null
    referencePhotoId?: StringNullableFilter<"Generation"> | string | null
    shareToken?: StringNullableFilter<"Generation"> | string | null
    createdAt?: DateTimeFilter<"Generation"> | Date | string
    completedAt?: DateTimeNullableFilter<"Generation"> | Date | string | null
  }

  export type SubscriptionUpsertWithoutUserInput = {
    update: XOR<SubscriptionUpdateWithoutUserInput, SubscriptionUncheckedUpdateWithoutUserInput>
    create: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput>
    where?: SubscriptionWhereInput
  }

  export type SubscriptionUpdateToOneWithWhereWithoutUserInput = {
    where?: SubscriptionWhereInput
    data: XOR<SubscriptionUpdateWithoutUserInput, SubscriptionUncheckedUpdateWithoutUserInput>
  }

  export type SubscriptionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripeSubId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripeSubId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuotaUpsertWithoutUserInput = {
    update: XOR<QuotaUpdateWithoutUserInput, QuotaUncheckedUpdateWithoutUserInput>
    create: XOR<QuotaCreateWithoutUserInput, QuotaUncheckedCreateWithoutUserInput>
    where?: QuotaWhereInput
  }

  export type QuotaUpdateToOneWithWhereWithoutUserInput = {
    where?: QuotaWhereInput
    data: XOR<QuotaUpdateWithoutUserInput, QuotaUncheckedUpdateWithoutUserInput>
  }

  export type QuotaUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    freeUsedThisMonth?: IntFieldUpdateOperationsInput | number
    freeResetAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paidCredits?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuotaUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    freeUsedThisMonth?: IntFieldUpdateOperationsInput | number
    freeResetAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paidCredits?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConsentRecordUpsertWithWhereUniqueWithoutUserInput = {
    where: ConsentRecordWhereUniqueInput
    update: XOR<ConsentRecordUpdateWithoutUserInput, ConsentRecordUncheckedUpdateWithoutUserInput>
    create: XOR<ConsentRecordCreateWithoutUserInput, ConsentRecordUncheckedCreateWithoutUserInput>
  }

  export type ConsentRecordUpdateWithWhereUniqueWithoutUserInput = {
    where: ConsentRecordWhereUniqueInput
    data: XOR<ConsentRecordUpdateWithoutUserInput, ConsentRecordUncheckedUpdateWithoutUserInput>
  }

  export type ConsentRecordUpdateManyWithWhereWithoutUserInput = {
    where: ConsentRecordScalarWhereInput
    data: XOR<ConsentRecordUpdateManyMutationInput, ConsentRecordUncheckedUpdateManyWithoutUserInput>
  }

  export type ConsentRecordScalarWhereInput = {
    AND?: ConsentRecordScalarWhereInput | ConsentRecordScalarWhereInput[]
    OR?: ConsentRecordScalarWhereInput[]
    NOT?: ConsentRecordScalarWhereInput | ConsentRecordScalarWhereInput[]
    id?: StringFilter<"ConsentRecord"> | string
    userId?: StringFilter<"ConsentRecord"> | string
    accepted?: StringFilter<"ConsentRecord"> | string
    policyVersion?: StringFilter<"ConsentRecord"> | string
    recordedAt?: DateTimeFilter<"ConsentRecord"> | Date | string
  }

  export type UserCreateWithoutPhotosInput = {
    id?: string
    email: string
    passwordHash?: string | null
    name?: string | null
    avatarUrl?: string | null
    oauthProvider?: string | null
    oauthUserId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    generations?: GenerationCreateNestedManyWithoutUserInput
    subscription?: SubscriptionCreateNestedOneWithoutUserInput
    quota?: QuotaCreateNestedOneWithoutUserInput
    consents?: ConsentRecordCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPhotosInput = {
    id?: string
    email: string
    passwordHash?: string | null
    name?: string | null
    avatarUrl?: string | null
    oauthProvider?: string | null
    oauthUserId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    generations?: GenerationUncheckedCreateNestedManyWithoutUserInput
    subscription?: SubscriptionUncheckedCreateNestedOneWithoutUserInput
    quota?: QuotaUncheckedCreateNestedOneWithoutUserInput
    consents?: ConsentRecordUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPhotosInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPhotosInput, UserUncheckedCreateWithoutPhotosInput>
  }

  export type GenerationCreateWithoutPhotoInput = {
    id?: string
    prompt: string
    status?: string
    replicatePredictionId?: string | null
    resultR2Key?: string | null
    resultR2Url?: string | null
    error?: string | null
    styleId?: string | null
    styleName?: string | null
    mode?: string
    batchId?: string | null
    hairColor?: string | null
    referencePhotoId?: string | null
    shareToken?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
    user: UserCreateNestedOneWithoutGenerationsInput
  }

  export type GenerationUncheckedCreateWithoutPhotoInput = {
    id?: string
    userId: string
    prompt: string
    status?: string
    replicatePredictionId?: string | null
    resultR2Key?: string | null
    resultR2Url?: string | null
    error?: string | null
    styleId?: string | null
    styleName?: string | null
    mode?: string
    batchId?: string | null
    hairColor?: string | null
    referencePhotoId?: string | null
    shareToken?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type GenerationCreateOrConnectWithoutPhotoInput = {
    where: GenerationWhereUniqueInput
    create: XOR<GenerationCreateWithoutPhotoInput, GenerationUncheckedCreateWithoutPhotoInput>
  }

  export type GenerationCreateManyPhotoInputEnvelope = {
    data: GenerationCreateManyPhotoInput | GenerationCreateManyPhotoInput[]
  }

  export type FaceAnalysisCreateWithoutPhotoInput = {
    id?: string
    faceShape: string
    hairLength: string
    hairTexture: string
    hairDensity: string
    forehead: string
    jawline: string
    provider?: string
    createdAt?: Date | string
  }

  export type FaceAnalysisUncheckedCreateWithoutPhotoInput = {
    id?: string
    faceShape: string
    hairLength: string
    hairTexture: string
    hairDensity: string
    forehead: string
    jawline: string
    provider?: string
    createdAt?: Date | string
  }

  export type FaceAnalysisCreateOrConnectWithoutPhotoInput = {
    where: FaceAnalysisWhereUniqueInput
    create: XOR<FaceAnalysisCreateWithoutPhotoInput, FaceAnalysisUncheckedCreateWithoutPhotoInput>
  }

  export type UserUpsertWithoutPhotosInput = {
    update: XOR<UserUpdateWithoutPhotosInput, UserUncheckedUpdateWithoutPhotosInput>
    create: XOR<UserCreateWithoutPhotosInput, UserUncheckedCreateWithoutPhotosInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPhotosInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPhotosInput, UserUncheckedUpdateWithoutPhotosInput>
  }

  export type UserUpdateWithoutPhotosInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    oauthProvider?: NullableStringFieldUpdateOperationsInput | string | null
    oauthUserId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    generations?: GenerationUpdateManyWithoutUserNestedInput
    subscription?: SubscriptionUpdateOneWithoutUserNestedInput
    quota?: QuotaUpdateOneWithoutUserNestedInput
    consents?: ConsentRecordUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPhotosInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    oauthProvider?: NullableStringFieldUpdateOperationsInput | string | null
    oauthUserId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    generations?: GenerationUncheckedUpdateManyWithoutUserNestedInput
    subscription?: SubscriptionUncheckedUpdateOneWithoutUserNestedInput
    quota?: QuotaUncheckedUpdateOneWithoutUserNestedInput
    consents?: ConsentRecordUncheckedUpdateManyWithoutUserNestedInput
  }

  export type GenerationUpsertWithWhereUniqueWithoutPhotoInput = {
    where: GenerationWhereUniqueInput
    update: XOR<GenerationUpdateWithoutPhotoInput, GenerationUncheckedUpdateWithoutPhotoInput>
    create: XOR<GenerationCreateWithoutPhotoInput, GenerationUncheckedCreateWithoutPhotoInput>
  }

  export type GenerationUpdateWithWhereUniqueWithoutPhotoInput = {
    where: GenerationWhereUniqueInput
    data: XOR<GenerationUpdateWithoutPhotoInput, GenerationUncheckedUpdateWithoutPhotoInput>
  }

  export type GenerationUpdateManyWithWhereWithoutPhotoInput = {
    where: GenerationScalarWhereInput
    data: XOR<GenerationUpdateManyMutationInput, GenerationUncheckedUpdateManyWithoutPhotoInput>
  }

  export type FaceAnalysisUpsertWithoutPhotoInput = {
    update: XOR<FaceAnalysisUpdateWithoutPhotoInput, FaceAnalysisUncheckedUpdateWithoutPhotoInput>
    create: XOR<FaceAnalysisCreateWithoutPhotoInput, FaceAnalysisUncheckedCreateWithoutPhotoInput>
    where?: FaceAnalysisWhereInput
  }

  export type FaceAnalysisUpdateToOneWithWhereWithoutPhotoInput = {
    where?: FaceAnalysisWhereInput
    data: XOR<FaceAnalysisUpdateWithoutPhotoInput, FaceAnalysisUncheckedUpdateWithoutPhotoInput>
  }

  export type FaceAnalysisUpdateWithoutPhotoInput = {
    id?: StringFieldUpdateOperationsInput | string
    faceShape?: StringFieldUpdateOperationsInput | string
    hairLength?: StringFieldUpdateOperationsInput | string
    hairTexture?: StringFieldUpdateOperationsInput | string
    hairDensity?: StringFieldUpdateOperationsInput | string
    forehead?: StringFieldUpdateOperationsInput | string
    jawline?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FaceAnalysisUncheckedUpdateWithoutPhotoInput = {
    id?: StringFieldUpdateOperationsInput | string
    faceShape?: StringFieldUpdateOperationsInput | string
    hairLength?: StringFieldUpdateOperationsInput | string
    hairTexture?: StringFieldUpdateOperationsInput | string
    hairDensity?: StringFieldUpdateOperationsInput | string
    forehead?: StringFieldUpdateOperationsInput | string
    jawline?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PhotoCreateWithoutAnalysisInput = {
    id?: string
    r2Key: string
    r2Url?: string | null
    width?: number | null
    height?: number | null
    faceDetected?: boolean
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutPhotosInput
    generations?: GenerationCreateNestedManyWithoutPhotoInput
  }

  export type PhotoUncheckedCreateWithoutAnalysisInput = {
    id?: string
    userId: string
    r2Key: string
    r2Url?: string | null
    width?: number | null
    height?: number | null
    faceDetected?: boolean
    createdAt?: Date | string
    generations?: GenerationUncheckedCreateNestedManyWithoutPhotoInput
  }

  export type PhotoCreateOrConnectWithoutAnalysisInput = {
    where: PhotoWhereUniqueInput
    create: XOR<PhotoCreateWithoutAnalysisInput, PhotoUncheckedCreateWithoutAnalysisInput>
  }

  export type PhotoUpsertWithoutAnalysisInput = {
    update: XOR<PhotoUpdateWithoutAnalysisInput, PhotoUncheckedUpdateWithoutAnalysisInput>
    create: XOR<PhotoCreateWithoutAnalysisInput, PhotoUncheckedCreateWithoutAnalysisInput>
    where?: PhotoWhereInput
  }

  export type PhotoUpdateToOneWithWhereWithoutAnalysisInput = {
    where?: PhotoWhereInput
    data: XOR<PhotoUpdateWithoutAnalysisInput, PhotoUncheckedUpdateWithoutAnalysisInput>
  }

  export type PhotoUpdateWithoutAnalysisInput = {
    id?: StringFieldUpdateOperationsInput | string
    r2Key?: StringFieldUpdateOperationsInput | string
    r2Url?: NullableStringFieldUpdateOperationsInput | string | null
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    faceDetected?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPhotosNestedInput
    generations?: GenerationUpdateManyWithoutPhotoNestedInput
  }

  export type PhotoUncheckedUpdateWithoutAnalysisInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    r2Key?: StringFieldUpdateOperationsInput | string
    r2Url?: NullableStringFieldUpdateOperationsInput | string | null
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    faceDetected?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    generations?: GenerationUncheckedUpdateManyWithoutPhotoNestedInput
  }

  export type UserCreateWithoutGenerationsInput = {
    id?: string
    email: string
    passwordHash?: string | null
    name?: string | null
    avatarUrl?: string | null
    oauthProvider?: string | null
    oauthUserId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    photos?: PhotoCreateNestedManyWithoutUserInput
    subscription?: SubscriptionCreateNestedOneWithoutUserInput
    quota?: QuotaCreateNestedOneWithoutUserInput
    consents?: ConsentRecordCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutGenerationsInput = {
    id?: string
    email: string
    passwordHash?: string | null
    name?: string | null
    avatarUrl?: string | null
    oauthProvider?: string | null
    oauthUserId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    photos?: PhotoUncheckedCreateNestedManyWithoutUserInput
    subscription?: SubscriptionUncheckedCreateNestedOneWithoutUserInput
    quota?: QuotaUncheckedCreateNestedOneWithoutUserInput
    consents?: ConsentRecordUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutGenerationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutGenerationsInput, UserUncheckedCreateWithoutGenerationsInput>
  }

  export type PhotoCreateWithoutGenerationsInput = {
    id?: string
    r2Key: string
    r2Url?: string | null
    width?: number | null
    height?: number | null
    faceDetected?: boolean
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutPhotosInput
    analysis?: FaceAnalysisCreateNestedOneWithoutPhotoInput
  }

  export type PhotoUncheckedCreateWithoutGenerationsInput = {
    id?: string
    userId: string
    r2Key: string
    r2Url?: string | null
    width?: number | null
    height?: number | null
    faceDetected?: boolean
    createdAt?: Date | string
    analysis?: FaceAnalysisUncheckedCreateNestedOneWithoutPhotoInput
  }

  export type PhotoCreateOrConnectWithoutGenerationsInput = {
    where: PhotoWhereUniqueInput
    create: XOR<PhotoCreateWithoutGenerationsInput, PhotoUncheckedCreateWithoutGenerationsInput>
  }

  export type UserUpsertWithoutGenerationsInput = {
    update: XOR<UserUpdateWithoutGenerationsInput, UserUncheckedUpdateWithoutGenerationsInput>
    create: XOR<UserCreateWithoutGenerationsInput, UserUncheckedCreateWithoutGenerationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutGenerationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutGenerationsInput, UserUncheckedUpdateWithoutGenerationsInput>
  }

  export type UserUpdateWithoutGenerationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    oauthProvider?: NullableStringFieldUpdateOperationsInput | string | null
    oauthUserId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: PhotoUpdateManyWithoutUserNestedInput
    subscription?: SubscriptionUpdateOneWithoutUserNestedInput
    quota?: QuotaUpdateOneWithoutUserNestedInput
    consents?: ConsentRecordUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutGenerationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    oauthProvider?: NullableStringFieldUpdateOperationsInput | string | null
    oauthUserId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: PhotoUncheckedUpdateManyWithoutUserNestedInput
    subscription?: SubscriptionUncheckedUpdateOneWithoutUserNestedInput
    quota?: QuotaUncheckedUpdateOneWithoutUserNestedInput
    consents?: ConsentRecordUncheckedUpdateManyWithoutUserNestedInput
  }

  export type PhotoUpsertWithoutGenerationsInput = {
    update: XOR<PhotoUpdateWithoutGenerationsInput, PhotoUncheckedUpdateWithoutGenerationsInput>
    create: XOR<PhotoCreateWithoutGenerationsInput, PhotoUncheckedCreateWithoutGenerationsInput>
    where?: PhotoWhereInput
  }

  export type PhotoUpdateToOneWithWhereWithoutGenerationsInput = {
    where?: PhotoWhereInput
    data: XOR<PhotoUpdateWithoutGenerationsInput, PhotoUncheckedUpdateWithoutGenerationsInput>
  }

  export type PhotoUpdateWithoutGenerationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    r2Key?: StringFieldUpdateOperationsInput | string
    r2Url?: NullableStringFieldUpdateOperationsInput | string | null
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    faceDetected?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPhotosNestedInput
    analysis?: FaceAnalysisUpdateOneWithoutPhotoNestedInput
  }

  export type PhotoUncheckedUpdateWithoutGenerationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    r2Key?: StringFieldUpdateOperationsInput | string
    r2Url?: NullableStringFieldUpdateOperationsInput | string | null
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    faceDetected?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    analysis?: FaceAnalysisUncheckedUpdateOneWithoutPhotoNestedInput
  }

  export type UserCreateWithoutSubscriptionInput = {
    id?: string
    email: string
    passwordHash?: string | null
    name?: string | null
    avatarUrl?: string | null
    oauthProvider?: string | null
    oauthUserId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    photos?: PhotoCreateNestedManyWithoutUserInput
    generations?: GenerationCreateNestedManyWithoutUserInput
    quota?: QuotaCreateNestedOneWithoutUserInput
    consents?: ConsentRecordCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSubscriptionInput = {
    id?: string
    email: string
    passwordHash?: string | null
    name?: string | null
    avatarUrl?: string | null
    oauthProvider?: string | null
    oauthUserId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    photos?: PhotoUncheckedCreateNestedManyWithoutUserInput
    generations?: GenerationUncheckedCreateNestedManyWithoutUserInput
    quota?: QuotaUncheckedCreateNestedOneWithoutUserInput
    consents?: ConsentRecordUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSubscriptionInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSubscriptionInput, UserUncheckedCreateWithoutSubscriptionInput>
  }

  export type UserUpsertWithoutSubscriptionInput = {
    update: XOR<UserUpdateWithoutSubscriptionInput, UserUncheckedUpdateWithoutSubscriptionInput>
    create: XOR<UserCreateWithoutSubscriptionInput, UserUncheckedCreateWithoutSubscriptionInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSubscriptionInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSubscriptionInput, UserUncheckedUpdateWithoutSubscriptionInput>
  }

  export type UserUpdateWithoutSubscriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    oauthProvider?: NullableStringFieldUpdateOperationsInput | string | null
    oauthUserId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: PhotoUpdateManyWithoutUserNestedInput
    generations?: GenerationUpdateManyWithoutUserNestedInput
    quota?: QuotaUpdateOneWithoutUserNestedInput
    consents?: ConsentRecordUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSubscriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    oauthProvider?: NullableStringFieldUpdateOperationsInput | string | null
    oauthUserId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: PhotoUncheckedUpdateManyWithoutUserNestedInput
    generations?: GenerationUncheckedUpdateManyWithoutUserNestedInput
    quota?: QuotaUncheckedUpdateOneWithoutUserNestedInput
    consents?: ConsentRecordUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutQuotaInput = {
    id?: string
    email: string
    passwordHash?: string | null
    name?: string | null
    avatarUrl?: string | null
    oauthProvider?: string | null
    oauthUserId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    photos?: PhotoCreateNestedManyWithoutUserInput
    generations?: GenerationCreateNestedManyWithoutUserInput
    subscription?: SubscriptionCreateNestedOneWithoutUserInput
    consents?: ConsentRecordCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutQuotaInput = {
    id?: string
    email: string
    passwordHash?: string | null
    name?: string | null
    avatarUrl?: string | null
    oauthProvider?: string | null
    oauthUserId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    photos?: PhotoUncheckedCreateNestedManyWithoutUserInput
    generations?: GenerationUncheckedCreateNestedManyWithoutUserInput
    subscription?: SubscriptionUncheckedCreateNestedOneWithoutUserInput
    consents?: ConsentRecordUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutQuotaInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutQuotaInput, UserUncheckedCreateWithoutQuotaInput>
  }

  export type UserUpsertWithoutQuotaInput = {
    update: XOR<UserUpdateWithoutQuotaInput, UserUncheckedUpdateWithoutQuotaInput>
    create: XOR<UserCreateWithoutQuotaInput, UserUncheckedCreateWithoutQuotaInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutQuotaInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutQuotaInput, UserUncheckedUpdateWithoutQuotaInput>
  }

  export type UserUpdateWithoutQuotaInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    oauthProvider?: NullableStringFieldUpdateOperationsInput | string | null
    oauthUserId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: PhotoUpdateManyWithoutUserNestedInput
    generations?: GenerationUpdateManyWithoutUserNestedInput
    subscription?: SubscriptionUpdateOneWithoutUserNestedInput
    consents?: ConsentRecordUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutQuotaInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    oauthProvider?: NullableStringFieldUpdateOperationsInput | string | null
    oauthUserId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: PhotoUncheckedUpdateManyWithoutUserNestedInput
    generations?: GenerationUncheckedUpdateManyWithoutUserNestedInput
    subscription?: SubscriptionUncheckedUpdateOneWithoutUserNestedInput
    consents?: ConsentRecordUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutConsentsInput = {
    id?: string
    email: string
    passwordHash?: string | null
    name?: string | null
    avatarUrl?: string | null
    oauthProvider?: string | null
    oauthUserId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    photos?: PhotoCreateNestedManyWithoutUserInput
    generations?: GenerationCreateNestedManyWithoutUserInput
    subscription?: SubscriptionCreateNestedOneWithoutUserInput
    quota?: QuotaCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutConsentsInput = {
    id?: string
    email: string
    passwordHash?: string | null
    name?: string | null
    avatarUrl?: string | null
    oauthProvider?: string | null
    oauthUserId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    photos?: PhotoUncheckedCreateNestedManyWithoutUserInput
    generations?: GenerationUncheckedCreateNestedManyWithoutUserInput
    subscription?: SubscriptionUncheckedCreateNestedOneWithoutUserInput
    quota?: QuotaUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutConsentsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutConsentsInput, UserUncheckedCreateWithoutConsentsInput>
  }

  export type UserUpsertWithoutConsentsInput = {
    update: XOR<UserUpdateWithoutConsentsInput, UserUncheckedUpdateWithoutConsentsInput>
    create: XOR<UserCreateWithoutConsentsInput, UserUncheckedCreateWithoutConsentsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutConsentsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutConsentsInput, UserUncheckedUpdateWithoutConsentsInput>
  }

  export type UserUpdateWithoutConsentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    oauthProvider?: NullableStringFieldUpdateOperationsInput | string | null
    oauthUserId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: PhotoUpdateManyWithoutUserNestedInput
    generations?: GenerationUpdateManyWithoutUserNestedInput
    subscription?: SubscriptionUpdateOneWithoutUserNestedInput
    quota?: QuotaUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutConsentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    oauthProvider?: NullableStringFieldUpdateOperationsInput | string | null
    oauthUserId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: PhotoUncheckedUpdateManyWithoutUserNestedInput
    generations?: GenerationUncheckedUpdateManyWithoutUserNestedInput
    subscription?: SubscriptionUncheckedUpdateOneWithoutUserNestedInput
    quota?: QuotaUncheckedUpdateOneWithoutUserNestedInput
  }

  export type PhotoCreateManyUserInput = {
    id?: string
    r2Key: string
    r2Url?: string | null
    width?: number | null
    height?: number | null
    faceDetected?: boolean
    createdAt?: Date | string
  }

  export type GenerationCreateManyUserInput = {
    id?: string
    photoId: string
    prompt: string
    status?: string
    replicatePredictionId?: string | null
    resultR2Key?: string | null
    resultR2Url?: string | null
    error?: string | null
    styleId?: string | null
    styleName?: string | null
    mode?: string
    batchId?: string | null
    hairColor?: string | null
    referencePhotoId?: string | null
    shareToken?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type ConsentRecordCreateManyUserInput = {
    id?: string
    accepted: string
    policyVersion: string
    recordedAt?: Date | string
  }

  export type PhotoUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    r2Key?: StringFieldUpdateOperationsInput | string
    r2Url?: NullableStringFieldUpdateOperationsInput | string | null
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    faceDetected?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    generations?: GenerationUpdateManyWithoutPhotoNestedInput
    analysis?: FaceAnalysisUpdateOneWithoutPhotoNestedInput
  }

  export type PhotoUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    r2Key?: StringFieldUpdateOperationsInput | string
    r2Url?: NullableStringFieldUpdateOperationsInput | string | null
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    faceDetected?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    generations?: GenerationUncheckedUpdateManyWithoutPhotoNestedInput
    analysis?: FaceAnalysisUncheckedUpdateOneWithoutPhotoNestedInput
  }

  export type PhotoUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    r2Key?: StringFieldUpdateOperationsInput | string
    r2Url?: NullableStringFieldUpdateOperationsInput | string | null
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    faceDetected?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GenerationUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    prompt?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    replicatePredictionId?: NullableStringFieldUpdateOperationsInput | string | null
    resultR2Key?: NullableStringFieldUpdateOperationsInput | string | null
    resultR2Url?: NullableStringFieldUpdateOperationsInput | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    styleId?: NullableStringFieldUpdateOperationsInput | string | null
    styleName?: NullableStringFieldUpdateOperationsInput | string | null
    mode?: StringFieldUpdateOperationsInput | string
    batchId?: NullableStringFieldUpdateOperationsInput | string | null
    hairColor?: NullableStringFieldUpdateOperationsInput | string | null
    referencePhotoId?: NullableStringFieldUpdateOperationsInput | string | null
    shareToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    photo?: PhotoUpdateOneRequiredWithoutGenerationsNestedInput
  }

  export type GenerationUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    photoId?: StringFieldUpdateOperationsInput | string
    prompt?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    replicatePredictionId?: NullableStringFieldUpdateOperationsInput | string | null
    resultR2Key?: NullableStringFieldUpdateOperationsInput | string | null
    resultR2Url?: NullableStringFieldUpdateOperationsInput | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    styleId?: NullableStringFieldUpdateOperationsInput | string | null
    styleName?: NullableStringFieldUpdateOperationsInput | string | null
    mode?: StringFieldUpdateOperationsInput | string
    batchId?: NullableStringFieldUpdateOperationsInput | string | null
    hairColor?: NullableStringFieldUpdateOperationsInput | string | null
    referencePhotoId?: NullableStringFieldUpdateOperationsInput | string | null
    shareToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GenerationUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    photoId?: StringFieldUpdateOperationsInput | string
    prompt?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    replicatePredictionId?: NullableStringFieldUpdateOperationsInput | string | null
    resultR2Key?: NullableStringFieldUpdateOperationsInput | string | null
    resultR2Url?: NullableStringFieldUpdateOperationsInput | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    styleId?: NullableStringFieldUpdateOperationsInput | string | null
    styleName?: NullableStringFieldUpdateOperationsInput | string | null
    mode?: StringFieldUpdateOperationsInput | string
    batchId?: NullableStringFieldUpdateOperationsInput | string | null
    hairColor?: NullableStringFieldUpdateOperationsInput | string | null
    referencePhotoId?: NullableStringFieldUpdateOperationsInput | string | null
    shareToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ConsentRecordUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    accepted?: StringFieldUpdateOperationsInput | string
    policyVersion?: StringFieldUpdateOperationsInput | string
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConsentRecordUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    accepted?: StringFieldUpdateOperationsInput | string
    policyVersion?: StringFieldUpdateOperationsInput | string
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConsentRecordUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    accepted?: StringFieldUpdateOperationsInput | string
    policyVersion?: StringFieldUpdateOperationsInput | string
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GenerationCreateManyPhotoInput = {
    id?: string
    userId: string
    prompt: string
    status?: string
    replicatePredictionId?: string | null
    resultR2Key?: string | null
    resultR2Url?: string | null
    error?: string | null
    styleId?: string | null
    styleName?: string | null
    mode?: string
    batchId?: string | null
    hairColor?: string | null
    referencePhotoId?: string | null
    shareToken?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type GenerationUpdateWithoutPhotoInput = {
    id?: StringFieldUpdateOperationsInput | string
    prompt?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    replicatePredictionId?: NullableStringFieldUpdateOperationsInput | string | null
    resultR2Key?: NullableStringFieldUpdateOperationsInput | string | null
    resultR2Url?: NullableStringFieldUpdateOperationsInput | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    styleId?: NullableStringFieldUpdateOperationsInput | string | null
    styleName?: NullableStringFieldUpdateOperationsInput | string | null
    mode?: StringFieldUpdateOperationsInput | string
    batchId?: NullableStringFieldUpdateOperationsInput | string | null
    hairColor?: NullableStringFieldUpdateOperationsInput | string | null
    referencePhotoId?: NullableStringFieldUpdateOperationsInput | string | null
    shareToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutGenerationsNestedInput
  }

  export type GenerationUncheckedUpdateWithoutPhotoInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    prompt?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    replicatePredictionId?: NullableStringFieldUpdateOperationsInput | string | null
    resultR2Key?: NullableStringFieldUpdateOperationsInput | string | null
    resultR2Url?: NullableStringFieldUpdateOperationsInput | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    styleId?: NullableStringFieldUpdateOperationsInput | string | null
    styleName?: NullableStringFieldUpdateOperationsInput | string | null
    mode?: StringFieldUpdateOperationsInput | string
    batchId?: NullableStringFieldUpdateOperationsInput | string | null
    hairColor?: NullableStringFieldUpdateOperationsInput | string | null
    referencePhotoId?: NullableStringFieldUpdateOperationsInput | string | null
    shareToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GenerationUncheckedUpdateManyWithoutPhotoInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    prompt?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    replicatePredictionId?: NullableStringFieldUpdateOperationsInput | string | null
    resultR2Key?: NullableStringFieldUpdateOperationsInput | string | null
    resultR2Url?: NullableStringFieldUpdateOperationsInput | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    styleId?: NullableStringFieldUpdateOperationsInput | string | null
    styleName?: NullableStringFieldUpdateOperationsInput | string | null
    mode?: StringFieldUpdateOperationsInput | string
    batchId?: NullableStringFieldUpdateOperationsInput | string | null
    hairColor?: NullableStringFieldUpdateOperationsInput | string | null
    referencePhotoId?: NullableStringFieldUpdateOperationsInput | string | null
    shareToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PhotoCountOutputTypeDefaultArgs instead
     */
    export type PhotoCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PhotoCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PhotoDefaultArgs instead
     */
    export type PhotoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PhotoDefaultArgs<ExtArgs>
    /**
     * @deprecated Use FaceAnalysisDefaultArgs instead
     */
    export type FaceAnalysisArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = FaceAnalysisDefaultArgs<ExtArgs>
    /**
     * @deprecated Use GenerationDefaultArgs instead
     */
    export type GenerationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = GenerationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SubscriptionDefaultArgs instead
     */
    export type SubscriptionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SubscriptionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use QuotaDefaultArgs instead
     */
    export type QuotaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = QuotaDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ConsentRecordDefaultArgs instead
     */
    export type ConsentRecordArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ConsentRecordDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DsrRequestDefaultArgs instead
     */
    export type DsrRequestArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DsrRequestDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PaddleEventDefaultArgs instead
     */
    export type PaddleEventArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PaddleEventDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}