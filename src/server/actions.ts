import { type Job, type CoverLetter, type User } from "wasp/entities";
import { HttpError } from "wasp/server";
import {
  type GenerateCoverLetter,
  type CreateJob,
  type UpdateCoverLetter,
  type EditCoverLetter,
  type GenerateEdit,
  type UpdateJob,
  type UpdateUser,
  type DeleteJob,
  type StripePayment,
  type StripeGpt4Payment,
  type StripeCreditsPayment,
} from "wasp/server/operations";
import fetch from 'node-fetch';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_KEY!, {
  apiVersion: '2023-08-16',
});

const DOMAIN = process.env.WASP_WEB_CLIENT_URL || 'http://localhost:3000';

// Anschreiben Pilot differentiation (see brain/projects/micro-saas-dach-spec-cover-letter-cv.md):
// correct German business-letter conventions (DIN 5008) is the actual product wedge against
// JobStep/Rezi/MakeMyCV/etc, not just "AI writes it for you" — so this instruction is
// unconditional, not an afterthought bolted onto the original English-first prompt.
const DIN_5008_INSTRUCTIONS = `If the job description (and therefore the cover letter) is in German, strictly follow German
business-letter conventions (DIN 5008), not American cover-letter conventions:
- Formal salutation: "Sehr geehrte Damen und Herren," if no contact person is named in the
  job description, or "Sehr geehrte/r Frau/Herr [Nachname]," if one is.
- A short, bold "Betreff" (subject) line before the salutation, naming the position applied
  for (e.g. "Bewerbung als [Jobtitel]").
- Formal closing: "Mit freundlichen Grüßen" followed by the applicant's name on its own line
  — never an American-style sign-off like "Best," or "Sincerely,".
- Formal "Sie" register throughout, not "du".
- No emoji, no exclamation marks used for enthusiasm, no American-style self-promotion
  ("I am the perfect candidate!") — German cover letters are more measured and rely on
  concrete, specific matches between the applicant's experience and the role.
For any other language, write naturally in that language's own standard cover-letter
conventions instead of applying the above.`;

const gptConfig = {
  completeCoverLetter: `You are a cover letter generator.
You will be given a job description along with the job applicant's resume.
You will write a cover letter for the applicant that matches their past experiences from the resume with the job description. Write the cover letter in the same language as the job description provided!
Rather than simply outlining the applicant's past experiences, you will give more detail and explain how those experiences will help the applicant succeed in the new job.
You will write the cover letter in a modern, professional style without being too formal for the language it's written in.
${DIN_5008_INSTRUCTIONS}`,
  coverLetterWithAWittyRemark: `You are a cover letter generator.
You will be given a job description along with the job applicant's resume.
You will write a cover letter for the applicant that matches their past experiences from the resume with the job description. Write the cover letter in the same language as the job description provided!
Rather than simply outlining the applicant's past experiences, you will give more detail and explain how those experiences will help the applicant succeed in the new job.
You will write the cover letter in a modern, relaxed style, as a modern employee might do naturally.
${DIN_5008_INSTRUCTIONS}
If the letter is in German: do NOT include a joke — a joke inside a formal Sie-register
German Bewerbungsschreiben reads as a mistake, not as personality, and undermines the DIN
5008 formality above. Instead, close the final paragraph before the Grußformel with one
warm, genuine sentence about looking forward to the role. If the letter is in any other
language, include a light, job-related joke at the end as originally intended.`,
  ideasForCoverLetter:
    "You are a cover letter idea generator. You will be given a job description along with the job applicant's resume. You will generate a bullet point list of ideas for the applicant to use in their cover letter. ",
};

type CoverLetterPayload = Pick<CoverLetter, 'title' | 'jobId'> & {
  content: string;
  description: string;
  isCompleteCoverLetter: boolean;
  includeWittyRemark: boolean;
  temperature: number;
  gptModel: string;
};

type OpenAIResponse = {
  id: string;
  object: string;
  created: number;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  choices: [
    {
      index: number;
      message: {
        role: string;
        content: string;
      };
      finish_reason: string;
    }
  ];
  error?: {
    message?: string;
  };
};

async function checkIfUserPaid({ context }: { context: any }) {
  if (!context.user.hasPaid && !context.user.credits) {
    throw new HttpError(402, 'User must pay to continue');
  }
  if (context.user.subscriptionStatus === 'past_due') {
    throw new HttpError(402, 'Your subscription is past due. Please update your payment method.');
  }
}

// Security: found while checking the actual code (Saskia asked directly, 2026-09-23) —
// a paying user previously had NO limit on how many times they could call the OpenAI
// endpoint. Free users are naturally capped by their credit count, but hasPaid users
// were not capped at all: a compromised account or a script could generate unbounded
// requests, each a real OpenAI cost with nothing to stop it. This closes that gap using
// data already in the DB (CoverLetter.createdAt), no new table needed.
// In-memory sliding window, shared by every action that calls OpenAI (generateCoverLetter,
// generateEdit — updateCoverLetter goes through generateCoverLetter so it's covered too).
// Deliberately not DB-backed: this needs to catch generateEdit calls too, which don't create
// a CoverLetter row to count. Known limitation: resets if the server restarts, and won't
// coordinate across multiple server instances if this ever runs on more than one — fine for
// a single Render instance at this stage, revisit (e.g. a Redis-backed limiter) before
// scaling to more than one server process.
const MAX_AI_CALLS_PER_HOUR = 20;
const aiCallLog = new Map<number, number[]>();

function checkRateLimit({ context }: { context: any }) {
  const userId = context.user.id;
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  const recent = (aiCallLog.get(userId) || []).filter((t) => t > oneHourAgo);
  if (recent.length >= MAX_AI_CALLS_PER_HOUR) {
    throw new HttpError(
      429,
      `Zu viele Anfragen. Bitte warte etwas, bevor du es erneut versuchst (max. ${MAX_AI_CALLS_PER_HOUR} pro Stunde).`
    );
  }
  recent.push(Date.now());
  aiCallLog.set(userId, recent);
}

// Security: no length cap previously existed on what got sent to OpenAI — pasting an
// oversized resume or job description would still be sent as-is, at real per-token cost,
// with no feedback to the user before the request went out. These limits are generous for
// any real CV/job posting and only block deliberately oversized input.
const MAX_RESUME_LENGTH = 20_000;
const MAX_DESCRIPTION_LENGTH = 10_000;

function checkInputLength({ content, description }: { content?: string; description?: string }) {
  if (content && content.length > MAX_RESUME_LENGTH) {
    throw new HttpError(400, `Der Lebenslauf-Text ist zu lang (max. ${MAX_RESUME_LENGTH.toLocaleString('de-DE')} Zeichen).`);
  }
  if (description && description.length > MAX_DESCRIPTION_LENGTH) {
    throw new HttpError(400, `Die Stellenanzeige ist zu lang (max. ${MAX_DESCRIPTION_LENGTH.toLocaleString('de-DE')} Zeichen).`);
  }
}

export const generateCoverLetter: GenerateCoverLetter<CoverLetterPayload, CoverLetter> = async (
  { jobId, title, content, description, isCompleteCoverLetter, includeWittyRemark, temperature, gptModel },
  context
) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  await checkIfUserPaid({ context })
  checkRateLimit({ context });
  checkInputLength({ content, description });

  let command;
  if (isCompleteCoverLetter) {
    command = includeWittyRemark ? gptConfig.coverLetterWithAWittyRemark : gptConfig.completeCoverLetter;
  } else {
    command = gptConfig.ideasForCoverLetter;
  }

  console.log(' gpt model: ', gptModel);

  const payload = {
    model: gptModel,
    messages: [
      {
        role: 'system',
        content: command,
      },
      {
        role: 'user',
        content: `My Resume: ${content}. Job title: ${title} Job Description: ${description}.`,
      },
    ],
    temperature,
  };

  let json: OpenAIResponse;

  try {
    if (!context.user.hasPaid && !context.user.credits) {
      throw new HttpError(402, 'User has not paid or is out of credits');
    } else if (context.user.credits && !context.user.hasPaid) {
      console.log('decrementing credits \n\n');
      await context.entities.User.update({
        where: { id: context.user.id },
        data: {
          credits: {
            decrement: 1,
          },
        },
      });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
      },
      method: 'POST',
      body: JSON.stringify(payload),
    });

    json = (await response.json()) as OpenAIResponse;

    if (json?.error) throw new HttpError(500, json?.error?.message || 'Something went wrong');

    return context.entities.CoverLetter.create({
      data: {
        title,
        content: json?.choices[0].message.content,
        tokenUsage: json?.usage.completion_tokens,
        user: { connect: { id: context.user.id } },
        job: { connect: { id: jobId } },
      },
    });
  } catch (error: any) {
    if (!context.user.hasPaid && error?.statusCode != 402) {
      await context.entities.User.update({
        where: { id: context.user.id },
        data: {
          credits: {
            increment: 1,
          },
        },
      });
    }
    console.error(error);
    throw new HttpError(error.statusCode || 500, error.message || 'Something went wrong');
  }
};

export const generateEdit: GenerateEdit<
  { content: string; improvement: string },
  string
> = async ({ content, improvement }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  await checkIfUserPaid({ context });
  checkRateLimit({ context });
  checkInputLength({ content });

  let command;
  command = `You are a cover letter editor. You will be given a piece of isolated text from within a cover letter and told how you can improve it. Only respond with the revision. Make sure the revision is in the same language as the given isolated text.`;

  const payload = {
    model: context.user.gptModel === 'gpt-4' || context.user.gptModel === 'gpt-4o' ? 'gpt-4o' : 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: command,
      },
      {
        role: 'user',
        content: `Isolated text from within cover letter: ${content}. It should be improved by making it more: ${improvement}`,
      },
    ],
    temperature: 0.5,
  };

  let json: OpenAIResponse;

  try {
    if (!context.user.hasPaid && !context.user.credits) {
      throw new HttpError(402, 'User has not paid or is out of credits');
    } else if (context.user.credits && !context.user.hasPaid) {
      console.log('decrementing credits \n\n');
      await context.entities.User.update({
        where: { id: context.user.id },
        data: {
          credits: {
            decrement: 1,
          },
        },
      });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
      },
      method: 'POST',
      body: JSON.stringify(payload),
    });

    json = (await response.json()) as OpenAIResponse;
    if (json?.choices[0].message.content.length) {
      return json?.choices[0].message.content;
    } else {
      throw new HttpError(500, 'GPT returned an empty response');
    }
  } catch (error: any) {
    if (!context.user.hasPaid && error?.statusCode != 402) {
      await context.entities.User.update({
        where: { id: context.user.id },
        data: {
          credits: {
            increment: 1,
          },
        },
      });
    }
    console.error(error);
    throw new HttpError(error.statusCode || 500, error.message || 'Something went wrong');
  }
};

export type JobPayload = Pick<Job, 'title' | 'company' | 'location' | 'description'>;

export const createJob: CreateJob<JobPayload, Job> = ({ title, company, location, description }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.Job.create({
    data: {
      title,
      description,
      location,
      company,
      user: { connect: { id: context.user.id } },
    },
  });
};

export type UpdateJobPayload = Pick<Job, 'id' | 'title' | 'company' | 'location' | 'description' | 'isCompleted'>;

export const updateJob: UpdateJob<UpdateJobPayload, Job> = (
  { id, title, company, location, description, isCompleted },
  context
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.Job.update({
    where: {
      id,
    },
    data: {
      title,
      description,
      location,
      company,
      isCompleted,
    },
  });
};

export type UpdateCoverLetterPayload = Pick<Job, 'id' | 'description'> &
  Pick<CoverLetter, 'content'> & {
    isCompleteCoverLetter: boolean;
    includeWittyRemark: boolean;
    temperature: number;
    gptModel: string;
  };

export const updateCoverLetter: UpdateCoverLetter<UpdateCoverLetterPayload, string> = async (
  { id, description, content, isCompleteCoverLetter, includeWittyRemark, temperature, gptModel },
  context
) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  await checkIfUserPaid({ context });

  const job = await context.entities.Job.findFirst({
    where: {
      id,
      user: { id: context.user.id },
    },
  });

  if (!job) {
    throw new HttpError(404, 'Job not found');
  }

  const coverLetter = await generateCoverLetter(
    {
      jobId: id,
      title: job.title,
      content,
      description: job.description,
      isCompleteCoverLetter,
      includeWittyRemark,
      temperature,
      gptModel,
    },
    context
  );

  await context.entities.Job.update({
    where: {
      id,
    },
    data: {
      description,
      coverLetter: { connect: { id: coverLetter.id } },
    },
  });

  return coverLetter.id;
};

export const editCoverLetter: EditCoverLetter<{ coverLetterId: string; content: string }, CoverLetter> = (
  { coverLetterId, content },
  context
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.CoverLetter.update({
    where: {
      id: coverLetterId,
    },
    data: {
      content,
    },
  });
};

export const deleteJob: DeleteJob<{ jobId: string }, { count: number }> = ({ jobId }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  if (!jobId) {
    throw new HttpError(401);
  }

  return context.entities.Job.deleteMany({
    where: {
      id: jobId,
      userId: context.user.id,
    },
  });
};

type UpdateUserArgs = Partial<Pick<User, 'id' | 'notifyPaymentExpires' | 'gptModel'>>;
type UserWithoutPassword = Omit<User, 'password'>;

export const updateUser: UpdateUser<UpdateUserArgs, UserWithoutPassword> = async (
  { notifyPaymentExpires, gptModel },
  context
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.User.update({
    where: {
      id: context.user.id,
    },
    data: {
      notifyPaymentExpires,
      gptModel,
    },
    select: {
      id: true,
      email: true,
      username: true,
      hasPaid: true,
      datePaid: true,
      notifyPaymentExpires: true,
      checkoutSessionId: true,
      stripeId: true,
      credits: true,
      gptModel: true,
      subscriptionStatus: true,
    },
  });
};

type UpdateUserResult = Pick<User, 'id' | 'email' | 'hasPaid'>;

function dontUpdateUser(user: UserWithoutPassword): Promise<UserWithoutPassword> {
  return new Promise((resolve) => {
    resolve(user);
  });
}

type StripePaymentResult = {
  sessionUrl: string | null;
  sessionId: string;
};

export const stripePayment: StripePayment<void, StripePaymentResult> = async (_args, context) => {
  if (!context.user || !context.user.email) {
    throw new HttpError(401, 'User or email not found');
  }
  let customer: Stripe.Customer;
  const stripeCustomers = await stripe.customers.list({
    email: context.user.email,
  });
  if (!stripeCustomers.data.length) {
    console.log('creating customer');
    customer = await stripe.customers.create({
      email: context.user.email,
    });
  } else {
    console.log('using existing customer');
    customer = stripeCustomers.data[0];
  }

  const session: Stripe.Checkout.Session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: process.env.PRODUCT_PRICE_ID!,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${DOMAIN}/checkout?success=true`,
    cancel_url: `${DOMAIN}/checkout?canceled=true`,
    automatic_tax: { enabled: true },
    customer_update: {
      address: 'auto',
    },
    customer: customer.id,
  });

  await context.entities.User.update({
    where: {
      id: context.user.id,
    },
    data: {
      checkoutSessionId: session?.id ?? null,
      stripeId: customer.id ?? null,
    },
  });

  return new Promise((resolve, reject) => {
    if (!session) {
      reject(new HttpError(402, 'Could not create a Stripe session'));
    } else {
      resolve({
        sessionUrl: session.url,
        sessionId: session.id,
      });
    }
  });
};

export const stripeGpt4Payment: StripeGpt4Payment<void, StripePaymentResult> = async (_args, context) => {
  if (!context.user || !context.user.email) {
    throw new HttpError(401, 'User or email not found');
  }
  let customer: Stripe.Customer;
  const stripeCustomers = await stripe.customers.list({
    email: context.user.email,
  });
  if (!stripeCustomers.data.length) {
    console.log('creating customer');
    customer = await stripe.customers.create({
      email: context.user.email,
    });
  } else {
    console.log('using existing customer');
    customer = stripeCustomers.data[0];
  }

  const session: Stripe.Checkout.Session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: process.env.GPT4_PRICE_ID!,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${DOMAIN}/checkout?success=true`,
    cancel_url: `${DOMAIN}/checkout?canceled=true`,
    automatic_tax: { enabled: true },
    customer_update: {
      address: 'auto',
    },
    customer: customer.id,
  });

  await context.entities.User.update({
    where: {
      id: context.user.id,
    },
    data: {
      checkoutSessionId: session?.id ?? null,
      stripeId: customer.id ?? null,
    },
  });

  return new Promise((resolve, reject) => {
    if (!session) {
      reject(new HttpError(402, 'Could not create a Stripe session'));
    } else {
      resolve({
        sessionUrl: session.url,
        sessionId: session.id,
      });
    }
  });
};

export const stripeCreditsPayment: StripeCreditsPayment<void, StripePaymentResult> = async (_args, context) => {
  if (!context.user || !context.user.email) {
    throw new HttpError(401, 'User or email not found');
  }
  let customer: Stripe.Customer;
  const stripeCustomers = await stripe.customers.list({
    email: context.user.email,
  });
  if (!stripeCustomers.data.length) {
    console.log('creating customer');
    customer = await stripe.customers.create({
      email: context.user.email,
    });
  } else {
    console.log('using existing customer');
    customer = stripeCustomers.data[0];
  }

  const session: Stripe.Checkout.Session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: process.env.PRODUCT_CREDITS_PRICE_ID!,
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${DOMAIN}/checkout?credits=true`,
    cancel_url: `${DOMAIN}/checkout?canceled=true`,
    automatic_tax: { enabled: true },
    customer_update: {
      address: 'auto',
    },
    customer: customer.id,
  });

  await context.entities.User.update({
    where: {
      id: context.user.id,
    },
    data: {
      stripeId: customer.id ?? null,
    },
  });

  return new Promise((resolve, reject) => {
    if (!session) {
      reject(new HttpError(402, 'Could not create a Stripe session'));
    } else {
      resolve({
        sessionUrl: session.url,
        sessionId: session.id,
      });
    }
  });
};
