// import jwt from 'jsonwebtoken';

// const { TOKEN_SECRET, TOKEN_EXPIRES_IN } = process.env;

// type ConfirmPayload = {
//     id: number;
//     email?: string;
//     login?: string;
// };

// type Options = {
//     expiresIn?: string;
// } ;

// const Token = {
//   generate(payload: ConfirmPayload, options: Options = {}) {
//     const expiresIn = options.expiresIn || TOKEN_EXPIRES_IN;

//     return jwt.sign(payload, TOKEN_SECRET as string, { expiresIn });
//   },

//   validate(token?: string) {
//     try {
//       return jwt.verify(token || '', TOKEN_SECRET as string);
//     } catch (_err) {
//       return null;
//     }
//   },

//   generateConfirmToken(payload: ConfirmPayload) {
//     return Token.generate(payload, { expiresIn: '1h' });
//   },
// };

// export { ConfirmPayload };
// export default Token;

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const tokenSecret = process.env.TOKEN_SECRET;
const tokenExpiry = process.env.TOKEN_EXPIRES_IN || "400h"; // Default to 400 hours

if (!tokenSecret) {
  throw new Error("Missing TOKEN_SECRET in .env");
}

type ConfirmPayload = {
  id: number;
  email?: string;
  login?: string;
};

type Options = {
  expiresIn?: string;
};

const Token = {
  generate(payload: ConfirmPayload, options: Options = {}) {
    const expiresIn = options.expiresIn || tokenExpiry;
    // Ensure `expiresIn` is a valid string (it should be by our defaults)
    if (typeof expiresIn !== "string") {
      throw new Error("TOKEN_EXPIRES_IN must be a valid string (e.g., '400h')");
    }
    // return jwt.sign(payload, tokenSecret, { expiresIn });
    return jwt.sign(payload, tokenSecret, { expiresIn } as jwt.SignOptions);
  },

  validate(token?: string) {
    try {
      return jwt.verify(token || '', tokenSecret);
    } catch (_err) {
      return null;
    }
  },

  generateConfirmToken(payload: ConfirmPayload) {
    return Token.generate(payload, { expiresIn: '1h' });
  },
};

export { ConfirmPayload };
export default Token;