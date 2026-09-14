
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
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

exports.Prisma.PhotoScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  r2Key: 'r2Key',
  r2Url: 'r2Url',
  width: 'width',
  height: 'height',
  faceDetected: 'faceDetected',
  createdAt: 'createdAt'
};

exports.Prisma.FaceAnalysisScalarFieldEnum = {
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

exports.Prisma.GenerationScalarFieldEnum = {
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

exports.Prisma.SubscriptionScalarFieldEnum = {
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

exports.Prisma.QuotaScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  freeUsedThisMonth: 'freeUsedThisMonth',
  freeResetAt: 'freeResetAt',
  paidCredits: 'paidCredits',
  updatedAt: 'updatedAt'
};

exports.Prisma.ConsentRecordScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  accepted: 'accepted',
  policyVersion: 'policyVersion',
  recordedAt: 'recordedAt'
};

exports.Prisma.DsrRequestScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  status: 'status',
  reason: 'reason',
  createdAt: 'createdAt',
  completedAt: 'completedAt'
};

exports.Prisma.PaddleEventScalarFieldEnum = {
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

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
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

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
