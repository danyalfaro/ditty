import { ChallengePayload } from "./models";

export const challengeTokenToShareableLink = (
  challengeToken: string
): string => {
  return `${process.env.NEXT_PUBLIC_CHALLENGE_URI}?challengeToken=${challengeToken}`;
};


export const decodeChallengeToken = (token: string): ChallengePayload => {
  const decoded = Buffer.from(token, "hex").toString();
  return JSON.parse(decoded);
};

export const encodeChallengeToken = (
  challengePayload: ChallengePayload | null
): string => {
  if (challengePayload) {
    const payload = JSON.stringify(challengePayload);
    const encoded = Buffer.from(payload).toString("hex");
    decodeChallengeToken(encoded);
    return encoded;
  } else return "";
};
