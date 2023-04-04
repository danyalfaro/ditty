import { ChallengePayload } from "./models";

export const challengeTokenToShareableLink = (
  challengeToken: string
): string => {
  return `${process.env.NEXT_PUBLIC_CHALLENGE_URI}?challengeToken=${challengeToken}`;
};


export const decodeChallengeToken = (token: string): ChallengePayload => {
  console.log("Decoding...");
  const decoded = Buffer.from(token, "hex").toString();
  console.log(decoded);
  return JSON.parse(decoded);
};

export const encodeChallengeToken = (
  challengePayload: ChallengePayload | null
): string => {
  if (challengePayload) {
    const payload = JSON.stringify(challengePayload);
    console.log("Encoding: ", payload);
    const encoded = Buffer.from(payload).toString("hex");
    console.log(encoded);
    decodeChallengeToken(encoded);
    return encoded;
  } else return "";
};
