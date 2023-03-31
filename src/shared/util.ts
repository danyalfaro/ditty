import { ChallengePayload } from "./models";

export const decodeChallengeToken = (token: string): string => {
  console.log("Decoding...");
  const decoded = Buffer.from(token, "hex").toString();
  console.log(decoded);
  return decoded;
};

export const encodeChallengeToken = (
  challengePayload: ChallengePayload
): string => {
  const payload = JSON.stringify(challengePayload);
  console.log("Encoding: ", payload);
  const encoded = Buffer.from(payload).toString("hex");
  console.log(encoded);
  decodeChallengeToken(encoded);
  return encoded;
};
