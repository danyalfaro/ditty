import { ChallengePayload, LocalStorageToken } from "./models";

export const storeToken = (
  label: string,
  token: LocalStorageToken | ChallengePayload
) => {
  localStorage.setItem(label, JSON.stringify(token));
};

export const removeToken = (label: string) => {
  localStorage.removeItem(label);
};

export const challengeTokenToShareableLink = (
  challengeToken: string
): string => {
  return `${process.env.NEXT_PUBLIC_CHALLENGE_URI}?challengeToken=${challengeToken}`;
};

export const tokenToTokenWrapper = (
  token: string,
  expiresIn: number | null = null
): LocalStorageToken => {
  return {
    dateStamp: new Date().toISOString(),
    expiresIn: expiresIn,
    token: token.toString(),
  };
};

export const decodeChallengeToken = (
  token: string
): ChallengePayload | null => {
  if (!token) return null;
  try {
    const decoded = Buffer.from(token, "hex").toString();
    return JSON.parse(decoded);
  } catch (e) {
    console.log(e);
    return null;
  }
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
