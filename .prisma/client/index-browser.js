
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('@prisma/client/runtime/index-browser.js')


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
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  emailVerified: 'emailVerified',
  image: 'image',
  bio: 'bio',
  title: 'title',
  skills: 'skills',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AccountScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  type: 'type',
  provider: 'provider',
  providerAccountId: 'providerAccountId',
  refresh_token: 'refresh_token',
  access_token: 'access_token',
  expires_at: 'expires_at',
  token_type: 'token_type',
  scope: 'scope',
  id_token: 'id_token',
  session_state: 'session_state'
};

exports.Prisma.SessionScalarFieldEnum = {
  id: 'id',
  sessionToken: 'sessionToken',
  userId: 'userId',
  expires: 'expires'
};

exports.Prisma.CompanyScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  logo: 'logo',
  website: 'website',
  industry: 'industry',
  size: 'size',
  location: 'location',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.JobDescriptionScalarFieldEnum = {
  id: 'id',
  companyId: 'companyId',
  title: 'title',
  description: 'description',
  isPublic: 'isPublic',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SkillScalarFieldEnum = {
  id: 'id',
  jdId: 'jdId',
  name: 'name',
  level: 'level',
  description: 'description',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BehaviorScalarFieldEnum = {
  id: 'id',
  jdId: 'jdId',
  title: 'title',
  description: 'description',
  importance: 'importance',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CertificationScalarFieldEnum = {
  id: 'id',
  jdId: 'jdId',
  name: 'name',
  issuer: 'issuer',
  description: 'description',
  url: 'url',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DocumentScalarFieldEnum = {
  id: 'id',
  jdId: 'jdId',
  title: 'title',
  description: 'description',
  fileUrl: 'fileUrl',
  fileType: 'fileType',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ExternalLinkScalarFieldEnum = {
  id: 'id',
  jdId: 'jdId',
  title: 'title',
  url: 'url',
  description: 'description',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.RuleScalarFieldEnum = {
  id: 'id',
  jdId: 'jdId',
  title: 'title',
  description: 'description',
  category: 'category',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.VerificationSubmissionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  jdId: 'jdId',
  status: 'status',
  submittedAt: 'submittedAt',
  reviewedAt: 'reviewedAt',
  reviewedBy: 'reviewedBy',
  notes: 'notes'
};

exports.Prisma.ProofScalarFieldEnum = {
  id: 'id',
  verificationSubmissionId: 'verificationSubmissionId',
  type: 'type',
  title: 'title',
  description: 'description',
  fileUrl: 'fileUrl',
  linkUrl: 'linkUrl',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BadgeScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  companyId: 'companyId',
  jdId: 'jdId',
  name: 'name',
  description: 'description',
  imageUrl: 'imageUrl',
  issuedAt: 'issuedAt',
  expiresAt: 'expiresAt'
};

exports.Prisma.CourseScalarFieldEnum = {
  id: 'id',
  companyId: 'companyId',
  title: 'title',
  description: 'description',
  price: 'price',
  isFree: 'isFree',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ModuleScalarFieldEnum = {
  id: 'id',
  courseId: 'courseId',
  title: 'title',
  description: 'description',
  order: 'order',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.LessonScalarFieldEnum = {
  id: 'id',
  moduleId: 'moduleId',
  title: 'title',
  content: 'content',
  videoUrl: 'videoUrl',
  order: 'order',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CourseToJDScalarFieldEnum = {
  courseId: 'courseId',
  jdId: 'jdId'
};

exports.Prisma.CourseEnrollmentScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  courseId: 'courseId',
  progress: 'progress',
  startedAt: 'startedAt',
  completedAt: 'completedAt'
};

exports.Prisma.StoreScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  name: 'name',
  domain: 'domain',
  components: 'components',
  theme: 'theme',
  seo: 'seo',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PostScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  content: 'content',
  createdAt: 'createdAt',
  likes: 'likes',
  comments: 'comments'
};

exports.Prisma.PostLikeScalarFieldEnum = {
  id: 'id',
  postId: 'postId',
  userId: 'userId',
  createdAt: 'createdAt'
};

exports.Prisma.ProfileScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  bio: 'bio',
  location: 'location',
  timezone: 'timezone',
  hourlyRateCents: 'hourlyRateCents',
  currency: 'currency',
  portfolioUrl: 'portfolioUrl',
  website: 'website',
  vettingTier: 'vettingTier',
  verificationStatus: 'verificationStatus',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CategoryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  description: 'description',
  parentId: 'parentId',
  createdAt: 'createdAt'
};

exports.Prisma.OfferScalarFieldEnum = {
  id: 'id',
  freelancerId: 'freelancerId',
  title: 'title',
  description: 'description',
  categoryId: 'categoryId',
  deliveryTimeDays: 'deliveryTimeDays',
  revisionLimit: 'revisionLimit',
  priceCents: 'priceCents',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.OfferTierScalarFieldEnum = {
  id: 'id',
  offerId: 'offerId',
  name: 'name',
  description: 'description',
  deliveryTimeDays: 'deliveryTimeDays',
  revisionLimit: 'revisionLimit',
  priceCents: 'priceCents',
  features: 'features'
};

exports.Prisma.OfferAddonScalarFieldEnum = {
  id: 'id',
  offerId: 'offerId',
  title: 'title',
  description: 'description',
  priceCents: 'priceCents',
  deliveryTimeDays: 'deliveryTimeDays'
};

exports.Prisma.ProjectScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  title: 'title',
  description: 'description',
  categoryId: 'categoryId',
  budgetMinCents: 'budgetMinCents',
  budgetMaxCents: 'budgetMaxCents',
  estimatedDuration: 'estimatedDuration',
  isRemote: 'isRemote',
  location: 'location',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProposalScalarFieldEnum = {
  id: 'id',
  projectId: 'projectId',
  freelancerId: 'freelancerId',
  coverLetter: 'coverLetter',
  estimatedPriceCents: 'estimatedPriceCents',
  estimatedDuration: 'estimatedDuration',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ContractScalarFieldEnum = {
  id: 'id',
  projectId: 'projectId',
  freelancerId: 'freelancerId',
  clientId: 'clientId',
  title: 'title',
  description: 'description',
  startDate: 'startDate',
  endDate: 'endDate',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MilestoneScalarFieldEnum = {
  id: 'id',
  contractId: 'contractId',
  title: 'title',
  description: 'description',
  amountCents: 'amountCents',
  dueDate: 'dueDate',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.EscrowTransactionScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  freelancerId: 'freelancerId',
  amountCents: 'amountCents',
  currency: 'currency',
  status: 'status',
  contractId: 'contractId',
  milestoneId: 'milestoneId',
  createdAt: 'createdAt',
  releasedAt: 'releasedAt'
};

exports.Prisma.OrderScalarFieldEnum = {
  id: 'id',
  offerId: 'offerId',
  clientId: 'clientId',
  tierId: 'tierId',
  addonIds: 'addonIds',
  status: 'status',
  totalPriceCents: 'totalPriceCents',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ReviewScalarFieldEnum = {
  id: 'id',
  reviewerId: 'reviewerId',
  revieweeId: 'revieweeId',
  contractId: 'contractId',
  rating: 'rating',
  comment: 'comment',
  isVerified: 'isVerified',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MessageScalarFieldEnum = {
  id: 'id',
  senderId: 'senderId',
  recipientId: 'recipientId',
  contractId: 'contractId',
  content: 'content',
  isRead: 'isRead',
  createdAt: 'createdAt'
};

exports.Prisma.DisputeScalarFieldEnum = {
  id: 'id',
  contractId: 'contractId',
  filedById: 'filedById',
  subject: 'subject',
  description: 'description',
  status: 'status',
  resolution: 'resolution',
  createdAt: 'createdAt',
  resolvedAt: 'resolvedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};


exports.Prisma.ModelName = {
  User: 'User',
  Account: 'Account',
  Session: 'Session',
  Company: 'Company',
  JobDescription: 'JobDescription',
  Skill: 'Skill',
  Behavior: 'Behavior',
  Certification: 'Certification',
  Document: 'Document',
  ExternalLink: 'ExternalLink',
  Rule: 'Rule',
  VerificationSubmission: 'VerificationSubmission',
  Proof: 'Proof',
  Badge: 'Badge',
  Course: 'Course',
  Module: 'Module',
  Lesson: 'Lesson',
  CourseToJD: 'CourseToJD',
  CourseEnrollment: 'CourseEnrollment',
  Store: 'Store',
  Post: 'Post',
  PostLike: 'PostLike',
  Profile: 'Profile',
  Category: 'Category',
  Offer: 'Offer',
  OfferTier: 'OfferTier',
  OfferAddon: 'OfferAddon',
  Project: 'Project',
  Proposal: 'Proposal',
  Contract: 'Contract',
  Milestone: 'Milestone',
  EscrowTransaction: 'EscrowTransaction',
  Order: 'Order',
  Review: 'Review',
  Message: 'Message',
  Dispute: 'Dispute'
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
